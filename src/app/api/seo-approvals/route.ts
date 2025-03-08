import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// GET /api/seo-approvals - Get all SEO approvals (with optional filters)
export async function GET(request: NextRequest) {
  console.log("GET /api/seo-approvals");

  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Get user session for role-based access control
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user role from database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userError || !userData) {
      console.error("Error fetching user role:", userError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Build query based on user role and filters
    let query = supabase.from("seo_approvals").select(`
      id,
      video_id,
      videos!inner(title),
      editor_id,
      users!inner(name, email),
      submitted_at,
      status,
      original_content,
      proposed_content,
      editor_notes,
      admin_feedback
    `);

    // Apply status filter if provided
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // Apply search filter if provided
    if (search) {
      // This assumes you have a text search index or can search in JSON fields
      // Actual implementation will depend on your database structure
      query = query.or(
        `videos.title.ilike.%${search}%, users.name.ilike.%${search}%`
      );
    }

    // Get results
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching SEO approvals:", error);
      return NextResponse.json(
        { error: "Failed to fetch SEO approvals" },
        { status: 500 }
      );
    }

    // Format data for frontend
    const formattedData = data.map((item) => ({
      id: item.id,
      videoId: item.video_id,
      videoTitle: item.videos[0].title,
      editorId: item.editor_id,
      editorName: item.users[0].name,
      submittedAt: item.submitted_at,
      status: item.status,
      originalContent: item.original_content,
      proposedContent: item.proposed_content,
      editorNotes: item.editor_notes,
      adminFeedback: item.admin_feedback,
    }));

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error("Error in SEO approvals API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/seo-approvals - Create a new SEO approval request
export async function POST(request: NextRequest) {
  console.log("POST /api/seo-approvals");

  try {
    const body = await request.json();

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request body
    if (!body.videoId || !body.proposedContent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert new approval request
    const { data, error } = await supabase
      .from("seo_approvals")
      .insert({
        video_id: body.videoId,
        editor_id: session.user.id,
        status: "pending",
        original_content: body.originalContent,
        proposed_content: body.proposedContent,
        editor_notes: body.editorNotes,
        submitted_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Error creating SEO approval:", error);
      return NextResponse.json(
        { error: "Failed to create SEO approval" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data[0] });
  } catch (error) {
    console.error("Error in SEO approvals API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

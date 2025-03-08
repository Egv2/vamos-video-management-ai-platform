import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// GET /api/seo-approvals/stats - Get SEO approval statistics
export async function GET() {
  console.log("GET /api/seo-approvals/stats");

  try {
    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Get user session for role-based access control
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get approval statistics
    const { data, error } = await supabase.rpc("get_approval_stats");

    if (error) {
      console.error("Error fetching SEO approval statistics:", error);
      return NextResponse.json(
        { error: "Failed to fetch SEO approval statistics" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in SEO approval statistics API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

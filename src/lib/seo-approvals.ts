import { toast } from "sonner";

export type SeoApprovalStatus = "pending" | "approved" | "rejected";

export interface SeoApprovalItem {
  id: string;
  videoId: string;
  videoTitle: string;
  editorId: string;
  editorName: string;
  submittedAt: string;
  status: SeoApprovalStatus;
  originalContent: {
    title: string;
    description: string;
    keywords: string;
    categories: Array<{ key: string; name: string }>;
  };
  proposedContent: {
    title: string;
    description: string;
    keywords: string;
    categories: Array<{ key: string; name: string }>;
  };
  editorNotes?: string;
  adminFeedback?: string;
}

export interface SeoApprovalStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  pendingByEditor: Record<string, number>;
}

export interface FeedbackSubmitEvent {
  videoId: string;
  feedback: string;
}

/**
 * Fetches all SEO approvals with optional filtering
 */
export async function fetchSeoApprovals(
  status?: SeoApprovalStatus | "all",
  search?: string
): Promise<SeoApprovalItem[]> {
  console.log("Fetching SEO approvals", { status, search });

  try {
    let url = "/api/seo-approvals";
    const params = new URLSearchParams();

    if (status && status !== "all") {
      params.append("status", status);
    }

    if (search) {
      params.append("search", search);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch SEO approvals");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching SEO approvals:", error);
    toast.error("Failed to load SEO approvals");
    return [];
  }
}

/**
 * Fetches a specific SEO approval by ID
 */
export async function fetchSeoApproval(
  id: string
): Promise<SeoApprovalItem | null> {
  console.log("Fetching SEO approval", { id });

  try {
    const response = await fetch(`/api/seo-approvals/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch SEO approval");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching SEO approval:", error);
    toast.error("Failed to load SEO approval details");
    return null;
  }
}

/**
 * Approves a SEO approval
 */
export async function approveSeoContent(
  id: string,
  feedback?: string
): Promise<boolean> {
  console.log("Approving SEO content", { id, feedback });

  try {
    const response = await fetch(`/api/seo-approvals/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "approved",
        feedback,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to approve SEO content");
    }

    toast.success("SEO content approved successfully");
    return true;
  } catch (error) {
    console.error("Error approving SEO content:", error);
    toast.error("Failed to approve SEO content");
    return false;
  }
}

/**
 * Rejects a SEO approval
 */
export async function rejectSeoContent(
  id: string,
  feedback?: string
): Promise<boolean> {
  console.log("Rejecting SEO content", { id, feedback });

  try {
    const response = await fetch(`/api/seo-approvals/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "rejected",
        feedback,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to reject SEO content");
    }

    toast.success("SEO content rejected successfully");
    return true;
  } catch (error) {
    console.error("Error rejecting SEO content:", error);
    toast.error("Failed to reject SEO content");
    return false;
  }
}

/**
 * Submits feedback for a SEO approval
 */
export async function submitSeoFeedback(
  id: string,
  feedback: string
): Promise<boolean> {
  console.log("Submitting SEO feedback", { id, feedback });

  try {
    const response = await fetch(`/api/seo-approvals/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedback,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to submit feedback");
    }

    toast.success("Feedback submitted successfully");
    return true;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    toast.error("Failed to submit feedback");
    return false;
  }
}

/**
 * Fetches SEO approval statistics
 */
export async function fetchSeoApprovalStats(): Promise<SeoApprovalStats | null> {
  console.log("Fetching SEO approval statistics");

  try {
    const response = await fetch("/api/seo-approvals/stats");

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch SEO approval statistics");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching SEO approval statistics:", error);
    return null;
  }
}

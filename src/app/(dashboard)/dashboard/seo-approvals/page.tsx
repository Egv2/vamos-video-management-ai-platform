"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { format } from "date-fns";
import { SeoApprovalDialog } from "@/components/seo/seo-approval-dialog";
import { SeoApprovalStatus, SeoApprovalItem } from "@/lib/seo-approvals";
import { ApprovalData } from "@/types/seo";
import { FeedbackSubmitEvent } from "@/types/seo";

export default function SeoApprovalsPage() {
  console.log("[SeoApprovalsPage] Rendering page");
  const { t } = useTranslations();
  const [approvals, setApprovals] = useState<SeoApprovalItem[]>([]);

  // State for filtering and searching
  const [filter, setFilter] = useState<SeoApprovalStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredApprovals, setFilteredApprovals] = useState<SeoApprovalItem[]>(
    []
  );

  // State for selected approval item and dialog
  const [selectedApproval, setSelectedApproval] =
    useState<SeoApprovalItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State for loading states
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [userData, setUserData] = useState<{ role: string } | null>(null);

  // Add this useEffect to fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      console.log("Fetching user data");
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Filter approvals based on status and search query
  useEffect(() => {
    console.log(
      "Filtering approvals with filter:",
      filter,
      "and search:",
      searchQuery
    );

    let filtered = [...approvals];

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((item) => item.status === filter);
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.videoTitle.toLowerCase().includes(query) ||
          item.editorName.toLowerCase().includes(query)
      );
    }

    setFilteredApprovals(filtered);
  }, [filter, searchQuery, approvals]);

  // Handle view details
  const handleViewDetails = (approval: SeoApprovalItem) => {
    console.log("Viewing details for approval:", approval.id);
    setSelectedApproval(approval);
    setIsDialogOpen(true);
  };

  // Handle approve
  const handleApprove = async (id: string) => {
    console.log("Approving SEO content:", id);
    setIsApproving(true);

    try {
      const response = await fetch(`/api/seo-approvals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      if (response.ok) {
        // Use updatedApprovals or remove the variable
        const updatedApprovals = approvals.map((approval) =>
          approval.id === id
            ? { ...approval, status: "approved" as SeoApprovalStatus }
            : approval
        );
        setApprovals(updatedApprovals);

        // Close dialog if open
        if (isDialogOpen && selectedApproval?.id === id) {
          setIsDialogOpen(false);
        }

        toast.success(t("seoApprovals.approveSuccess"));
      }
    } catch (error) {
      console.error("Error approving SEO content:", error);
      toast.error(t("seoApprovals.actionError"));
    } finally {
      setIsApproving(false);
    }
  };

  // Handle reject
  const handleReject = async (id: string) => {
    console.log("Rejecting SEO content:", id);
    setIsRejecting(true);

    try {
      const response = await fetch(`/api/seo-approvals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (response.ok) {
        // Use updatedApprovals or remove the variable
        const updatedApprovals = approvals.map((approval) =>
          approval.id === id
            ? { ...approval, status: "rejected" as SeoApprovalStatus }
            : approval
        );
        setApprovals(updatedApprovals);

        // Close dialog if open
        if (isDialogOpen && selectedApproval?.id === id) {
          setIsDialogOpen(false);
        }

        toast.success(t("seoApprovals.rejectSuccess"));
      }
    } catch (error) {
      console.error("Error rejecting SEO content:", error);
      toast.error(t("seoApprovals.actionError"));
    } finally {
      setIsRejecting(false);
    }
  };

  // Handle submit feedback
  const handleSubmitFeedback = async (
    event: FeedbackSubmitEvent
  ): Promise<void> => {
    console.log(
      "Submitting feedback for approval:",
      event.videoId,
      event.feedback
    );
    try {
      const response = await fetch(`/api/seo-approvals/${event.videoId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: event.feedback }),
      });

      if (!response.ok) throw new Error("Failed to submit feedback");
      toast.success(t("seoApprovals.details.feedbackSuccess"));
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(t("seoApprovals.details.feedbackError"));
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Get status badge
  const getStatusBadge = (status: SeoApprovalStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Add this function to your existing page component
  const handleUpdateAndApprove = async (data: ApprovalData): Promise<void> => {
    console.log("Updating and approving SEO content:", data);
    setIsApproving(true);

    try {
      const response = await fetch(
        `/api/seo-approvals/${data.id}/update-and-approve`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proposedContent: data.proposedContent }),
        }
      );

      if (!response.ok) throw new Error("Failed to update and approve");

      setFilteredApprovals((prev) =>
        prev.map((item) =>
          item.id === data.id
            ? {
                ...item,
                status: "approved",
                proposedContent: data.proposedContent,
              }
            : item
        )
      );
      setSelectedApproval(null);
      toast.success(t("seoApprovals.approveSuccess"));
    } catch (error) {
      console.error("Error updating and approving:", error);
      toast.error(t("seoApprovals.actionError"));
    } finally {
      setIsApproving(false);
    }
  };

  useEffect(() => {
    console.log("[SeoApprovalsPage] Component mounted");
    return () => {
      console.log("[SeoApprovalsPage] Component unmounted");
    };
  }, []);

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("seoApprovals.pageTitle")}
          </h1>
          <p className="text-muted-foreground">
            {t("seoApprovals.pageDescription")}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <Select
            value={filter}
            onValueChange={(value) =>
              setFilter(value as SeoApprovalStatus | "all")
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("seoApprovals.filterAll")}</SelectItem>
              <SelectItem value="pending">
                {t("seoApprovals.filterPending")}
              </SelectItem>
              <SelectItem value="approved">
                {t("seoApprovals.filterApproved")}
              </SelectItem>
              <SelectItem value="rejected">
                {t("seoApprovals.filterRejected")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("seoApprovals.searchPlaceholder")}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Approvals Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filter === "all"
              ? t("seoApprovals.pendingApprovals")
              : filter === "approved"
              ? t("seoApprovals.approvedContent")
              : filter === "rejected"
              ? t("seoApprovals.rejectedContent")
              : t("seoApprovals.pendingApprovals")}
          </CardTitle>
          <CardDescription>
            {filteredApprovals.length} {filter === "all" ? "total" : filter}{" "}
            items
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredApprovals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("seoApprovals.videoTitle")}</TableHead>
                  <TableHead>{t("seoApprovals.editor")}</TableHead>
                  <TableHead>{t("seoApprovals.submittedDate")}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">
                    {t("seoApprovals.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApprovals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell className="font-medium">
                      {approval.videoTitle}
                    </TableCell>
                    <TableCell>{approval.editorName}</TableCell>
                    <TableCell>{formatDate(approval.submittedAt)}</TableCell>
                    <TableCell>{getStatusBadge(approval.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(approval)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {t("seoApprovals.viewDetails")}
                        </Button>

                        {approval.status === "pending" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleApprove(approval.id)}
                              disabled={isApproving}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {isApproving
                                ? t("seoApprovals.approving")
                                : t("seoApprovals.approve")}
                            </Button>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleReject(approval.id)}
                              disabled={isRejecting}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              {isRejecting
                                ? t("seoApprovals.rejecting")
                                : t("seoApprovals.reject")}
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t("seoApprovals.noApprovals")}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO Approval Dialog */}
      {selectedApproval && (
        <SeoApprovalDialog
          approval={selectedApproval}
          isOpen={!!selectedApproval}
          onClose={() => setSelectedApproval(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onSubmitFeedback={handleSubmitFeedback}
          onUpdateAndApprove={handleUpdateAndApprove}
          isApproving={isApproving}
          isRejecting={isRejecting}
          isAdmin={userData?.role === "admin"} // Pass the user role
        />
      )}
    </div>
  );
}

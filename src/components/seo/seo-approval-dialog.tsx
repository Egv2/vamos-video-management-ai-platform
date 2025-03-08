"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "@/hooks/use-translations";
import { SeoApprovalItem, FeedbackSubmitEvent } from "@/lib/seo-approvals";
import { ApprovalData } from "@/types/seo";
import { toast } from "sonner";

interface SeoApprovalDialogProps {
  approval: SeoApprovalItem;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onSubmitFeedback: (event: FeedbackSubmitEvent) => Promise<void>;
  onUpdateAndApprove: (data: ApprovalData) => Promise<void>;
  isApproving: boolean;
  isRejecting: boolean;
  isAdmin?: boolean;
}

export function SeoApprovalDialog({
  approval,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onUpdateAndApprove,
  isApproving,
  isRejecting,
}: SeoApprovalDialogProps) {
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState("overview");

  const handleApprove = async () => {
    console.log("[SeoApprovalDialog] Processing approval request");
    try {
      await onApprove(approval.id);
      toast.success(t("seoApprovals.success.approved"));
      onClose();
      console.log("[SeoApprovalDialog] Approval successful");
    } catch (error) {
      console.error("[SeoApprovalDialog] Approval failed:", error);
      toast.error(t("seoApprovals.error.approvalFailed"));
    }
  };

  const handleReject = async () => {
    console.log("Rejecting:", approval.id);
    try {
      await onReject(approval.id);
      toast.success(t("seoApprovals.success.rejected"));
      onClose();
    } catch (error) {
      console.error("Rejection failed:", error);
      toast.error(t("seoApprovals.error.rejectionFailed"));
    }
  };

  const handleUpdateAndApprove = async () => {
    console.log("Updating and approving:", approval.id);
    try {
      await onUpdateAndApprove(approval);
      toast.success(t("seoApprovals.success.updatedAndApproved"));
      onClose();
    } catch (error) {
      console.error("Update and approve failed:", error);
      toast.error(t("seoApprovals.error.updateAndApproveFailed"));
    }
  };

  const renderDiff = (original: string, modified: string) => (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="p-4 border rounded">
        <h5 className="font-medium mb-2">{t("seoApprovals.diff.original")}</h5>
        <p className="whitespace-pre-wrap">{original}</p>
      </div>
      <div className="p-4 border rounded">
        <h5 className="font-medium mb-2">{t("seoApprovals.diff.modified")}</h5>
        <p className="whitespace-pre-wrap">{modified}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("seoApprovals.details.title")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">
                {t("seoApprovals.tabs.overview")}
              </TabsTrigger>
              <TabsTrigger value="details">
                {t("seoApprovals.tabs.details")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">
                    {t("seoApprovals.videoInfo.title")}
                  </h3>
                  <p>{approval.videoTitle}</p>
                </div>
                <div>
                  <h3 className="font-medium">
                    {t("seoApprovals.status.title")}
                  </h3>
                  <p>{approval.status}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">
                  {t("seoApprovals.diff.titleComparison")}
                </h4>
                {renderDiff(
                  approval.originalContent.title,
                  approval.proposedContent.title
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">
                  {t("seoApprovals.diff.descriptionComparison")}
                </h4>
                {renderDiff(
                  approval.originalContent.description,
                  approval.proposedContent.description
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleApprove} disabled={isApproving}>
            {t("seoApprovals.actions.approve")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isRejecting}
          >
            {t("seoApprovals.actions.reject")}
          </Button>
          <Button onClick={handleUpdateAndApprove} disabled={isApproving}>
            {t("seoApprovals.actions.updateAndApprove")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

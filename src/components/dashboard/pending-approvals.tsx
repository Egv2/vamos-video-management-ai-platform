"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PendingApproval {
  id: string;
  videoTitle: string;
  editorName: string;
  submittedAt: string;
}

interface PendingApprovalsProps {
  approvals: PendingApproval[];
  onViewDetails: (id: string) => void;
}

export function PendingApprovals({
  approvals,
  onViewDetails,
}: PendingApprovalsProps) {
  console.log("Rendering PendingApprovals component");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        {approvals.length === 0 ? (
          <p className="text-muted-foreground">No pending approvals</p>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{approval.videoTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    By {approval.editorName} • {approval.submittedAt}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log(
                      "View details clicked for approval:",
                      approval.id
                    );
                    onViewDetails(approval.id);
                  }}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

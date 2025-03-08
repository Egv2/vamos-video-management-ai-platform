"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/hooks/use-translations";
import { VideoPlayer } from "@/components/video/video-player";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, Trash } from "lucide-react";

interface VideoDetailDialogProps {
  video: {
    id: string;
    title: string;
    url: string;
    status: string;
    createdAt: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (videoId: string, newTitle: string) => Promise<void>;
  onDelete: (videoId: string) => Promise<void>;
}

export function VideoDetailDialog({
  video,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: VideoDetailDialogProps) {
  const { t } = useTranslations();
  const [editedTitle, setEditedTitle] = useState(video?.title || "");

  console.log("Rendering VideoDetailDialog", { videoId: video?.id });

  const handleSave = async () => {
    try {
      if (!video) return;
      console.log("Saving video details", {
        videoId: video.id,
        newTitle: editedTitle,
      });
      await onSave(video.id, editedTitle);
      toast.success(t("videos.edit.success"));
      onClose();
    } catch (error) {
      console.error("Error saving video details:", error);
      toast.error(t("videos.edit.error"));
    }
  };

  const handleDelete = async () => {
    try {
      if (!video) return;
      console.log("Deleting video", { videoId: video.id });
      await onDelete(video.id);
      toast.success(t("videos.delete.success"));
      onClose();
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error(t("videos.delete.error"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("videos.detail.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <VideoPlayer src={video?.url || ""} />
          </div>
          <div className="space-y-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder={t("videos.detail.titlePlaceholder")}
            />
            <div className="flex items-center gap-2">
              <Badge>{video?.status}</Badge>
              <span className="text-sm text-muted-foreground">
                {video?.createdAt}
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="destructive" onClick={handleDelete}>
              <Trash className="h-4 w-4 mr-2" />
              {t("common.delete")}
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {t("common.save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

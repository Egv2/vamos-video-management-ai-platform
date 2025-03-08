"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/hooks/use-translations";
import { toast } from "sonner";

interface SubtitleUploadDialogProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

export function SubtitleUploadDialog({
  videoId,
  isOpen,
  onClose,
  onUpload,
}: SubtitleUploadDialogProps) {
  const { t } = useTranslations();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File selected:", e.target.files?.[0]);
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith(".srt")) {
      setFile(selectedFile);
    } else {
      toast.error(t("subtitles.error.invalidFormat"));
    }
  };

  const handleUpload = async () => {
    console.log("Uploading subtitle file for video:", videoId);
    if (!file) return;

    setIsUploading(true);
    try {
      await onUpload(file);
      toast.success(t("subtitles.success.uploaded"));
      onClose();
    } catch (error) {
      console.error("Subtitle upload failed:", error);
      toast.error(t("subtitles.error.uploadFailed"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("subtitles.upload.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="file"
            accept=".srt"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleUpload} disabled={!file || isUploading}>
              {isUploading
                ? t("subtitles.upload.uploading")
                : t("subtitles.upload.submit")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";

interface VideoPreviewProps {
  videoUrl: string;
  title?: string;
  isAdmin?: boolean;
}

export function VideoPreview({
  videoUrl,
  title,
  isAdmin = false,
}: VideoPreviewProps) {
  console.log("Rendering VideoPreview component");
  const { t } = useTranslations();

  if (!isAdmin) {
    return (
      <div className="rounded-lg bg-muted p-8 text-center">
        <p>{t("videoPreview.adminOnly")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <iframe
        src={videoUrl}
        className="w-full aspect-video"
        title={title || t("videoPreview.embedTitle")}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { VideoProcessingHistory } from "@/components/video/video-processing-history";
import { useTranslations } from "@/hooks/use-translations";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function VideoHistoryPage() {
  console.log("Rendering VideoHistoryPage");
  const { t } = useTranslations();
  const router = useRouter();

  const handleBackToVideos = () => {
    console.log("Navigating back to videos page");
    router.push("/dashboard/videos");
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleBackToVideos}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{t("videos.history.title")}</h1>
      </div>

      <VideoProcessingHistory
        limit={10}
        showPagination={true}
        showFilters={true}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { VideoProcessingCenter } from "@/components/video/video-processing-center";
import { useTranslations } from "@/hooks/use-translations";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function VideoProcessPage() {
  console.log("Rendering VideoProcess page");
  const { t } = useTranslations();
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);
  const [processedVideoData, setProcessedVideoData] = useState<any>(null);

  const handleProcessingComplete = (videoUrl: string, videoData: any) => {
    console.log("Video processing completed:", videoData);
    setProcessedVideoData(videoData);
    setIsCompleted(true);

    // Gerçek uygulamada burada veritabanına kaydetme işlemi yapılabilir
  };

  const handleBackToVideos = () => {
    console.log("Navigating back to videos page");
    router.push("/dashboard/videos");
  };

  const handleProcessAnother = () => {
    console.log("Resetting for another video");
    setIsCompleted(false);
    setProcessedVideoData(null);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleBackToVideos}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{t("videos.processing.title")}</h1>
        </div>

        {isCompleted && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleProcessAnother}>
              {t("videos.processing.processAnother")}
            </Button>
            <Button onClick={handleBackToVideos}>
              {t("videos.management.title")}
            </Button>
          </div>
        )}
      </div>

      <VideoProcessingCenter onProcessingComplete={handleProcessingComplete} />

      {isCompleted && processedVideoData && (
        <div className="bg-muted/50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">
            {t("videos.processing.completedDetails")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">{t("videos.details")}</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t("videos.title")}</dt>
                  <dd className="font-medium">{processedVideoData.title}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    {t("videos.status.status")}
                  </dt>
                  <dd className="font-medium">
                    {t(`videos.status.${processedVideoData.status}`)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    {t("videos.createdAt")}
                  </dt>
                  <dd className="font-medium">
                    {new Date(processedVideoData.createdAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="font-medium mb-2">
                {t("videos.processing.features")}
              </h3>
              <ul className="space-y-2">
                {processedVideoData.hasWatermark && (
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    {t("watermarks.applied")}
                  </li>
                )}
                {processedVideoData.hasSubtitles && (
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    {t("subtitles.applied")}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

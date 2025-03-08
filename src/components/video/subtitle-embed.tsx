"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SubtitleEmbedProps {
  videoId: string;
  subtitleFile: File;
  onComplete: (newVideoUrl: string) => void;
}

export function SubtitleEmbed({
  videoId,
  subtitleFile,
  onComplete,
}: SubtitleEmbedProps) {
  console.log("Rendering SubtitleEmbed component");
  const { t } = useTranslations();
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEmbedSubtitle = async () => {
    console.log("Embedding subtitle into video:", videoId);
    if (!subtitleFile) {
      toast.error(t("subtitles.error.noFile"));
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simüle edilmiş ilerleme
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 500);

      // FFmpeg işlemi API'si ile altyazı gömme - gerçek uygulamada
      const formData = new FormData();
      formData.append("videoId", videoId);
      formData.append("subtitleFile", subtitleFile);

      // Gerçek API çağrısı yerine simülasyon
      await new Promise((resolve) => setTimeout(resolve, 5000));

      clearInterval(progressInterval);
      setProgress(100);

      // Gerçek uygulamada API yanıtından alınacak değerler
      const newVideoUrl = "https://example.com/processed-video.mp4";

      toast.success(t("subtitles.success.embedded"));
      onComplete(newVideoUrl);
    } catch (error) {
      console.error("Altyazı gömme hatası:", error);
      toast.error(t("subtitles.error.embedFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">
            {t("subtitles.embed.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("subtitles.embed.description")}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{t("subtitles.embed.ready")}</p>
          <p className="text-sm text-muted-foreground">{subtitleFile.name}</p>
        </div>

        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-right text-muted-foreground">
              {progress}%
            </p>
          </div>
        )}

        <Button
          onClick={handleEmbedSubtitle}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("subtitles.embed.processing")}
            </>
          ) : (
            t("subtitles.embed.start")
          )}
        </Button>

        <div className="text-sm text-muted-foreground mt-4">
          <h4 className="font-medium text-foreground">
            {t("subtitles.embed.note")}
          </h4>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>{t("subtitles.embed.noteItem1")}</li>
            <li>{t("subtitles.embed.noteItem2")}</li>
            <li>{t("subtitles.embed.noteItem3")}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

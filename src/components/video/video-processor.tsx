"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { customFFmpeg } from "@/lib/ffmpeg";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";

interface VideoProcessorProps {
  videoFile: File;
  watermarkFile?: File | null;
  subtitleFile?: File | null;
  watermarkSettings?: {
    watermarkPosition?: string;
    watermarkOpacity?: number;
    watermarkSize?: number;
  };
  onProcessingComplete: (result: { url: string; blob: Blob }) => void;
  onProcessingError?: (error: Error) => void;
}

export function VideoProcessor({
  videoFile,
  watermarkFile,
  subtitleFile,
  watermarkSettings,
  onProcessingComplete,
  onProcessingError,
}: VideoProcessorProps) {
  const { t } = useTranslations();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processVideo = async () => {
    console.log("Starting video processing in client component");
    setIsProcessing(true);
    setProgress(10);

    try {
      // Simulate progress updates (actual progress tracking would require FFmpeg callbacks)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 5;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);

      // Process the video using FFmpeg
      setProgress(20);
      const result = await customFFmpeg.addProcessingJob({
        videoFile,
        watermarkFile,
        subtitleFile,
        options: watermarkSettings,
      });

      clearInterval(progressInterval);
      setProgress(100);

      console.log("Video processing completed successfully");
      onProcessingComplete(result);
      toast.success(t("videos.processing.success"));
    } catch (error) {
      console.error("Video processing error:", error);
      toast.error(t("videos.processing.error"));

      if (onProcessingError && error instanceof Error) {
        onProcessingError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {isProcessing ? (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {t("videos.processing.inProgress")} ({Math.round(progress)}%)
          </p>
        </div>
      ) : (
        <Button onClick={processVideo} className="w-full">
          {t("videos.processing.startProcessing")}
        </Button>
      )}
    </div>
  );
}

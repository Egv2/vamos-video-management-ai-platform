"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "@/hooks/use-translations";
import { VideoUploader } from "@/components/video/video-uploader";
import { WatermarkEditor } from "@/components/video/watermark-editor";
import { SubtitleEmbed } from "@/components/video/subtitle-embed";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Loader2, Download } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VideoProcessingCenterProps {
  initialVideoUrl?: string;
  onProcessingComplete?: (processedVideoUrl: string, videoData: any) => void;
}

export function VideoProcessingCenter({
  initialVideoUrl,
  onProcessingComplete,
}: VideoProcessingCenterProps) {
  console.log("Rendering VideoProcessingCenter");
  const { t } = useTranslations();

  const [currentTab, setCurrentTab] = useState("upload");
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl || "");
  const [videoId, setVideoId] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);
  const [watermarkSettings, setWatermarkSettings] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Video yükleme işlemi tamamlandığında çağrılır
  const handleVideoUploaded = (
    newVideoUrl: string,
    newVideoId: string,
    title: string
  ) => {
    console.log("Video uploaded:", newVideoId);
    setVideoUrl(newVideoUrl);
    setVideoId(newVideoId);
    setVideoTitle(title);
    toast.success(t("videos.upload.success"));
    // Otomatik olarak filigran tabına geç
    setCurrentTab("watermark");
  };

  // Filigran ayarları kaydedildiğinde çağrılır
  const handleWatermarkSaved = async (settings: any) => {
    console.log("Watermark settings saved:", settings);
    setWatermarkSettings(settings);
    toast.success(t("watermarks.success.saved"));
    // Otomatik olarak altyazı tabına geç
    setCurrentTab("subtitle");
  };

  // Altyazı dosyası seçildiğinde çağrılır
  const handleSubtitleSelected = (file: File) => {
    console.log("Subtitle file selected:", file.name);
    setSubtitleFile(file);
  };

  // Altyazı gömme işlemi tamamlandığında çağrılır
  const handleSubtitleEmbedded = (newVideoUrl: string) => {
    console.log("Subtitle embedded, new video URL:", newVideoUrl);
    setVideoUrl(newVideoUrl);
    toast.success(t("subtitles.success.embedded"));
    // İşlem tamamlandığında finalize tabına geç
    setCurrentTab("finalize");
  };

  // Tüm işlemleri tamamlayıp final videoyu döndür
  const handleFinalize = async () => {
    console.log("Finalizing video processing");
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // İlerleme simülasyonu
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // API çağrısı - gerçek uygulamada
      const formData = new FormData();
      formData.append("videoId", videoId);
      formData.append("title", videoTitle);

      if (watermarkSettings) {
        formData.append("watermarkSettings", JSON.stringify(watermarkSettings));
      }

      if (subtitleFile) {
        formData.append("subtitleFile", subtitleFile);
      }

      // Gerçek API çağrısı yerine simülasyon
      await new Promise((resolve) => setTimeout(resolve, 3000));

      clearInterval(progressInterval);
      setProcessingProgress(100);

      const finalVideoData = {
        id: videoId,
        title: videoTitle,
        url: videoUrl,
        hasWatermark: !!watermarkSettings,
        hasSubtitles: !!subtitleFile,
        createdAt: new Date().toISOString(),
        status: "completed",
      };

      if (onProcessingComplete) {
        onProcessingComplete(videoUrl, finalVideoData);
      }

      toast.success(t("videos.processing.completed"));
    } catch (error) {
      console.error("Error finalizing video:", error);
      toast.error(t("videos.processing.error"));
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }
  };

  // İşlem tamamlandığında dosya indirme seçeneği
  const handleDownloadProcessedVideo = () => {
    console.log("Downloading processed video");

    if (!videoUrl) {
      toast.error(t("videos.error.noVideo"));
      return;
    }

    // Dosya indirme işlemi
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `processed_${videoTitle || "video"}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(t("videos.download.started"));
  };

  // İşlem ayarları bölümü
  const renderProcessingOptions = () => {
    return (
      <div className="border rounded-lg p-4 space-y-4 mt-4">
        <h3 className="font-medium">{t("videos.processing.options")}</h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="maintain-quality">
              {t("videos.processing.maintainQuality")}
            </Label>
            <Switch id="maintain-quality" />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-optimize">
              {t("videos.processing.autoOptimize")}
            </Label>
            <Switch id="auto-optimize" defaultChecked />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("videos.processing.outputFormat")}</Label>
          <Select defaultValue="mp4">
            <SelectTrigger>
              <SelectValue placeholder={t("videos.processing.selectFormat")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp4">MP4</SelectItem>
              <SelectItem value="webm">WebM</SelectItem>
              <SelectItem value="mov">MOV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("videos.processing.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="upload">{t("videos.upload.title")}</TabsTrigger>
            <TabsTrigger value="watermark" disabled={!videoUrl}>
              {t("watermarks.title")}
            </TabsTrigger>
            <TabsTrigger value="subtitle" disabled={!videoUrl}>
              {t("subtitles.title")}
            </TabsTrigger>
            <TabsTrigger value="finalize" disabled={!videoUrl}>
              {t("videos.processing.finalize")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-0">
            <VideoUploader onUploadComplete={handleVideoUploaded} />
          </TabsContent>

          <TabsContent value="watermark" className="mt-0">
            {videoUrl ? (
              <WatermarkEditor
                videoUrl={videoUrl}
                onSave={handleWatermarkSaved}
              />
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {t("watermarks.error.noVideo")}
              </div>
            )}
          </TabsContent>

          <TabsContent value="subtitle" className="mt-0">
            {videoUrl ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <input
                    type="file"
                    accept=".srt,.vtt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleSubtitleSelected(file);
                    }}
                    className="w-full cursor-pointer"
                  />
                </div>

                {subtitleFile && (
                  <SubtitleEmbed
                    videoId={videoId}
                    subtitleFile={subtitleFile}
                    onComplete={handleSubtitleEmbedded}
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {t("subtitles.error.noVideo")}
              </div>
            )}
          </TabsContent>

          <TabsContent value="finalize" className="mt-0">
            {videoUrl ? (
              <div className="space-y-6">
                <div className="aspect-video border rounded-lg overflow-hidden bg-black">
                  <video src={videoUrl} className="w-full h-full" controls />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">
                    {t("videos.processing.summary")}
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {watermarkSettings && <li>✓ {t("watermarks.applied")}</li>}
                    {subtitleFile && <li>✓ {t("subtitles.applied")}</li>}
                  </ul>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <Progress value={processingProgress} className="h-2" />
                    <p className="text-xs text-right text-muted-foreground">
                      {processingProgress}%
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleFinalize}
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("videos.processing.finalizing")}
                    </>
                  ) : (
                    t("videos.processing.finalize")
                  )}
                </Button>

                {isProcessing ? null : (
                  <Button
                    variant="outline"
                    onClick={handleDownloadProcessedVideo}
                    className="w-full mt-2"
                    disabled={!videoUrl}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t("videos.download.title")}
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {t("videos.error.noVideo")}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, X, Link, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress, ProgressProps } from "@/components/ui/progress";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/hooks/use-translations";

interface VideoUploaderProps {
  onUploadComplete: (videoUrl: string, videoId: string, title: string) => void;
}

export function VideoUploader({ onUploadComplete }: VideoUploaderProps) {
  console.log("Rendering VideoUploader");
  const { t } = useTranslations();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [urlInput, setUrlInput] = useState("");
  const [urlTitle, setUrlTitle] = useState("");
  const [activeTab, setActiveTab] = useState("file");
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log("File dropped:", acceptedFiles[0]?.name);
      const selectedFile = acceptedFiles[0];
      if (selectedFile && selectedFile.type.startsWith("video/")) {
        setFile(selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        setProgress(0);
      } else {
        console.error("Invalid file type");
        toast.error(t("videos.upload.invalidType"));
      }
    },
    [t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    console.log("Starting upload for file:", file?.name);
    if (!file) return;

    setUploading(true);

    // Simüle edilmiş yükleme ilerlemesi
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 300);

    // Yükleme simülasyonu
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setUploading(false);

      // Simüle edilmiş video ID ve URL oluştur
      const videoId = `video_${Date.now()}`;
      const videoUrl = preview || "";

      console.log("Upload completed for file:", file.name);
      onUploadComplete(videoUrl, videoId, file.name);
      toast.success(t("videos.upload.success"));
    }, 6000);
  };

  const handleUrlUpload = async () => {
    console.log("Processing URL upload:", urlInput);
    if (!urlInput || !urlTitle) {
      toast.error(t("videos.upload.urlError"));
      return;
    }

    setUploading(true);
    setProgress(0);

    // Simüle edilmiş yükleme ilerlemesi
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    try {
      // Gerçek uygulamada burada URL'den videonun alınması işlemi olacak
      // API çağrısı simülasyonu
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Video ID simülasyonu
      const videoId = `video_url_${Date.now()}`;

      console.log("URL upload completed:", urlTitle);
      clearInterval(interval);
      setProgress(100);
      onUploadComplete(urlInput, videoId, urlTitle);
      toast.success(t("videos.upload.urlSuccess"));

      // Form temizle
      setUrlInput("");
      setUrlTitle("");
    } catch (error) {
      console.error("URL upload error:", error);
      toast.error(t("videos.upload.urlProcessError"));
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    console.log("Clearing upload form");
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setProgress(0);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{t("videos.upload.title")}</h2>
          <p className="text-muted-foreground mt-1">
            {t("videos.upload.description")}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              {t("videos.upload.fileTab")}
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              {t("videos.upload.urlTab")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="mt-0">
            {!preview ? (
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-12 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[250px]",
                  isDragActive
                    ? "border-primary bg-primary/10"
                    : "border-muted hover:border-primary/50 hover:bg-muted"
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="p-4 rounded-full bg-muted text-primary">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">
                      {t("videos.upload.dragDrop")}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {t("videos.upload.browseFiles")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border">
                  <video
                    ref={videoRef}
                    src={preview}
                    className="w-full aspect-video object-contain bg-black"
                    controls
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleClear}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 text-foreground hover:bg-background/90"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm truncate max-w-[80%]">{file?.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {file
                        ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
                        : ""}
                    </p>
                  </div>

                  {progress > 0 && (
                    <div className="space-y-1.5">
                      <Progress value={progress} className="h-2" />
                      <p className="text-muted-foreground text-xs text-right">
                        {progress}%
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleUpload}
                      disabled={uploading || !file}
                      className="flex-1"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("videos.upload.uploading")}
                        </>
                      ) : (
                        t("videos.upload.upload")
                      )}
                    </Button>
                    <Button onClick={handleClear} variant="outline">
                      {t("videos.upload.clear")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="url" className="mt-0">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">
                    {t("videos.upload.videoUrl")}
                  </Label>
                  <Input
                    id="videoUrl"
                    placeholder="https://example.com/video.mp4"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={uploading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoTitle">
                    {t("videos.upload.videoTitle")}
                  </Label>
                  <Input
                    id="videoTitle"
                    placeholder={t("videos.upload.titlePlaceholder")}
                    value={urlTitle}
                    onChange={(e) => setUrlTitle(e.target.value)}
                    disabled={uploading}
                  />
                </div>
              </div>

              {progress > 0 && (
                <div className="space-y-1.5">
                  <Progress value={progress} className="h-2" />
                  <p className="text-muted-foreground text-xs text-right">
                    {progress}%
                  </p>
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleUrlUpload}
                disabled={uploading || !urlInput || !urlTitle}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("videos.upload.processing")}
                  </>
                ) : (
                  t("videos.upload.processUrl")
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

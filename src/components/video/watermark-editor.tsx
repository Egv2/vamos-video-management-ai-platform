"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";
import {
  CornerLeftDown,
  CornerRightDown,
  CornerLeftUp,
  CornerRightUp,
  MoveHorizontal,
  Loader2,
} from "lucide-react";

type WatermarkPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center";

interface WatermarkEditorProps {
  videoUrl: string;
  onSave: (watermarkSettings: WatermarkSettings) => Promise<void>;
}

interface WatermarkSettings {
  position: WatermarkPosition;
  opacity: number;
  size: number;
  imageUrl: string;
}

export function WatermarkEditor({ videoUrl, onSave }: WatermarkEditorProps) {
  console.log("Rendering WatermarkEditor");
  const { t } = useTranslations();
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkPreviewUrl, setWatermarkPreviewUrl] = useState<string>("");
  const [position, setPosition] = useState<WatermarkPosition>("bottom-right");
  const [opacity, setOpacity] = useState(80);
  const [size, setSize] = useState(20);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Watermark konumunu dinamik olarak stillendir
  const getWatermarkStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      maxWidth: `${size}%`,
      opacity: opacity / 100,
    };

    switch (position) {
      case "top-left":
        return { ...baseStyle, top: "10px", left: "10px" };
      case "top-right":
        return { ...baseStyle, top: "10px", right: "10px" };
      case "bottom-left":
        return { ...baseStyle, bottom: "10px", left: "10px" };
      case "bottom-right":
        return { ...baseStyle, bottom: "10px", right: "10px" };
      case "center":
        return {
          ...baseStyle,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Watermark image selected");
    const file = e.target.files?.[0];
    if (file) {
      setWatermarkImage(file);
      const imageUrl = URL.createObjectURL(file);
      setWatermarkPreviewUrl(imageUrl);
    }
  };

  const handleSave = async () => {
    console.log("Saving watermark settings");
    if (!watermarkImage) {
      toast.error(t("watermarks.error.noImage"));
      return;
    }

    setIsSaving(true);
    try {
      // Resmi yükleme işlemi
      const formData = new FormData();
      formData.append("watermarkImage", watermarkImage);

      // Gerçek uygulamada API çağrısı yapılır
      // const uploadResponse = await fetch("/api/watermarks/upload", {
      //   method: "POST",
      //   body: formData,
      // });

      // API simülasyonu
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Gerçek uygulamada API yanıtından alınacak değerler
      const imageUrl = URL.createObjectURL(watermarkImage);

      // Watermark ayarlarını kaydet
      await onSave({
        position,
        opacity,
        size,
        imageUrl,
      });

      toast.success(t("watermarks.success.saved"));
    } catch (error) {
      console.error("Failed to save watermark:", error);
      toast.error(t("watermarks.error.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  // Video yüklendiğinde otomatik oynat
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.2; // Sesi düşük tut
    }
  }, []);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">
            {t("watermarks.editor.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("watermarks.editor.description")}
          </p>
        </div>

        {/* Filigran resmi seçme / önizleme */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {t("watermarks.editor.selectImage")}
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              {watermarkImage
                ? t("watermarks.editor.change")
                : t("watermarks.editor.upload")}
            </Button>
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            {watermarkImage && (
              <span className="text-sm">{watermarkImage.name}</span>
            )}
          </div>
        </div>

        {/* Video ve filigran önizleme */}
        <div className="relative border rounded-lg overflow-hidden aspect-video bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full"
            controls
            autoPlay
            loop
            muted
          />
          {watermarkPreviewUrl && (
            <img
              src={watermarkPreviewUrl}
              alt="Watermark"
              style={getWatermarkStyle()}
            />
          )}
        </div>

        {/* Konum seçimi */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {t("watermarks.editor.position")}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={position === "top-left" ? "default" : "outline"}
              size="sm"
              onClick={() => setPosition("top-left")}
            >
              <CornerLeftUp className="h-4 w-4 mr-1" />
              {t("watermarks.position.topLeft")}
            </Button>
            <Button
              variant={position === "top-right" ? "default" : "outline"}
              size="sm"
              onClick={() => setPosition("top-right")}
            >
              <CornerRightUp className="h-4 w-4 mr-1" />
              {t("watermarks.position.topRight")}
            </Button>
            <Button
              variant={position === "center" ? "default" : "outline"}
              size="sm"
              onClick={() => setPosition("center")}
            >
              <MoveHorizontal className="h-4 w-4 mr-1" />
              {t("watermarks.position.center")}
            </Button>
            <Button
              variant={position === "bottom-left" ? "default" : "outline"}
              size="sm"
              onClick={() => setPosition("bottom-left")}
            >
              <CornerLeftDown className="h-4 w-4 mr-1" />
              {t("watermarks.position.bottomLeft")}
            </Button>
            <Button
              variant={position === "bottom-right" ? "default" : "outline"}
              size="sm"
              onClick={() => setPosition("bottom-right")}
            >
              <CornerRightDown className="h-4 w-4 mr-1" />
              {t("watermarks.position.bottomRight")}
            </Button>
          </div>
        </div>

        {/* Şeffaflık ayarı */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="block text-sm font-medium">
              {t("watermarks.editor.opacity")}
            </label>
            <span className="text-sm">{opacity}%</span>
          </div>
          <Slider
            value={[opacity]}
            min={10}
            max={100}
            step={5}
            onValueChange={(values) => setOpacity(values[0])}
          />
        </div>

        {/* Boyut ayarı */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="block text-sm font-medium">
              {t("watermarks.editor.size")}
            </label>
            <span className="text-sm">{size}%</span>
          </div>
          <Slider
            value={[size]}
            min={5}
            max={50}
            step={5}
            onValueChange={(values) => setSize(values[0])}
          />
        </div>

        {/* Kaydetme butonu */}
        <Button
          onClick={handleSave}
          disabled={!watermarkImage || isSaving}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("common.saving")}
            </>
          ) : (
            t("common.save")
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

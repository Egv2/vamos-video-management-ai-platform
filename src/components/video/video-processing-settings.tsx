"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "@/hooks/use-translations";
import { Settings, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function VideoProcessingSettings() {
  console.log("Rendering VideoProcessingSettings");
  const { t } = useTranslations();

  // Video işleme ayarları
  const [videoQuality, setVideoQuality] = useState("high");
  const [autoProcess, setAutoProcess] = useState(true);
  const [defaultWatermark, setDefaultWatermark] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState(70);
  const [outputFormat, setOutputFormat] = useState("mp4");
  const [maxConcurrentJobs, setMaxConcurrentJobs] = useState(2);

  const handleSaveSettings = () => {
    console.log("Saving video processing settings");

    // Ayarları kaydet
    const settings = {
      videoQuality,
      autoProcess,
      defaultWatermark,
      compressionLevel,
      outputFormat,
      maxConcurrentJobs,
    };

    console.log("Settings to save:", settings);

    // Gerçek uygulamada API çağrısı yapılır
    // await fetch("/api/settings/video-processing", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(settings)
    // });

    toast.success(t("settings.saved"));
  };

  const handleResetDefaults = () => {
    console.log("Resetting video processing settings to defaults");

    // Varsayılan değerlere sıfırla
    setVideoQuality("high");
    setAutoProcess(true);
    setDefaultWatermark(false);
    setCompressionLevel(70);
    setOutputFormat("mp4");
    setMaxConcurrentJobs(2);

    toast.success(t("settings.resetToDefaults"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t("processing.settings.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Video Kalitesi */}
        <div className="space-y-2">
          <Label>{t("processing.settings.videoQuality")}</Label>
          <Select value={videoQuality} onValueChange={setVideoQuality}>
            <SelectTrigger>
              <SelectValue
                placeholder={t("processing.settings.selectQuality")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">{t("processing.quality.low")}</SelectItem>
              <SelectItem value="medium">
                {t("processing.quality.medium")}
              </SelectItem>
              <SelectItem value="high">
                {t("processing.quality.high")}
              </SelectItem>
              <SelectItem value="original">
                {t("processing.quality.original")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Çıktı Formatı */}
        <div className="space-y-2">
          <Label>{t("processing.settings.outputFormat")}</Label>
          <Select value={outputFormat} onValueChange={setOutputFormat}>
            <SelectTrigger>
              <SelectValue
                placeholder={t("processing.settings.selectFormat")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp4">MP4</SelectItem>
              <SelectItem value="webm">WebM</SelectItem>
              <SelectItem value="mov">MOV</SelectItem>
              <SelectItem value="avi">AVI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sıkıştırma Seviyesi */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>{t("processing.settings.compressionLevel")}</Label>
            <span className="text-sm">{compressionLevel}%</span>
          </div>
          <Slider
            value={[compressionLevel]}
            min={0}
            max={100}
            step={5}
            onValueChange={(values) => setCompressionLevel(values[0])}
          />
          <p className="text-xs text-muted-foreground">
            {t("processing.settings.compressionHint")}
          </p>
        </div>

        {/* Eşzamanlı İşlem Sayısı */}
        <div className="space-y-2">
          <Label>{t("processing.settings.maxConcurrentJobs")}</Label>
          <Select
            value={maxConcurrentJobs.toString()}
            onValueChange={(value) => setMaxConcurrentJobs(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Otomatik İşleme */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("processing.settings.autoProcess")}</Label>
            <p className="text-xs text-muted-foreground">
              {t("processing.settings.autoProcessDescription")}
            </p>
          </div>
          <Switch checked={autoProcess} onCheckedChange={setAutoProcess} />
        </div>

        {/* Varsayılan Filigran */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("processing.settings.defaultWatermark")}</Label>
            <p className="text-xs text-muted-foreground">
              {t("processing.settings.defaultWatermarkDescription")}
            </p>
          </div>
          <Switch
            checked={defaultWatermark}
            onCheckedChange={setDefaultWatermark}
          />
        </div>

        {/* Butonlar */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleResetDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {t("settings.resetDefaults")}
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            {t("settings.saveChanges")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

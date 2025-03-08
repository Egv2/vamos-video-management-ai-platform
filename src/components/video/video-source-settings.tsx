"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Save, RefreshCw } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import {
  videoSourceService,
  VideoSourceType,
} from "@/lib/services/video-source-service";

interface VideoSourceSettingsProps {
  onSourceChanged: (source: string) => void;
}

export function VideoSourceSettings({
  onSourceChanged,
}: VideoSourceSettingsProps) {
  console.log("Rendering VideoSourceSettings component");

  const { t } = useTranslations();
  const { user } = useUser(); // Kullanıcı bilgisini al

  const [isOpen, setIsOpen] = useState(false);
  const [selectedSource, setSelectedSource] =
    useState<VideoSourceType>("default");
  const [customUrl, setCustomUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Kaydedilmiş kaynağı Supabase'den yükle
  useEffect(() => {
    const loadSavedSettings = async () => {
      console.log("Loading video source settings from Supabase");
      setIsLoading(true);

      try {
        if (!user?.id) {
          console.log("No user logged in, using default settings");
          setSelectedSource("default");
          setIsLoading(false);
          return;
        }

        const settings = await videoSourceService.getVideoSource(user.id);
        console.log("Loaded settings:", settings);

        if (settings) {
          setSelectedSource(settings.sourceType);
          setCustomUrl(settings.customUrl || "");

          // Kaydedilmiş kaynağı hemen kullan
          if (settings.sourceType === "custom" && settings.customUrl) {
            onSourceChanged(settings.customUrl);
          } else if (settings.sourceType === "pexels") {
            onSourceChanged("pexels");
          } else {
            onSourceChanged("default");
          }
        } else {
          // Ayar bulunamadı, varsayılanları kullan
          setSelectedSource("default");
          onSourceChanged("default");
        }
      } catch (error) {
        console.error("Error loading video source settings:", error);
        toast.error(t("videos.source.loadError"));
        setSelectedSource("default");
        onSourceChanged("default");
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedSettings();
  }, [user, onSourceChanged, t]);

  const handleSave = async () => {
    console.log("Saving video source settings:", { selectedSource, customUrl });
    setIsSaving(true);

    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Supabase'e kaydet
      await videoSourceService.saveVideoSource(
        user.id,
        selectedSource,
        selectedSource === "custom" ? customUrl : undefined
      );

      // UI güncellemesi
      if (selectedSource === "custom" && customUrl) {
        onSourceChanged(customUrl);
      } else if (selectedSource === "pexels") {
        onSourceChanged("pexels");
      } else {
        onSourceChanged("default");
      }

      toast.success(t("videos.source.saved"));
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving video source settings:", error);
      toast.error(t("videos.source.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  // İletişim kutusunu aç
  const handleOpenSettings = () => {
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenSettings}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Settings className="h-4 w-4 mr-2" />
          )}
          {t("videos.source.settings")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("videos.source.title")}</DialogTitle>
          <DialogDescription>
            {t("videos.source.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="source-type">{t("videos.source.type")}</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={selectedSource === "default" ? "default" : "outline"}
                onClick={() => setSelectedSource("default")}
              >
                {t("videos.source.default")}
              </Button>
              <Button
                variant={selectedSource === "pexels" ? "default" : "outline"}
                onClick={() => setSelectedSource("pexels")}
              >
                Pexels API
              </Button>
              <Button
                variant={selectedSource === "custom" ? "default" : "outline"}
                onClick={() => setSelectedSource("custom")}
              >
                {t("videos.source.custom")}
              </Button>
            </div>
          </div>

          {selectedSource === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="custom-url">{t("videos.source.customUrl")}</Label>
              <Input
                id="custom-url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://api.example.com/videos"
              />
              <p className="text-sm text-muted-foreground">
                {t("videos.source.customUrlHelp")}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {t("common.saving")}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t("common.save")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

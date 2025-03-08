"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";
import { useUser } from "@/hooks/use-user";
import { videoSourceService } from "@/lib/services/video-source-service";
import { Loader2, TestTube, Save, Globe, Server, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type VideoSourceType =
  | "default"
  | "pexels"
  | "custom"
  | "youtube"
  | "vimeo";

interface VideoSourceSettingsPanelProps {
  onSourceChanged: (source: string) => void;
}

export function VideoSourceSettingsPanel({
  onSourceChanged,
}: VideoSourceSettingsPanelProps) {
  console.log("Rendering VideoSourceSettingsPanel component");

  const { t } = useTranslations();
  const { user, isLoading: isUserLoading } = useUser();

  const [selectedSource, setSelectedSource] =
    useState<VideoSourceType>("default");
  const [customUrl, setCustomUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [testingConnection, setTestingConnection] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("sources");

  // Kaydedilmiş kaynağı yükle
  useEffect(() => {
    const loadSavedSettings = async () => {
      console.log("Loading video source settings from database");
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
          setApiKey(settings.apiKey || "");

          // Kaydedilmiş kaynağı hemen kullan
          if (settings.sourceType === "custom" && settings.customUrl) {
            onSourceChanged(settings.customUrl);
          } else if (settings.sourceType === "pexels") {
            onSourceChanged("pexels");
          } else if (settings.sourceType === "youtube") {
            onSourceChanged("youtube");
          } else if (settings.sourceType === "vimeo") {
            onSourceChanged("vimeo");
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
    console.log("Saving video source settings:", {
      selectedSource,
      customUrl,
      apiKey,
    });
    setIsSaving(true);

    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Custom URL için validasyon
      if (selectedSource === "custom" && !customUrl) {
        toast.error(t("videos.source.urlRequired"));
        setIsSaving(false);
        return;
      }

      // API Key validasyonu
      if (
        (selectedSource === "pexels" ||
          selectedSource === "youtube" ||
          selectedSource === "vimeo") &&
        !apiKey
      ) {
        toast.error(t("videos.source.apiKeyRequired"));
        setIsSaving(false);
        return;
      }

      // Supabase'e kaydet
      await videoSourceService.saveVideoSource(
        user.id,
        selectedSource,
        selectedSource === "custom" ? customUrl : undefined,
        ["pexels", "youtube", "vimeo"].includes(selectedSource)
          ? apiKey
          : undefined
      );

      // UI güncellemesi
      if (selectedSource === "custom" && customUrl) {
        onSourceChanged(customUrl);
      } else if (selectedSource === "pexels") {
        onSourceChanged("pexels");
      } else if (selectedSource === "youtube") {
        onSourceChanged("youtube");
      } else if (selectedSource === "vimeo") {
        onSourceChanged("vimeo");
      } else {
        onSourceChanged("default");
      }

      toast.success(t("videos.source.saved"));
    } catch (error) {
      console.error("Error saving video source settings:", error);
      toast.error(t("videos.source.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    console.log("Testing connection to video API");
    setTestingConnection(true);

    try {
      let endpoint = "";
      let headers = {};

      if (selectedSource === "default") {
        endpoint = "/api/videos/samples";
      } else if (selectedSource === "pexels") {
        endpoint = "/api/videos/pexels";
        headers = { "X-API-Key": apiKey };
      } else if (selectedSource === "youtube") {
        endpoint = "/api/videos/youtube";
        headers = { "X-API-Key": apiKey };
      } else if (selectedSource === "vimeo") {
        endpoint = "/api/videos/vimeo";
        headers = { "X-API-Key": apiKey };
      } else if (selectedSource === "custom") {
        endpoint = customUrl;
      }

      if (!endpoint) {
        throw new Error("No endpoint selected");
      }

      const response = await fetch(endpoint, { headers });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("API test successful:", data);

      toast.success(t("videos.source.connectionSuccess"));
    } catch (error) {
      console.error("API connection test failed:", error);
      toast.error(t("videos.source.connectionError"));
    } finally {
      setTestingConnection(false);
    }
  };

  // Kullanıcı yükleniyor veya ayarlar yükleniyor ise
  if (isUserLoading || isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-2 mt-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="sources"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sources">
            {t("videos.source.tabs.sources")}
          </TabsTrigger>
          <TabsTrigger value="advanced">
            {t("videos.source.tabs.advanced")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {t("videos.source.sourceOptions")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("videos.source.sourceOptionsDescription")}
            </p>

            <RadioGroup
              value={selectedSource}
              onValueChange={(value) => {
                console.log("Source changed to:", value);
                setSelectedSource(value as VideoSourceType);
              }}
              className="space-y-4"
            >
              <div
                onClick={() => setSelectedSource("default")}
                className="cursor-pointer"
              >
                <Card
                  className={`border ${
                    selectedSource === "default"
                      ? "border-primary"
                      : "border-border"
                  } transition-colors`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="default" id="source-default" />
                      <Label
                        htmlFor="source-default"
                        className="flex items-center cursor-pointer w-full"
                      >
                        <Database className="w-5 h-5 mr-2 text-primary" />
                        <div>
                          <p className="font-medium">
                            {t("videos.source.default.title")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("videos.source.default.description")}
                          </p>
                        </div>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div
                onClick={() => setSelectedSource("pexels")}
                className="cursor-pointer"
              >
                <Card
                  className={`border ${
                    selectedSource === "pexels"
                      ? "border-primary"
                      : "border-border"
                  } transition-colors`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="pexels" id="source-pexels" />
                      <Label
                        htmlFor="source-pexels"
                        className="flex items-center cursor-pointer w-full"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.66 21.375H7.33V9.844h3.01v11.531zm-1.505-13.125c-.996 0-1.505-.746-1.505-1.68 0-.913.53-1.695 1.505-1.695.994 0 1.5.782 1.5 1.695 0 .934-.506 1.68-1.5 1.68zm12.834 13.125h-3.01v-6.246c0-1.243-.438-2.09-1.528-2.09-.832 0-1.325.566-1.545 1.114-.08.195-.1.465-.1.738v6.484H12.5V9.844h3.01v1.296c.438-.623 1.122-1.52 2.713-1.52 1.975 0 3.456 1.296 3.456 4.087v7.668z" />
                        </svg>
                        <div>
                          <p className="font-medium">
                            {t("videos.source.pexels.title")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("videos.source.pexels.description")}
                          </p>
                        </div>
                      </Label>
                    </div>

                    {selectedSource === "pexels" && (
                      <div className="mt-4 pl-8">
                        <Label
                          htmlFor="pexels-api-key"
                          className="text-sm font-medium"
                        >
                          {t("videos.source.pexels.apiKeyLabel")}
                        </Label>
                        <Input
                          id="pexels-api-key"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder={t(
                            "videos.source.pexels.apiKeyPlaceholder"
                          )}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          <a
                            href="https://www.pexels.com/api/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {t("videos.source.pexels.getApiKey")}
                          </a>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div
                onClick={() => setSelectedSource("youtube")}
                className="cursor-pointer"
              >
                <Card
                  className={`border ${
                    selectedSource === "youtube"
                      ? "border-primary"
                      : "border-border"
                  } transition-colors`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="youtube" id="source-youtube" />
                      <Label
                        htmlFor="source-youtube"
                        className="flex items-center cursor-pointer w-full"
                      >
                        <svg
                          className="w-5 h-5 mr-2 text-red-600"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <div>
                          <p className="font-medium">
                            {t("videos.source.youtube.title")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("videos.source.youtube.description")}
                          </p>
                        </div>
                      </Label>
                    </div>

                    {selectedSource === "youtube" && (
                      <div className="mt-4 pl-8">
                        <Label
                          htmlFor="youtube-api-key"
                          className="text-sm font-medium"
                        >
                          {t("videos.source.youtube.apiKeyLabel")}
                        </Label>
                        <Input
                          id="youtube-api-key"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder={t(
                            "videos.source.youtube.apiKeyPlaceholder"
                          )}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          <a
                            href="https://developers.google.com/youtube/v3/getting-started"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {t("videos.source.youtube.getApiKey")}
                          </a>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div
                onClick={() => setSelectedSource("vimeo")}
                className="cursor-pointer"
              >
                <Card
                  className={`border ${
                    selectedSource === "vimeo"
                      ? "border-primary"
                      : "border-border"
                  } transition-colors`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="vimeo" id="source-vimeo" />
                      <Label
                        htmlFor="source-vimeo"
                        className="flex items-center cursor-pointer w-full"
                      >
                        <svg
                          className="w-5 h-5 mr-2 text-blue-600"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z" />
                        </svg>
                        <div>
                          <p className="font-medium">
                            {t("videos.source.vimeo.title")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("videos.source.vimeo.description")}
                          </p>
                        </div>
                      </Label>
                    </div>

                    {selectedSource === "vimeo" && (
                      <div className="mt-4 pl-8">
                        <Label
                          htmlFor="vimeo-api-key"
                          className="text-sm font-medium"
                        >
                          {t("videos.source.vimeo.apiKeyLabel")}
                        </Label>
                        <Input
                          id="vimeo-api-key"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder={t(
                            "videos.source.vimeo.apiKeyPlaceholder"
                          )}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          <a
                            href="https://developer.vimeo.com/api/guides/start"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {t("videos.source.vimeo.getApiKey")}
                          </a>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div
                onClick={() => setSelectedSource("custom")}
                className="cursor-pointer"
              >
                <Card
                  className={`border ${
                    selectedSource === "custom"
                      ? "border-primary"
                      : "border-border"
                  } transition-colors`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="custom" id="source-custom" />
                      <Label
                        htmlFor="source-custom"
                        className="flex items-center cursor-pointer w-full"
                      >
                        <Server className="w-5 h-5 mr-2 text-primary" />
                        <div>
                          <p className="font-medium">
                            {t("videos.source.custom.title")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("videos.source.custom.description")}
                          </p>
                        </div>
                      </Label>
                    </div>

                    {selectedSource === "custom" && (
                      <div className="mt-4 pl-8">
                        <Label
                          htmlFor="custom-url"
                          className="text-sm font-medium"
                        >
                          {t("videos.source.custom.urlLabel")}
                        </Label>
                        <Input
                          id="custom-url"
                          value={customUrl}
                          onChange={(e) => setCustomUrl(e.target.value)}
                          placeholder={t("videos.source.custom.urlPlaceholder")}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("videos.source.custom.urlDescription")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {t("videos.source.advanced.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("videos.source.advanced.description")}
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="timeout" className="text-sm font-medium">
                  {t("videos.source.advanced.timeout")}
                </Label>
                <Input
                  id="timeout"
                  type="number"
                  defaultValue="5000"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="retry-count" className="text-sm font-medium">
                  {t("videos.source.advanced.retryCount")}
                </Label>
                <Input
                  id="retry-count"
                  type="number"
                  defaultValue="3"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cache-duration" className="text-sm font-medium">
                  {t("videos.source.advanced.cacheDuration")}
                </Label>
                <Input
                  id="cache-duration"
                  type="number"
                  defaultValue="60"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={handleTestConnection}
          disabled={testingConnection || isSaving}
        >
          {testingConnection ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("videos.source.testing")}
            </>
          ) : (
            <>
              <TestTube className="mr-2 h-4 w-4" />
              {t("videos.source.testConnection")}
            </>
          )}
        </Button>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("common.saving")}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t("common.save")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

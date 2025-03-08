"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Save, RotateCcw, Download, Upload } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useTranslations } from "@/hooks/use-translations";
import { LanguageSelector } from "@/components/language-selector";
import { ThemeSwitcher } from "@/components/theme-switcher";
import type { SupportedLanguage } from "@/lib/language-detection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoProcessingSettings } from "@/components/video/video-processing-settings";
import { VideoSourceSettings } from "@/components/video/video-source-settings";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  Video,
  Database,
  Cloud,
  User,
  Palette,
  Globe,
  Bell,
  Lock,
} from "lucide-react";
import { VideoSourceSettingsPanel } from "@/components/video/video-source-settings-panel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/theme-context";

export default function SettingsPage() {
  console.log("Rendering Settings page");
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslations();
  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguage>(language);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [selectedFontSize, setSelectedFontSize] = useState("medium");
  const [selectedAnimations, setSelectedAnimations] = useState("enabled");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Handle language change
  const handleLanguageChange = (value: string) => {
    console.log("Language selection changed to:", value);
    setSelectedLanguage(value as SupportedLanguage);
  };

  // Handle theme change
  const handleThemeChange = (value: string) => {
    console.log("Theme selection changed to:", value);
    setSelectedTheme(value as "system" | "light" | "dark");
  };

  // Save settings
  const handleSave = async () => {
    console.log("Saving settings");
    setIsSaving(true);

    try {
      // Apply language change
      if (selectedLanguage !== language) {
        console.log("Applying language change to:", selectedLanguage);
        setLanguage(selectedLanguage);
      }

      // Apply theme change
      if (selectedTheme !== theme) {
        console.log("Applying theme change to:", selectedTheme);
        setTheme(selectedTheme);
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(t("settings.saveSuccess"));
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(t("settings.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  // Reset settings to defaults
  const handleReset = () => {
    console.log("Resetting settings to defaults");
    setSelectedLanguage("en");
    setSelectedTheme("system");
    setSelectedFontSize("medium");
    setSelectedAnimations("enabled");
    toast.info("Settings reset to defaults");
  };

  // Handle video source change
  const handleSourceChanged = (source: string) => {
    console.log("Video source changed:", source);
    if (source) {
      toast.success("Video source settings saved successfully");
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("settings.pageTitle")}
          </h1>
          <p className="text-muted-foreground">
            {t("settings.pageDescription")}
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
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

      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-4 md:grid-cols-8 gap-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("settings.tabs.general")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("settings.tabs.appearance")}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("settings.tabs.notifications")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("settings.tabs.privacy")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.tabs.video")}</span>
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("settings.tabs.storage")}
            </span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.tabs.api")}</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">
              {t("settings.tabs.account")}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.general.title")}</CardTitle>
              <CardDescription>
                {t("settings.general.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Settings */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">
                    {t("settings.general.language.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.general.language.description")}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="language-select">
                    {t("settings.general.language.selectLabel")}
                  </Label>
                  <LanguageSelector
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    className="w-full sm:w-[240px]"
                  />
                </div>
              </div>

              <Separator />

              {/* Import/Export Settings */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {t("settings.general.exportSettings")}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  {t("settings.general.importSettings")}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="destructive"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {t("settings.general.resetSettings")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Settings Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.appearance.title")}</CardTitle>
              <CardDescription>
                {t("settings.appearance.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Settings */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">
                    {t("settings.appearance.theme.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.appearance.theme.description")}
                  </p>
                </div>
                <RadioGroup
                  value={selectedTheme}
                  onValueChange={handleThemeChange}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label
                      htmlFor="theme-light"
                      className="cursor-pointer flex-1"
                    >
                      {t("settings.appearance.theme.light")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label
                      htmlFor="theme-dark"
                      className="cursor-pointer flex-1"
                    >
                      {t("settings.appearance.theme.dark")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label
                      htmlFor="theme-system"
                      className="cursor-pointer flex-1"
                    >
                      {t("settings.appearance.theme.system")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Font Size Settings */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">
                    {t("settings.appearance.fontSize.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.appearance.fontSize.description")}
                  </p>
                </div>
                <RadioGroup
                  value={selectedFontSize}
                  onValueChange={setSelectedFontSize}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent">
                    <RadioGroupItem value="small" id="font-small" />
                    <Label
                      htmlFor="font-small"
                      className="cursor-pointer flex-1"
                    >
                      {t("settings.appearance.fontSize.small")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent">
                    <RadioGroupItem value="medium" id="font-medium" />
                    <Label
                      htmlFor="font-medium"
                      className="cursor-pointer flex-1"
                    >
                      {t("settings.appearance.fontSize.medium")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent">
                    <RadioGroupItem value="large" id="font-large" />
                    <Label
                      htmlFor="font-large"
                      className="cursor-pointer flex-1"
                    >
                      {t("settings.appearance.fontSize.large")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Animation Settings */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">
                    {t("settings.appearance.animations.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.appearance.animations.description")}
                  </p>
                </div>
                <RadioGroup
                  value={selectedAnimations}
                  onValueChange={setSelectedAnimations}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent">
                    <RadioGroupItem value="enabled" id="anim-enabled" />
                    <Label
                      htmlFor="anim-enabled"
                      className="cursor-pointer flex-1"
                    >
                      {t("settings.appearance.animations.enabled")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent">
                    <RadioGroupItem value="reduced" id="anim-reduced" />
                    <Label
                      htmlFor="anim-reduced"
                      className="cursor-pointer flex-1"
                    >
                      {t("settings.appearance.animations.reduced")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent">
                    <RadioGroupItem value="disabled" id="anim-disabled" />
                    <Label
                      htmlFor="anim-disabled"
                      className="cursor-pointer flex-1"
                    >
                      {t("settings.appearance.animations.disabled")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Ayarları</CardTitle>
              <CardDescription>
                Bildirim tercihlerinizi yapılandırın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Bildirim ayarları içeriği burada görüntülenecek</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Gizlilik Ayarları</CardTitle>
              <CardDescription>
                Gizlilik tercihlerinizi yapılandırın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Gizlilik ayarları içeriği burada görüntülenecek</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Tab */}
        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.videoSource.title")}</CardTitle>
              <CardDescription>
                {t("settings.videoSource.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoSourceSettingsPanel onSourceChanged={handleSourceChanged} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage Tab */}
        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.storage.title")}</CardTitle>
              <CardDescription>
                {t("settings.storage.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t("settings.storage.content")}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.api.title")}</CardTitle>
              <CardDescription>{t("settings.api.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t("settings.api.content")}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.account.title")}</CardTitle>
              <CardDescription>
                {t("settings.account.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t("settings.account.content")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

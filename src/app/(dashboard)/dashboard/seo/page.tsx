"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "@/components/video/video-player";
import { toast } from "sonner";
import { Sparkles, Save } from "lucide-react";
import { MultipleSelect, TTag } from "@/components/ui/multiple-select";
import { useLanguage } from "@/context/language-context";
import { useTranslations } from "@/hooks/use-translations";
import { getCategoriesByLocale } from "@/lib/categories";

// Mock videos
const videos = [
  {
    id: "1",
    title: "Sample Video 1",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://picsum.photos/seed/video1/800/450",
    status: "pending",
    date: "2023-11-15",
  },
  {
    id: "2",
    title: "Sample Video 2",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "https://picsum.photos/seed/video2/800/450",
    status: "processed",
    date: "2023-11-10",
  },
  {
    id: "3",
    title: "Product Demo",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://picsum.photos/seed/video3/800/450",
    status: "processed",
    date: "2023-11-05",
  },
];

export default function SeoPage() {
  console.log("Rendering SEO Content page");
  const { language } = useLanguage();
  const { t } = useTranslations();

  const [selectedVideo, setSelectedVideo] = useState(videos[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [categories, setCategories] = useState<TTag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    Array<{ key: string; name: string }>
  >([]);
  const [isSaving, setIsSaving] = useState(false);

  const [seoContent, setSeoContent] = useState({
    title: "",
    description: "",
    keywords: "",
  });

  // Update categories when language changes
  useEffect(() => {
    console.log("Updating categories for language:", language);
    setCategories(getCategoriesByLocale(language));
  }, [language]);

  // Handle video selection
  const handleVideoSelect = (video: (typeof videos)[0]) => {
    console.log("Selecting video:", video.id);
    setSelectedVideo(video);
  };

  // Generate SEO content with AI
  const handleGenerateWithAI = async () => {
    console.log("Generating SEO content with AI");
    setIsGenerating(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSeoContent({
        title: `Optimized Title for ${selectedVideo.title}`,
        description:
          "This is an AI-generated description that includes relevant keywords and follows SEO best practices.",
        keywords: "video, content, optimization",
      });

      setSelectedCategories([
        categories.find((cat) => cat.key === "technology") || categories[0],
        categories.find((cat) => cat.key === "education") || categories[1],
      ]);

      toast.success("AI content generated successfully");
    } catch {
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  // Save SEO content
  const handleSave = async () => {
    console.log("Saving SEO content");
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("SEO content saved successfully");
    } catch {
      toast.error("Failed to save content");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("seo.pageTitle")}
          </h1>
          <p className="text-muted-foreground">{t("seo.pageDescription")}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant="outline"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? t("common.saving") : t("common.save")}
          </Button>
          <Button
            onClick={handleGenerateWithAI}
            disabled={isGenerating}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? t("common.generating") : t("common.generate")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Video Selection & Preview */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("seo.videoPreview")}</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoPlayer
                src={selectedVideo.src}
                poster={selectedVideo.poster}
              />
              <h3 className="text-lg font-medium mt-4">
                {selectedVideo.title}
              </h3>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("seo.videoSelection")}</CardTitle>
              <CardDescription>{t("seo.chooseVideo")}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className={`flex items-center border-b p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedVideo.id === video.id ? "bg-muted" : ""
                    }`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="flex-grow">
                      <p className="font-medium">{video.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {video.date}
                      </p>
                    </div>
                    <Badge
                      variant={
                        video.status === "processed" ? "default" : "outline"
                      }
                    >
                      {t(
                        ("status." + video.status) as
                          | "status.pending"
                          | "status.processed"
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - SEO Form */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>{t("seo.seoContent")}</CardTitle>
              <CardDescription>{t("seo.optimizeContent")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("seo.title")}
                  <span className="text-muted-foreground ml-2 text-sm">
                    ({seoContent.title.length}/60 {t("seo.characters")})
                  </span>
                </label>
                <Input
                  placeholder={t("seo.titlePlaceholder")}
                  value={seoContent.title}
                  onChange={(e) =>
                    setSeoContent((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  maxLength={60}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("seo.description")}
                </label>
                <Textarea
                  placeholder={t("seo.descriptionPlaceholder")}
                  value={seoContent.description}
                  onChange={(e) =>
                    setSeoContent((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("seo.keywords")}
                </label>
                <Input
                  placeholder={t("seo.keywordsPlaceholder")}
                  value={seoContent.keywords}
                  onChange={(e) =>
                    setSeoContent((prev) => ({
                      ...prev,
                      keywords: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("common.categories")}
                </label>
                <div className="w-full">
                  <MultipleSelect
                    tags={categories}
                    defaultValue={selectedCategories}
                    onChange={(items) => {
                      console.log("Selected categories:", items);
                      setSelectedCategories(items);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

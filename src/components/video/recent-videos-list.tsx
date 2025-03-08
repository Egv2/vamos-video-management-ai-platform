"use client";

import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useTranslations } from "@/hooks/use-translations";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { tr, enUS } from "date-fns/locale";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Play, Clock, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RecentVideo {
  id: string;
  title: string;
  size: string;
  updatedAt: Date;
  status:
    | "ready"
    | "processing"
    | "error"
    | "pending"
    | "processed"
    | "completed";
  thumbnail?: string;
  duration: string;
  views: number;
  createdAt: Date;
}

export function RecentVideosList() {
  console.log("Rendering RecentVideosList");
  const { t } = useTranslations();
  const { language } = useLanguage();
  const router = useRouter();

  // Mock data - will be replaced with real data from API
  const recentVideos: RecentVideo[] = [
    {
      id: "1",
      title: "Nasıl Başlanır: Next.js ve Tailwind CSS",
      size: "15 MB",
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 gün önce
      status: "completed",
      thumbnail: "/thumbnails/nextjs-tutorial.jpg",
      duration: "12:34",
      views: 1240,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 gün önce
    },
    {
      id: "2",
      title: "React Hooks Derinlemesine İnceleme",
      size: "15 MB",
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 gün önce
      status: "processing",
      thumbnail: "/thumbnails/react-hooks.jpg",
      duration: "18:22",
      views: 890,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 gün önce
    },
    {
      id: "3",
      title: "TypeScript ile Daha Güvenli Kod Yazma",
      size: "15 MB",
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 gün önce
      status: "pending",
      thumbnail: "/thumbnails/typescript.jpg",
      duration: "15:45",
      views: 720,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 gün önce
    },
    {
      id: "4",
      title: "Modern UI Tasarım Prensipleri",
      size: "15 MB",
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 gün önce
      status: "completed",
      thumbnail: "/thumbnails/ui-design.jpg",
      duration: "22:10",
      views: 1560,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 gün önce
    },
  ];

  const dateLocale = language === "tr" ? tr : enUS;

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: dateLocale });
  };

  const formatViews = (views: number) => {
    return new Intl.NumberFormat(language).format(views);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("videos.recentVideos.title")}</CardTitle>
            <CardDescription>
              {t("videos.recentVideos.description")}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/videos")}
          >
            {t("videos.recentVideos.viewAll")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {recentVideos.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">
              {t("videos.recentVideos.empty")}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {recentVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="h-16 w-24 rounded-md">
                    <img
                      src={video.thumbnail || "/placeholder-thumbnail.jpg"}
                      alt={video.title}
                      className="object-cover"
                    />
                  </Avatar>
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full bg-black/50"
                    >
                      <Play className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>
                        {formatViews(video.views)}{" "}
                        {t("videos.analytics.views").toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

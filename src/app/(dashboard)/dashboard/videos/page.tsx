"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { VideoStorageStats } from "@/components/video/video-storage-stats";
import { VideoAnalytics } from "@/components/video/video-analytics";
import { RecentVideosList } from "@/components/video/recent-videos-list";
import { VideoCategories } from "@/components/video/video-categories";
import { useTranslations } from "@/hooks/use-translations";
import { VideoManagement } from "@/components/video/video-management";
import { Skeleton } from "@/components/ui/skeleton";

// Yükleme durumu için iskelet bileşenleri
function VideoManagementSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-full max-w-md" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-full max-w-md" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}

export default function VideosPage() {
  console.log("Rendering Videos page");
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tüm verilerin yüklendiğini simüle et
    const timer = setTimeout(() => {
      console.log("All data loaded");
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Video Management Skeleton */}
        <Card>
          <CardContent className="p-6">
            <Suspense fallback={<VideoManagementSkeleton />}>
              <VideoManagement />
            </Suspense>
          </CardContent>
        </Card>

        {/* Storage and Analytics Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardContent className="p-6 h-80">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardContent className="p-6 h-80">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Recent Videos and Categories */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardContent className="p-6 h-80">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardContent className="p-6 h-80">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Gerçek içerikler */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("videos.title")}
          </h1>
          <p className="text-muted-foreground">{t("videos.description")}</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Suspense fallback={<VideoManagementSkeleton />}>
            <VideoManagement />
          </Suspense>
        </CardContent>
      </Card>

      {/* Diğer bileşenler için gerçek içerikler */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <Suspense fallback={<AnalyticsSkeleton />}>
            <VideoAnalytics />
          </Suspense>
        </Card>
        <Card className="col-span-3">
          <Suspense fallback={<AnalyticsSkeleton />}>
            <VideoStorageStats />
          </Suspense>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <Suspense fallback={<AnalyticsSkeleton />}>
            <RecentVideosList />
          </Suspense>
        </Card>
        <Card className="col-span-3">
          <Suspense fallback={<AnalyticsSkeleton />}>
            <VideoCategories />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}

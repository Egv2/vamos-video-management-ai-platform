"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "@/hooks/use-translations";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Image,
  Subtitles,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface VideoProcessingHistoryProps {
  limit?: number;
  showPagination?: boolean;
  showFilters?: boolean;
}

export function VideoProcessingHistory({
  limit = 5,
  showPagination = true,
  showFilters = true,
}: VideoProcessingHistoryProps) {
  console.log("Rendering VideoProcessingHistory");
  const { t } = useTranslations();
  const { language } = useLanguage();
  const router = useRouter();

  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchHistory = async () => {
    console.log("Fetching video processing history");
    setIsLoading(true);

    try {
      let url = `/api/videos/history?page=${page}&limit=${limit}`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        console.log(
          "Video processing history fetched:",
          data.data.length,
          "items"
        );
        setHistory(data.data);
        setTotalPages(data.pagination.totalPages);
      } else {
        console.error("Failed to fetch history:", data.error);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, statusFilter, limit]);

  const handleViewDetails = (videoId: string) => {
    console.log("Navigating to video details:", videoId);
    router.push(`/dashboard/videos/details/${videoId}`);
  };

  const handleProcessAgain = (videoId: string) => {
    console.log("Processing video again:", videoId);
    router.push(`/dashboard/videos/process?videoId=${videoId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "processing":
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">{t(`videos.status.${status}`)}</Badge>;
      case "failed":
        return (
          <Badge variant="destructive">{t(`videos.status.${status}`)}</Badge>
        );
      case "processing":
        return <Badge variant="default">{t(`videos.status.${status}`)}</Badge>;
      default:
        return (
          <Badge variant="secondary">{t(`videos.status.${status}`)}</Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("videos.history.title")}</CardTitle>
        {showFilters && (
          <div className="flex gap-2">
            <Button
              variant={statusFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(null)}
            >
              {t("videos.history.all")}
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
            >
              {t("videos.status.completed")}
            </Button>
            <Button
              variant={statusFilter === "failed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("failed")}
            >
              {t("videos.status.failed")}
            </Button>
          </div>
        )}
        <Button variant="outline" size="icon" onClick={fetchHistory}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("videos.history.empty")}
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {t("videos.noThumbnail")}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(item.createdAt), {
                          addSuffix: true,
                          locale: language === "tr" ? tr : undefined,
                        })}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {item.features.watermark && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Image className="h-3 w-3" />
                          {t("watermarks.applied")}
                        </div>
                      )}
                      {item.features.subtitles && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Subtitles className="h-3 w-3" />
                          {t("subtitles.applied")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(item.videoId)}
                  >
                    {t("common.details")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleProcessAgain(item.videoId)}
                  >
                    {t("videos.history.processAgain")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t("common.previous")}
            </Button>
            <span className="text-sm text-muted-foreground">
              {t("common.page")} {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || isLoading}
            >
              {t("common.next")}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

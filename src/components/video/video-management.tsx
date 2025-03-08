"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/hooks/use-translations";
import {
  Search,
  Filter,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash,
  Plus,
  History,
  SortAsc,
  SortDesc,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FloatingActionPanelRoot,
  FloatingActionPanelTrigger,
  FloatingActionPanelContent,
  FloatingActionPanelButton,
} from "@/components/ui/floating-action-panel";
import { toast } from "sonner";
import { VideoDetailDialog } from "@/components/video/video-detail-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoUploader } from "./video-uploader";
import { VideoTable } from "./video-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: number;
  status:
    | "ready"
    | "processing"
    | "error"
    | "pending"
    | "processed"
    | "completed";
  createdAt: string;
}

interface PexelsVideo {
  id: number;
  video_files: Array<{ link: string }>;
  image: string;
  duration: number;
}

interface VideoManagementProps {
  isLoading?: boolean;
}

export function VideoManagement({ isLoading }: VideoManagementProps) {
  console.log("Rendering VideoManagement component");
  const { t } = useTranslations();
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [activeTab, setActiveTab] = useState("list");
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();

  const fetchVideos = useCallback(async () => {
    try {
      console.log("Fetching videos...");
      setIsFetching(true);

      console.log("Fetching videos from Pexels API");
      if (videos.length > 0) {
        console.log("Videos already loaded, skipping fetch");
        return;
      }

      setError(null);
      console.log("Making API request to Pexels");

      const response = await fetch(
        "https://api.pexels.com/videos/search?query=nature&per_page=6",
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY || "",
          },
        }
      );

      if (!response.ok) {
        console.error("API request failed:", response.status);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Successfully received video data");

      const formattedVideos = data.videos.map((video: PexelsVideo) => ({
        id: video.id.toString(),
        title: `Video ${video.id}`,
        url: video.video_files[0].link,
        thumbnail: video.image,
        duration: video.duration,
        status: "ready",
        createdAt: new Date().toISOString(),
      }));

      console.log("Formatted videos:", formattedVideos.length);
      setVideos(formattedVideos);
    } catch (error) {
      console.error("Error in fetchVideos:", error);
      setError(t("common.error"));
      toast.error(t("common.error"));
    } finally {
      setIsFetching(false);
    }
  }, [t, videos.length]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleOpenVideo = (url: string) => {
    window.open(url, "_blank");
  };

  const handleDeleteVideo = async (videoId: string) => {
    console.log("Deleting video:", videoId);
    const confirmDelete = window.confirm(t("videos.delete.confirm"));
    if (confirmDelete) {
      setVideos(videos.filter((video) => video.id !== videoId));
      toast.success(t("videos.delete.success"));
    }
  };

  const handleEdit = (video: Video) => {
    console.log("Editing video:", video);
    setSelectedVideo(video);
    setIsDetailDialogOpen(true);
  };

  const handleProcessVideo = () => {
    console.log("Navigating to video process page");
    router.push("/dashboard/videos/process");
  };

  const handleViewHistory = () => {
    console.log("Navigating to video history page");
    router.push("/dashboard/videos/history");
  };

  const handleUploadComplete = (
    videoUrl: string,
    videoId: string,
    title: string
  ) => {
    console.log("Upload completed:", { videoUrl, videoId, title });

    // Yeni video ekle
    const newVideo = {
      id: videoId,
      title: title,
      url: videoUrl,
      thumbnail: "/thumbnails/placeholder.jpg", // Varsayılan thumbnail
      duration: 0, // String yerine number kullan
      status: "processing" as const,
      createdAt: new Date().toISOString(),
    };

    setVideos([newVideo, ...videos]);
    toast.success(t("videos.upload.success"));
    setActiveTab("list"); // Yükleme sonrası liste tabına geç
  };

  if (isLoading || isFetching) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 w-full max-w-md">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("videos.thumbnail")}</TableHead>
              <TableHead>{t("common.title")}</TableHead>
              <TableHead>{t("videos.duration")}</TableHead>
              <TableHead>{t("videos.status.status")}</TableHead>
              <TableHead>{t("videos.createdAt")}</TableHead>
              <TableHead className="w-[100px]">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-16 w-24 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CardHeader className="px-0 pt-0">
        <CardTitle>{t("videos.management.title")}</CardTitle>
        <CardDescription>{t("videos.management.description")}</CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="list">{t("videos.title")}</TabsTrigger>
          <TabsTrigger value="upload">{t("videos.upload.title")}</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("videos.management.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t("videos.filter")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("videos.filter.all")}</SelectItem>
                  <SelectItem value="pending">
                    {t("videos.filter.pending")}
                  </SelectItem>
                  <SelectItem value="processing">
                    {t("videos.filter.processing")}
                  </SelectItem>
                  <SelectItem value="completed">
                    {t("videos.filter.completed")}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t("videos.sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">
                    {t("videos.sort.newest")}
                  </SelectItem>
                  <SelectItem value="oldest">
                    {t("videos.sort.oldest")}
                  </SelectItem>
                  <SelectItem value="title">
                    {t("videos.sort.title")}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue
                    placeholder={t("videos.management.itemsPerPage")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <VideoTable
            isLoading={isLoading || false}
            searchQuery={searchQuery}
            filter={filter}
            sortBy={sortBy}
            itemsPerPage={parseInt(itemsPerPage)}
          />
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardContent className="pt-6">
              <VideoUploader onUploadComplete={handleUploadComplete} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <VideoDetailDialog
        video={selectedVideo}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        onSave={async (videoId, newTitle) => {
          setVideos(
            videos.map((video) =>
              video.id === videoId ? { ...video, title: newTitle } : video
            )
          );
          toast.success(t("videos.messages.editSuccess"));
        }}
        onDelete={handleDeleteVideo}
      />
    </div>
  );
}

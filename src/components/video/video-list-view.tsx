"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Pencil, Trash, Link, Filter } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "@/hooks/use-translations";
import { toast } from "sonner";
import { Video } from "@/types/video";
import Image from "next/image";

interface VideoListViewProps {
  videos: Video[];
  onDelete: (id: string) => void;
  onEdit: (video: Video) => void;
  onCopyLink?: (url: string) => void;
}

export function VideoListView({
  videos,
  onDelete,
  onEdit,
  onCopyLink,
}: VideoListViewProps) {
  const { t } = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyLink = (url: string) => {
    if (onCopyLink) {
      onCopyLink(url);
    } else {
      navigator.clipboard.writeText(url);
      toast.success(t("videos.linkCopied"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("videos.list")}</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder={t("videos.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[200px]"
            />
            <Badge variant="outline">
              <Filter className="h-4 w-4 mr-1" />
              {filteredVideos.length} {t("videos.items")}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("videos.thumbnail")}</TableHead>
              <TableHead>{t("videos.title")}</TableHead>
              <TableHead>{t("videos.category")}</TableHead>
              <TableHead>{t("videos.folder")}</TableHead>
              <TableHead>{t("videos.duration")}</TableHead>
              <TableHead>{t("videos.uploadDate")}</TableHead>
              <TableHead>{t("videos.status")}</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVideos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>
                  <div className="relative h-12 w-20">
                    <Image
                      src={video.thumbnail || "/placeholder-image.jpg"}
                      alt={video.title}
                      fill
                      className="object-cover rounded"
                      sizes="80px"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{video.title}</TableCell>
                <TableCell>{video.category || "-"}</TableCell>
                <TableCell>{video.folder || "-"}</TableCell>
                <TableCell>{video.duration}s</TableCell>
                <TableCell>
                  {format(new Date(video.createdAt), "dd MMM yyyy")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={video.status === "ready" ? "default" : "secondary"}
                  >
                    {t(`videos.status.status.${video.status}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <FloatingActionPanelRoot>
                    {() => (
                      <>
                        <FloatingActionPanelTrigger
                          title={t("videos.actions")}
                          mode="actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </FloatingActionPanelTrigger>
                        <FloatingActionPanelContent>
                          <div className="space-y-1 p-2">
                            <FloatingActionPanelButton
                              onClick={() => onEdit(video)}
                            >
                              <Pencil className="h-4 w-4" />
                              {t("videos.edit")}
                            </FloatingActionPanelButton>
                            <FloatingActionPanelButton
                              onClick={() => handleCopyLink(video.url)}
                            >
                              <Link className="h-4 w-4" />
                              {t("videos.copyLink")}
                            </FloatingActionPanelButton>
                            <FloatingActionPanelButton
                              onClick={() => onDelete(video.id)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash className="h-4 w-4" />
                              {t("videos.delete")}
                            </FloatingActionPanelButton>
                          </div>
                        </FloatingActionPanelContent>
                      </>
                    )}
                  </FloatingActionPanelRoot>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

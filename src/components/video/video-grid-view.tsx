"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Link, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "@/hooks/use-translations";
import { Video } from "@/types/video";

interface VideoGridViewProps {
  videos: Video[];
  onDelete: (id: string) => void;
  onCopyLink: (url: string) => void;
  onEdit: (video: Video) => void;
}

export function VideoGridView({
  videos,
  onDelete,
  onCopyLink,
}: VideoGridViewProps) {
  const { t } = useTranslations();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <Card
          key={video.id}
          className="group hover:shadow-lg transition-shadow"
        >
          <CardHeader className="space-y-0 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base truncate">
                  {video.title}
                </CardTitle>
                <Badge
                  variant={video.status === "ready" ? "default" : "secondary"}
                >
                  {t(`videos.status.${video.status}`)}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onCopyLink(video.url)}>
                    <Link className="h-4 w-4 mr-2" />
                    {t("videos.copyLink")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDelete(video.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    {t("common.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-md bg-muted relative group-hover:opacity-75 transition-opacity">
              <iframe
                src={video.url}
                className="absolute inset-0 w-full h-full object-cover rounded-md"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

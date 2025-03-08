"use client";

import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useTranslations } from "@/hooks/use-translations";
import { Progress } from "@/components/ui/progress";
import { HardDrive, Database, Cloud } from "lucide-react";
import { Card } from "@/components/ui/card";
interface StorageData {
  used: number;
  total: number;
  categories: {
    name: string;
    size: number;
    color: string;
  }[];
}

export function VideoStorageStats() {
  console.log("Rendering VideoStorageStats component");
  const { t } = useTranslations();

  // Örnek veri
  const usedSpace = 128; // GB
  const totalSpace = 500; // GB
  const remainingSpace = totalSpace - usedSpace;
  const usagePercent = (usedSpace / totalSpace) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("videos.storage.title")}</CardTitle>
        <CardDescription>{t("videos.storage.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {t("videos.storage.used")}
            </span>
            <span className="font-medium">{usedSpace} GB</span>
          </div>
          <Progress value={usagePercent} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 GB</span>
            <span>{totalSpace} GB</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <HardDrive className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{t("videos.storage.used")}</p>
              <p className="text-2xl font-bold">{usedSpace} GB</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{t("videos.storage.total")}</p>
              <p className="text-2xl font-bold">{totalSpace} GB</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Cloud className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {t("videos.storage.remaining")}
              </p>
              <p className="text-2xl font-bold">{remainingSpace} GB</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

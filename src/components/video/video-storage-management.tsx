"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "@/hooks/use-translations";
import {
  Database,
  HardDrive,
  Cloud,
  Settings,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export function VideoStorageManagement() {
  console.log("Rendering VideoStorageManagement");
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [storageData, setStorageData] = useState({
    local: {
      used: 0,
      total: 100,
      videos: 0,
    },
    cloud: {
      used: 0,
      total: 500,
      videos: 0,
    },
  });

  useEffect(() => {
    // Gerçek uygulamada API'den depolama verilerini çek
    const fetchStorageData = async () => {
      console.log("Fetching storage data");
      try {
        // Simüle edilmiş veri
        setTimeout(() => {
          setStorageData({
            local: {
              used: 45,
              total: 100,
              videos: 12,
            },
            cloud: {
              used: 120,
              total: 500,
              videos: 35,
            },
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching storage data:", error);
        toast.error(t("storage.error.fetchFailed"));
        setIsLoading(false);
      }
    };

    fetchStorageData();
  }, []);

  const handleCleanupStorage = () => {
    console.log("Cleaning up storage");
    toast.success(t("storage.cleanup.started"));
    // Gerçek uygulamada temizleme API'si çağrılır
  };

  const handleConfigureStorage = () => {
    console.log("Opening storage configuration");
    // Gerçek uygulamada depolama ayarları modalı açılır
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          {t("storage.management.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="local">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="local">
              <HardDrive className="h-4 w-4 mr-2" />
              {t("storage.local")}
            </TabsTrigger>
            <TabsTrigger value="cloud">
              <Cloud className="h-4 w-4 mr-2" />
              {t("storage.cloud")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="local" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("storage.used")}</span>
                <span className="font-medium">
                  {storageData.local.used} GB / {storageData.local.total} GB
                </span>
              </div>
              <Progress
                value={(storageData.local.used / storageData.local.total) * 100}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {t("storage.videos")}: {storageData.local.videos}
                </span>
                <span>
                  {(
                    (storageData.local.used / storageData.local.total) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>

            {storageData.local.used / storageData.local.total > 0.8 && (
              <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 p-3 rounded-md flex items-start gap-2 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{t("storage.warnings.localNearlyFull")}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCleanupStorage}
              >
                {t("storage.cleanup.title")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfigureStorage}
              >
                <Settings className="h-4 w-4 mr-1" />
                {t("storage.configure")}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="cloud" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("storage.used")}</span>
                <span className="font-medium">
                  {storageData.cloud.used} GB / {storageData.cloud.total} GB
                </span>
              </div>
              <Progress
                value={(storageData.cloud.used / storageData.cloud.total) * 100}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {t("storage.videos")}: {storageData.cloud.videos}
                </span>
                <span>
                  {(
                    (storageData.cloud.used / storageData.cloud.total) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfigureStorage}
              >
                <Settings className="h-4 w-4 mr-1" />
                {t("storage.cloudSettings")}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Users, ImageIcon, AlertCircle } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Interface for admin dashboard stats
interface DashboardStats {
  totalVideos: number;
  pendingApprovals: number;
  recentUploads: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  // Initialize states
  const [stats, setStats] = useState<DashboardStats>({
    totalVideos: 0,
    pendingApprovals: 0,
    recentUploads: 0,
    activeUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Hooks
  const { t } = useTranslations();
  const router = useRouter();

  // Handle navigation for quick actions
  const handleNavigation = (path: string) => {
    console.log("Navigating to:", path);
    router.push(path);
  };

  useEffect(() => {
    const fetchStats = async () => {
      console.log("Fetching admin dashboard stats");
      try {
        // API çağrısı simülasyonu
        const mockStats = {
          totalVideos: 156,
          pendingApprovals: 8,
          recentUploads: 12,
          activeUsers: 45,
        };
        setStats(mockStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error(t("common.error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []); // Boş dependency array eklendi

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("admin.title")}</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          // Loading state
          Array(4)
            .fill(null)
            .map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))
        ) : (
          // Actual stats
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {t("admin.metrics.totalVideos")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVideos}</div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 dark:bg-yellow-900/10">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {t("admin.metrics.pendingApprovals")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.pendingApprovals}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {t("admin.metrics.recentUploads")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentUploads}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {t("admin.metrics.activeUsers")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.quickActions")}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => handleNavigation("/dashboard/seo-approvals")}
            disabled={isLoading}
          >
            <Video className="mr-2 h-4 w-4" />
            {t("admin.pendingApprovals")}
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => handleNavigation("/dashboard/users")}
            disabled={isLoading}
          >
            <Users className="mr-2 h-4 w-4" />
            {t("admin.manageUsers")}
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => handleNavigation("/dashboard/watermarks")}
            disabled={isLoading}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            {t("admin.watermarkManagement")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useTranslations } from "@/hooks/use-translations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, List, CheckCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminMenu() {
  console.log("Rendering AdminMenu component");
  const { t } = useTranslations();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    console.log("Navigating to:", path);
    router.push(path);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Video Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5" />
            {t("admin.videoManagement")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleNavigation("/dashboard/videos")}
          >
            <Upload className="mr-2 h-4 w-4" />
            {t("admin.uploadVideo")}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleNavigation("/dashboard/videos/list")}
          >
            <List className="mr-2 h-4 w-4" />
            {t("admin.videoList")}
          </Button>
        </CardContent>
      </Card>

      {/* SEO Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {t("admin.seoContent")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleNavigation("/dashboard/seo")}
          >
            <List className="mr-2 h-4 w-4" />
            {t("admin.descriptionList")}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleNavigation("/dashboard/seo/approvals")}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {t("admin.pendingApprovals")}
          </Button>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t("admin.userManagement")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleNavigation("/dashboard/users")}
          >
            <Users className="mr-2 h-4 w-4" />
            {t("admin.manageUsers")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

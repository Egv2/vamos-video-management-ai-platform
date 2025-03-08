"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Video,
  FileText,
  Users,
  Upload,
  CheckSquare,
  Clock,
  ChevronRight,
  BarChart2,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "@/hooks/use-translations";
import { AdminMenu } from "@/components/admin-menu";
import { RecentVideosList } from "@/components/video/recent-videos-list";

export default function DashboardPage() {
  console.log("Rendering Enhanced Dashboard Page");
  const { t } = useTranslations();

  const stats = [
    {
      id: 1,
      name: t("dashboard.stats.totalVideos"),
      value: "124",
      change: "+12",
      changeType: "positive",
      icon: Video,
      description: t("dashboard.stats.totalVideosDesc"),
    },
    {
      id: 2,
      name: t("dashboard.stats.processed"),
      value: "98",
      change: "+8",
      changeType: "positive",
      icon: CheckSquare,
      description: t("dashboard.stats.processedDesc"),
    },
    {
      id: 3,
      name: t("dashboard.stats.pendingApprovals"),
      value: "16",
      change: "-2",
      changeType: "negative",
      icon: Clock,
      description: t("dashboard.stats.pendingApprovalsDesc"),
    },
    {
      id: 4,
      name: t("dashboard.stats.activeUsers"),
      value: "24",
      change: "+3",
      changeType: "positive",
      icon: Users,
      description: t("dashboard.stats.activeUsersDesc"),
    },
  ];

  const quickActions = [
    {
      id: 1,
      name: t("dashboard.quickActions.uploadVideo"),
      description: t("dashboard.quickActions.uploadVideoDesc"),
      href: "/dashboard/videos/upload",
      icon: Upload,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      name: t("dashboard.quickActions.generateSeo"),
      description: t("dashboard.quickActions.generateSeoDesc"),
      href: "/dashboard/seo",
      icon: FileText,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      id: 3,
      name: t("dashboard.quickActions.reviewSeo"),
      description: t("dashboard.quickActions.reviewSeoDesc"),
      href: "/dashboard/seo-approvals",
      icon: CheckSquare,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <AdminMenu />
      <div className="container mx-auto p-6 space-y-8">
        {/* Welcome Section with Quick Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {t("dashboard.title")}
            </h1>
            <p className="text-muted-foreground">{t("dashboard.welcome")}</p>
          </div>
          <Button className="hidden md:flex items-center gap-2">
            <Settings className="w-4 h-4" />
            {t("dashboard.configureWorkspace")}
          </Button>
        </div>

        {/* Stats Grid with Enhanced Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.id} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <stat.icon
                  className={`h-4 w-4 ${
                    stat.changeType === "positive"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <Badge
                  variant={
                    stat.changeType === "positive" ? "default" : "destructive"
                  }
                  className="absolute top-3 right-3"
                >
                  {stat.change}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions Grid with Interactive Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link href={action.href} key={action.id}>
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${action.bgColor}`}>
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                        {action.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {action.description}
                      </CardDescription>
                    </div>
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity Tabs */}
        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recent">
              <Clock className="h-4 w-4 mr-2" />
              {t("dashboard.tabs.recentVideos")}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart2 className="h-4 w-4 mr-2" />
              {t("dashboard.tabs.analytics")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{t("dashboard.recentVideos.title")}</CardTitle>
                    <CardDescription>
                      {t("dashboard.recentVideos.description")}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex items-center gap-2"
                  >
                    <Video className="h-4 w-4" />
                    {t("dashboard.viewAll")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <RecentVideosList />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.analytics.title")}</CardTitle>
                <CardDescription>
                  {t("dashboard.analytics.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Analytics content will go here */}
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  {t("dashboard.analytics.comingSoon")}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

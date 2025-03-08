"use client";

import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useTranslations } from "@/hooks/use-translations";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface AnalyticsData {
  day: string;
  views: number;
  uploads: number;
}

// Örnek veri
const viewsData = [
  { name: "Pzt", views: 400 },
  { name: "Sal", views: 300 },
  { name: "Çar", views: 500 },
  { name: "Per", views: 280 },
  { name: "Cum", views: 590 },
  { name: "Cmt", views: 800 },
  { name: "Paz", views: 700 },
];

const engagementData = [
  { name: "Beğeni", value: 540 },
  { name: "Yorum", value: 210 },
  { name: "Paylaşım", value: 170 },
  { name: "Kaydedilen", value: 320 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function VideoAnalytics({ isLoading }: { isLoading?: boolean }) {
  console.log("Rendering VideoAnalytics");
  const { t } = useTranslations();

  if (isLoading) {
    return (
      <div className="h-80 space-y-4 p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Mock data - will be replaced with real data from API
  const analyticsData: AnalyticsData[] = [
    { day: "Mon", views: 30, uploads: 4 },
    { day: "Tue", views: 45, uploads: 5 },
    { day: "Wed", views: 38, uploads: 7 },
    { day: "Thu", views: 50, uploads: 3 },
    { day: "Fri", views: 35, uploads: 6 },
    { day: "Sat", views: 25, uploads: 2 },
    { day: "Sun", views: 40, uploads: 4 },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle>{t("videos.analytics.title")}</CardTitle>
        <CardDescription>{t("videos.analytics.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="views" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="views">
              {t("videos.analytics.views")}
            </TabsTrigger>
            <TabsTrigger value="engagement">
              {t("videos.analytics.engagement")}
            </TabsTrigger>
            <TabsTrigger value="duration">
              {t("videos.analytics.duration")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="views" className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    {t("videos.analytics.viewsToday")}
                  </p>
                  <h3 className="text-2xl font-bold">245</h3>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    {t("videos.analytics.viewsThisWeek")}
                  </p>
                  <h3 className="text-2xl font-bold">3,570</h3>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    {t("videos.analytics.viewsThisMonth")}
                  </p>
                  <h3 className="text-2xl font-bold">12,840</h3>
                </CardContent>
              </Card>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={viewsData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="engagement">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {engagementData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="duration">
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">
                {t("dashboard.analytics.comingSoon")}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

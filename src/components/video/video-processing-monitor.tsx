"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/use-translations";
import {
  RefreshCcw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

interface ProcessingJob {
  id: string;
  title: string;
  progress: number;
  status: "queued" | "processing" | "completed" | "failed";
  startedAt: string;
  estimatedCompletion?: string;
}

export function VideoProcessingMonitor() {
  console.log("Rendering VideoProcessingMonitor");
  const { t } = useTranslations();
  const [activeJobs, setActiveJobs] = useState<ProcessingJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchActiveJobs = async () => {
    console.log("Fetching active processing jobs");
    setIsLoading(true);

    try {
      // Gerçek uygulamada API çağrısı yapılır
      // const response = await fetch("/api/videos/processing/active");
      // const data = await response.json();

      // Simüle edilmiş veri
      setTimeout(() => {
        const mockJobs: ProcessingJob[] = [
          {
            id: "job-1",
            title: "Tanıtım Videosu 2023.mp4",
            progress: 75,
            status: "processing",
            startedAt: new Date(Date.now() - 15 * 60000).toISOString(),
            estimatedCompletion: new Date(Date.now() + 5 * 60000).toISOString(),
          },
          {
            id: "job-2",
            title: "Ürün Demo.mp4",
            progress: 100,
            status: "completed",
            startedAt: new Date(Date.now() - 30 * 60000).toISOString(),
          },
          {
            id: "job-3",
            title: "Eğitim Videosu.mp4",
            progress: 0,
            status: "queued",
            startedAt: new Date(Date.now() - 2 * 60000).toISOString(),
          },
        ];

        setActiveJobs(mockJobs);
        setLastUpdated(new Date());
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching active jobs:", error);
      toast.error(t("processing.error.fetchFailed"));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveJobs();

    // Her 30 saniyede bir güncelle
    const interval = setInterval(fetchActiveJobs, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    console.log("Manually refreshing job status");
    fetchActiveJobs();
  };

  const handleCancelJob = (jobId: string) => {
    console.log("Cancelling job:", jobId);
    // Gerçek uygulamada API çağrısı yapılır
    toast.success(t("processing.job.cancelled"));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success">{t(`processing.status.${status}`)}</Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            {t(`processing.status.${status}`)}
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="default">{t(`processing.status.${status}`)}</Badge>
        );
      default:
        return (
          <Badge variant="secondary">{t(`processing.status.${status}`)}</Badge>
        );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "processing":
        return <RefreshCcw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          {t("processing.monitor.title")}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCcw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeJobs.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {t("processing.monitor.noActiveJobs")}
          </div>
        ) : (
          <div className="space-y-4">
            {activeJobs.map((job) => (
              <div
                key={job.id}
                className="space-y-2 border-b pb-4 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(job.status)}
                    <span className="font-medium">{job.title}</span>
                  </div>
                  {getStatusBadge(job.status)}
                </div>

                {job.status === "processing" && (
                  <>
                    <div className="space-y-1">
                      <Progress value={job.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{job.progress}%</span>
                        {job.estimatedCompletion && (
                          <span>
                            {t("processing.estimatedCompletion")}:{" "}
                            {new Date(
                              job.estimatedCompletion
                            ).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelJob(job.id)}
                    >
                      {t("processing.job.cancel")}
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground text-right">
          {t("processing.lastUpdated")}: {lastUpdated.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

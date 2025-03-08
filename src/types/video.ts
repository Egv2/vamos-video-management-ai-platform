export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  category?: string;
  folder?: string;
  duration: number;
  status: "processing" | "ready" | "error";
  createdAt: string;
}

export interface VideoProcessingHistory {
  id: string;
  videoId: string;
  title: string;
  createdAt: string;
  completedAt: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  features: {
    watermark: boolean;
    subtitles: boolean;
  };
  url: string | null;
  thumbnailUrl: string | null;
}

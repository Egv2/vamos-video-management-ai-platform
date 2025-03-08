import { NextRequest, NextResponse } from "next/server";
import { customFFmpeg } from "@/lib/ffmpeg";

// Mark this route as dynamic to prevent it from being pre-rendered during build
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  console.log("Processing video request received");

  try {
    const data = await request.formData();
    const videoFile = data.get("video") as File;
    const videoId = data.get("videoId") as string;
    const title = data.get("title") as string;
    const outputFormat = (data.get("outputFormat") as string) || "mp4";

    const watermarkFile = data.get("watermarkFile") as File | null;
    const watermarkSettings = data.get("watermarkSettings")
      ? JSON.parse(data.get("watermarkSettings") as string)
      : null;

    const subtitleFile = data.get("subtitleFile") as File | null;

    console.log("Processing video:", {
      videoId,
      title,
      hasWatermark: !!watermarkFile,
      hasSubtitles: !!subtitleFile,
    });

    if (!videoFile && !videoId) {
      return NextResponse.json(
        { error: "Video file or ID is required" },
        { status: 400 }
      );
    }

    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return NextResponse.json(
        { error: "Video processing is only available in browser environment" },
        { status: 400 }
      );
    }

    // FFmpeg ile video işleme
    const result = await customFFmpeg.addProcessingJob({
      videoFile,
      watermarkFile,
      subtitleFile,
      options: watermarkSettings,
    });

    // Başarılı yanıt döndür
    return NextResponse.json({
      success: true,
      videoId: videoId || "new_video_id", // Gerçek uygulamada DB'den gelecek
      title,
      url: result.url,
      message: "Video processing completed successfully",
      outputFileName: `output-${Date.now()}.${outputFormat}`,
    });
  } catch (error) {
    console.error("Video processing error:", error);
    return NextResponse.json(
      { error: "Video processing failed" },
      { status: 500 }
    );
  }
}

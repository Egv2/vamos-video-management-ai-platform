import { NextRequest, NextResponse } from "next/server";

// Gerçek uygulamada veritabanından gelecek
const mockHistory: any[] = [
  {
    id: "hist_1",
    videoId: "vid_1",
    title: "Tanıtım Videosu",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    completedAt: new Date(
      Date.now() - 3600000 * 24 * 2 + 1200000
    ).toISOString(),
    status: "completed",
    features: {
      watermark: true,
      subtitles: true,
    },
    url: "https://example.com/videos/processed_1.mp4",
    thumbnailUrl: "https://example.com/thumbnails/1.jpg",
  },
  {
    id: "hist_2",
    videoId: "vid_2",
    title: "Ürün Demosu",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 24 + 900000).toISOString(),
    status: "completed",
    features: {
      watermark: true,
      subtitles: false,
    },
    url: "https://example.com/videos/processed_2.mp4",
    thumbnailUrl: "https://example.com/thumbnails/2.jpg",
  },
  {
    id: "hist_3",
    videoId: "vid_3",
    title: "Eğitim Videosu",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    completedAt: null,
    status: "failed",
    features: {
      watermark: false,
      subtitles: true,
    },
    url: null,
    thumbnailUrl: "https://example.com/thumbnails/3.jpg",
  },
  {
    id: "hist_4",
    videoId: "vid_4",
    title: "Webinar Kaydı",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 2 + 1800000).toISOString(),
    status: "completed",
    features: {
      watermark: true,
      subtitles: true,
    },
    url: "https://example.com/videos/processed_4.mp4",
    thumbnailUrl: "https://example.com/thumbnails/4.jpg",
  },
];

export async function GET(request: NextRequest) {
  console.log("Video processing history API called");

  try {
    // Gerçek uygulamada veritabanından sorgu yapılır
    // Örnek olarak mock veri dönüyoruz

    // Sayfalama ve filtreleme için URL parametrelerini al
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    // Filtreleme
    let filteredHistory = [...mockHistory];
    if (status) {
      filteredHistory = filteredHistory.filter(
        (item) => item.status === status
      );
    }

    // Sayfalama
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedHistory,
      pagination: {
        total: filteredHistory.length,
        page,
        limit,
        totalPages: Math.ceil(filteredHistory.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching video processing history:", error);
    return NextResponse.json(
      { error: "Failed to fetch video processing history" },
      { status: 500 }
    );
  }
}

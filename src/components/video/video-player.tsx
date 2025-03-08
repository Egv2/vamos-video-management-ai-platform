"use client";

import { useState, useRef, useEffect } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
}

export function VideoPlayer({
  src,
  autoPlay = false,
  loop = false,
  poster,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="w-full aspect-video bg-black rounded-lg" />;
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 p-4">
          <p className="text-white">{error}</p>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={src}
        poster={poster}
        controls
        autoPlay={autoPlay}
        loop={loop}
        onError={(e) => {
          console.error("Video error:", e);
          setError("Failed to load video");
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { toBlobURL } from "@ffmpeg/util";

interface ProcessingOptions {
  videoFile: File;
  watermarkFile?: File | null;
  subtitleFile?: File | null;
  options?: {
    watermarkPosition?: string;
    watermarkOpacity?: number;
    watermarkSize?: number;
  };
}

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

class CustomFFmpeg {
  private ffmpeg: FFmpeg | null = null;
  private loaded: boolean = false;
  private baseURL: string = "";

  constructor() {
    // Only initialize FFmpeg in browser environment
    if (isBrowser) {
      this.ffmpeg = new FFmpeg();
    }
  }

  async load() {
    console.log("Loading FFmpeg");
    // Skip loading if not in browser or already loaded
    if (!isBrowser) {
      console.warn("FFmpeg can only be loaded in browser environment");
      return;
    }

    if (!this.loaded && this.ffmpeg) {
      // For v0.12.x, we need to load the core from a URL
      this.baseURL = await toBlobURL(
        `${window.location.origin}/ffmpeg-core/ffmpeg-core.js`,
        "text/javascript"
      );

      await this.ffmpeg.load({
        coreURL: this.baseURL,
      });

      this.loaded = true;
      console.log("FFmpeg loaded");
    }
  }

  async addWatermark(
    inputFileName: string,
    watermarkFileName: string,
    options: any
  ) {
    console.log("Adding watermark to video");
    if (!this.ffmpeg) {
      throw new Error("FFmpeg is not initialized");
    }

    // Watermark pozisyonu için FFmpeg filtresi oluştur
    let position = "overlay=W-w-10:H-h-10"; // Varsayılan: sağ alt

    switch (options.watermarkPosition) {
      case "top-left":
        position = "overlay=10:10";
        break;
      case "top-right":
        position = "overlay=W-w-10:10";
        break;
      case "bottom-left":
        position = "overlay=10:H-h-10";
        break;
      case "center":
        position = "overlay=(W-w)/2:(H-h)/2";
        break;
      // Varsayılan: bottom-right
    }

    // Şeffaflık ve boyut ayarları
    const opacity = options.watermarkOpacity || 1;
    const scale = options.watermarkSize
      ? `scale=iw*${options.watermarkSize / 100}:-1`
      : "";

    const watermarkFilter = scale
      ? `[1:v]${scale},format=rgba,colorchannelmixer=a=${opacity}[watermark];[0:v][watermark]${position}`
      : `[1:v]format=rgba,colorchannelmixer=a=${opacity}[watermark];[0:v][watermark]${position}`;

    // FFmpeg komutu çalıştır
    await this.ffmpeg.exec([
      "-i",
      inputFileName,
      "-i",
      watermarkFileName,
      "-filter_complex",
      watermarkFilter,
      "-c:a",
      "copy",
      "output_watermarked.mp4",
    ]);

    return "output_watermarked.mp4";
  }

  async addSubtitles(inputFileName: string, subtitleFileName: string) {
    console.log("Adding subtitles to video");
    if (!this.ffmpeg) {
      throw new Error("FFmpeg is not initialized");
    }

    // Altyazı dosyasını video içine göm
    await this.ffmpeg.exec([
      "-i",
      inputFileName,
      "-i",
      subtitleFileName,
      "-c:v",
      "copy",
      "-c:a",
      "copy",
      "-c:s",
      "mov_text",
      "-metadata:s:s:0",
      "language=tur",
      "output_with_subtitles.mp4",
    ]);

    return "output_with_subtitles.mp4";
  }

  async burnSubtitles(inputFileName: string, subtitleFileName: string) {
    console.log("Burning subtitles into video");
    if (!this.ffmpeg) {
      throw new Error("FFmpeg is not initialized");
    }

    // Altyazıyı videoya kalıcı olarak göm
    await this.ffmpeg.exec([
      "-i",
      inputFileName,
      "-vf",
      `subtitles=${subtitleFileName}`,
      "-c:a",
      "copy",
      "output_burned_subtitles.mp4",
    ]);

    return "output_burned_subtitles.mp4";
  }

  async processVideo(options: ProcessingOptions) {
    console.log("Processing video with options:", options);
    if (!isBrowser) {
      throw new Error(
        "Video processing is only available in browser environment"
      );
    }

    try {
      await this.load();
      if (!this.ffmpeg) {
        throw new Error("FFmpeg is not initialized");
      }

      // Video dosyasını FFmpeg'e yükle
      const inputFileName = "input.mp4";
      await this.ffmpeg.writeFile(
        inputFileName,
        await fetchFile(options.videoFile)
      );

      let outputFileName = inputFileName;

      // Filigran ekle
      if (options.watermarkFile && options.options) {
        const watermarkFileName = "watermark.png";
        await this.ffmpeg.writeFile(
          watermarkFileName,
          await fetchFile(options.watermarkFile)
        );

        outputFileName = await this.addWatermark(
          outputFileName,
          watermarkFileName,
          options.options
        );
      }

      // Altyazı ekle
      if (options.subtitleFile) {
        const subtitleFileName = "subtitles.srt";
        await this.ffmpeg.writeFile(
          subtitleFileName,
          await fetchFile(options.subtitleFile)
        );

        // Altyazıyı videoya göm (kalıcı olarak)
        outputFileName = await this.burnSubtitles(
          outputFileName,
          subtitleFileName
        );
      }

      // İşlenmiş videoyu al
      const data = await this.ffmpeg.readFile(outputFileName);

      // Blob oluştur
      const blob = new Blob(
        [
          data instanceof Uint8Array
            ? data
            : new TextEncoder().encode(data as string),
        ],
        { type: "video/mp4" }
      );
      const url = URL.createObjectURL(blob);

      return {
        url,
        blob,
      };
    } catch (error) {
      console.error("FFmpeg processing error:", error);
      throw error;
    }
  }

  async addProcessingJob(options: ProcessingOptions) {
    // Gerçek uygulamada burada bir kuyruk sistemi kullanılabilir
    console.log("Adding video processing job to queue");

    if (!isBrowser) {
      throw new Error(
        "Video processing is only available in browser environment"
      );
    }

    // Şimdilik doğrudan işleme yapıyoruz
    return await this.processVideo(options);
  }
}

export const customFFmpeg = new CustomFFmpeg();

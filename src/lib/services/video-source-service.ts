import { createClient } from "@supabase/supabase-js";

// Supabase istemcisini oluştur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export type VideoSourceType =
  | "default"
  | "pexels"
  | "custom"
  | "youtube"
  | "vimeo";

export interface VideoSourceSettings {
  sourceType: VideoSourceType;
  customUrl?: string;
  apiKey?: string;
  lastUpdated: string;
}

export const videoSourceService = {
  /**
   * Kullanıcının video kaynağı ayarlarını kaydet
   */
  async saveVideoSource(
    userId: string,
    sourceType: VideoSourceType,
    customUrl?: string,
    apiKey?: string
  ): Promise<void> {
    console.log("Saving video source to Supabase:", {
      userId,
      sourceType,
      customUrl,
      apiKey,
    });

    try {
      const { error } = await supabase.from("user_settings").upsert(
        {
          user_id: userId,
          setting_key: "video_source",
          setting_value: JSON.stringify({
            sourceType,
            customUrl,
            apiKey,
            lastUpdated: new Date().toISOString(),
          }),
        },
        {
          onConflict: "user_id,setting_key",
        }
      );

      if (error) {
        console.error("Error saving video source settings:", error);
        throw error;
      }

      console.log("Video source settings saved successfully");
    } catch (error) {
      console.error("Failed to save video source settings:", error);
      throw error;
    }
  },

  /**
   * Kullanıcının video kaynağı ayarlarını getir
   */
  async getVideoSource(userId: string): Promise<VideoSourceSettings | null> {
    console.log("Getting video source from Supabase for user:", userId);

    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("setting_value")
        .eq("user_id", userId)
        .eq("setting_key", "video_source")
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.log("No video source settings found for user", userId);
          return null;
        }
        console.error("Error fetching video source settings:", error);
        throw error;
      }

      if (!data) {
        return null;
      }

      const settings = JSON.parse(data.setting_value);
      console.log("Retrieved video source settings:", settings);

      return {
        sourceType: settings.sourceType,
        customUrl: settings.customUrl,
        apiKey: settings.apiKey,
        lastUpdated: settings.lastUpdated,
      };
    } catch (error) {
      console.error("Failed to get video source settings:", error);
      throw error;
    }
  },
};

import { toast } from "sonner";

export type SupportedLanguage = "en" | "tr";
const DEFAULT_LANGUAGE: SupportedLanguage = "en";
const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["en", "tr"];

export const detectUserLanguage = (): SupportedLanguage => {
  console.log("Detecting user language");

  try {
    // Get browser language (e.g., "en-US" or "tr-TR")
    const browserLang = navigator.language.split("-")[0] as SupportedLanguage;

    // Check if browser language is supported
    if (SUPPORTED_LANGUAGES.includes(browserLang)) {
      console.log("Detected supported language:", browserLang);
      return browserLang;
    }

    console.log(
      "Unsupported language, falling back to default:",
      DEFAULT_LANGUAGE
    );
    return DEFAULT_LANGUAGE;
  } catch (error) {
    console.error("Error detecting language:", error);
    toast.error("Error detecting language, using default");
    return DEFAULT_LANGUAGE;
  }
};

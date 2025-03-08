"use client";

import { useLanguage } from "@/context/language-context";
import enMessages from "@/messages/en.json";
import trMessages from "@/messages/tr.json";

export function useTranslations() {
  const { language } = useLanguage();
  console.log("Translation hook called with language:", language);

  const messages = language === "tr" ? trMessages : enMessages;

  const t = (key: string) => {
    try {
      // Boş veya geçersiz key kontrolü
      if (!key || typeof key !== "string") {
        console.error("Invalid translation key:", key);
        return key;
      }

      // Nested obje içinde değeri bul
      const value = key.split(".").reduce<unknown>((obj, k) => {
        if (!obj || typeof obj !== "object") {
          throw new Error(`Invalid path: ${key}`);
        }
        return (obj as Record<string, unknown>)[k];
      }, messages);

      // Tip kontrolü ve dönüşüm
      if (typeof value === "string") {
        return value;
      }

      // Obje döndüğünde detaylı hata mesajı
      if (value && typeof value === "object") {
        const availableKeys = Object.keys(value as object);
        const suggestion =
          availableKeys.length > 0
            ? `Available sub-keys: ${availableKeys.join(", ")}`
            : "No sub-keys available";

        console.warn(
          `Translation key "${key}" is an object. Use a more specific path. ${suggestion}`
        );
        return key;
      }

      // Çeviri bulunamadığında
      if (value === undefined) {
        console.warn(`Missing translation for key: ${key}`);
        return key;
      }

      // Beklenmeyen değer tipi
      console.error(
        `Unexpected value type for key "${key}":`,
        typeof value,
        value
      );
      return key;
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error);
      return key;
    }
  };

  return { t };
}

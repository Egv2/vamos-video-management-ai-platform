"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/language-context";
import { useTranslations } from "@/hooks/use-translations";

interface LanguageSelectorProps {
  onChange?: (value: string) => void;
  value?: string;
  className?: string;
}

export function LanguageSelector({
  onChange,
  value,
  className,
}: LanguageSelectorProps) {
  console.log("Rendering LanguageSelector");
  const { language } = useLanguage();
  const { t } = useTranslations();
  const [selectedLanguage, setSelectedLanguage] = useState(value || language);

  // Update selected language when language or value changes
  useEffect(() => {
    console.log("Updating selected language:", value || language);
    setSelectedLanguage(value || language);
  }, [language, value]);

  const handleLanguageChange = (newValue: string) => {
    console.log("Language changed to:", newValue);
    setSelectedLanguage(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className={className || "w-[180px]"}>
        <SelectValue placeholder={t("settings.language.selectPlaceholder")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="tr">Türkçe</SelectItem>
      </SelectContent>
    </Select>
  );
}

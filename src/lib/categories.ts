import { TTag } from "@/components/ui/multiple-select";

// English categories
export const EN_CATEGORIES: TTag[] = [
  { key: "technology", name: "Technology" },
  { key: "education", name: "Education" },
  { key: "entertainment", name: "Entertainment" },
  { key: "business", name: "Business" },
  { key: "lifestyle", name: "Lifestyle" },
  { key: "gaming", name: "Gaming" },
  { key: "sports", name: "Sports" },
  { key: "music", name: "Music" },
  { key: "news", name: "News" },
  { key: "howto", name: "How-To & DIY" },
];

// Turkish categories
export const TR_CATEGORIES: TTag[] = [
  { key: "technology", name: "Teknoloji" },
  { key: "education", name: "Eğitim" },
  { key: "entertainment", name: "Eğlence" },
  { key: "business", name: "İş" },
  { key: "lifestyle", name: "Yaşam Tarzı" },
  { key: "gaming", name: "Oyun" },
  { key: "sports", name: "Spor" },
  { key: "music", name: "Müzik" },
  { key: "news", name: "Haberler" },
  { key: "howto", name: "Nasıl Yapılır & DIY" },
];

// Get categories based on locale
export const getCategoriesByLocale = (locale: string): TTag[] => {
  console.log("Getting categories for locale:", locale);
  return locale === "tr" ? TR_CATEGORIES : EN_CATEGORIES;
};

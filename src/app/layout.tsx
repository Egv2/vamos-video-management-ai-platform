import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/context/language-context";
import enMessages from "@/messages/en.json";
import trMessages from "@/messages/tr.json";

// Initialize font
const inter = Inter({ subsets: ["latin"] });

// Define metadata
export const metadata: Metadata = {
  title: "vamos",
  description: "Video Management and SEO Platform",
};

export default function RootLayout({
  children,
  params: { locale = "tr" },
}: {
  children: React.ReactNode;
  params: { locale?: string };
}) {
  const messages = locale === "tr" ? trMessages : enMessages;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(inter.className, "antialiased")}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <Providers>{children}</Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}

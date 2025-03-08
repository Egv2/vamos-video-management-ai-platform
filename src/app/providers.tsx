"use client";

import { Toaster } from "sonner";
import { LanguageProvider } from "@/context/language-context";
import { ThemeProvider } from "@/context/theme-context";

export function Providers({ children }: { children: React.ReactNode }) {
  console.log("Rendering Providers");
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
        <Toaster position="top-right" />
      </LanguageProvider>
    </ThemeProvider>
  );
}

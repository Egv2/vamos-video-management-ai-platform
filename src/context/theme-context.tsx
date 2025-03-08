"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Theme = "system" | "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  console.log("Initializing ThemeProvider");
  const [theme, setTheme] = useState<Theme>("system");

  // Initialize theme from localStorage if available
  useEffect(() => {
    console.log("Checking for saved theme preference");
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      console.log("Found saved theme:", savedTheme);
      setTheme(savedTheme);
    }
  }, []);

  // Update localStorage and apply theme
  useEffect(() => {
    console.log("Applying theme:", theme);
    localStorage.setItem("theme", theme);
    const root = window.document.documentElement;

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

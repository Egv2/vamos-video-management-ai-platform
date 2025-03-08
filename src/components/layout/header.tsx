"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslations } from "@/hooks/use-translations";

export default function Header() {
  console.log("Rendering Header component");
  const { t } = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    console.log("Toggle menu clicked, current state:", isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          vamos
        </Link>

        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="hover:text-primary transition-colors">
            {t("home.nav.home")}
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-primary transition-colors"
          >
            {t("home.nav.dashboard")}
          </Link>
        </nav>

        <div className="hidden md:flex space-x-2 items-center">
          <LanguageSwitcher />
          <Button variant="outline" asChild>
            <Link href="/login">{t("home.hero.login")}</Link>
          </Button>
          <Button asChild>
            <Link href="/register">{t("home.hero.cta")}</Link>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden container mx-auto px-4 py-4 bg-white">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center space-x-2 mt-4">
            <LanguageSwitcher />
            <Button variant="outline" asChild className="flex-1">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

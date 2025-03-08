"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "@/hooks/use-translations";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function HomePage() {
  console.log("Rendering HomePage");
  const { t } = useTranslations();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            vamos
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button variant="outline" asChild>
              <Link href="/login">{t("home.hero.login")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("home.hero.title")}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {t("home.hero.subtitle")}
          </p>
          <Button size="lg" asChild>
            <Link href="/register">{t("home.hero.cta")}</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("home.features.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title={t("home.features.videoProcessing.title")}
              description={t("home.features.videoProcessing.description")}
            />
            <FeatureCard
              title={t("home.features.seoOptimization.title")}
              description={t("home.features.seoOptimization.description")}
            />
            <FeatureCard
              title={t("home.features.subtitleManagement.title")}
              description={t("home.features.subtitleManagement.description")}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          {t("home.footer.copyright")}
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg bg-card border">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

"use client";

import Header from "./header";
import Footer from "./footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Rendering SiteLayout"); // Console log for debugging

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}

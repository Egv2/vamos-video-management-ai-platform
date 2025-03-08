"use client";

import { SessionNavBar } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Rendering DashboardLayout"); // Console log for debugging

  return (
    <div className="flex h-screen w-full flex-row">
      <SessionNavBar />
      <main className="flex h-screen grow flex-col overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}

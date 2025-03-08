import type { LucideIcon } from "lucide-react";
import { LayoutDashboard } from "lucide-react";

export const navigationItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    labelKey: "sidebar.dashboard",
  },
  // ... diğer navigation items
] as const;

export type NavigationItem = {
  href: string;
  icon: LucideIcon;
  labelKey: string;
};

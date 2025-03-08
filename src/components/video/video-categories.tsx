"use client";

import { useState } from "react";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { BookOpen, Film, Briefcase, Cpu, MoreHorizontal } from "lucide-react";

interface Category {
  id: string;
  name: string;
  value: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Örnek kategori verileri
const categoryData: Category[] = [
  { id: "1", name: "education", value: 35, color: "#0ea5e9", icon: BookOpen },
  { id: "2", name: "entertainment", value: 25, color: "#f43f5e", icon: Film },
  { id: "3", name: "business", value: 20, color: "#8b5cf6", icon: Briefcase },
  { id: "4", name: "technology", value: 15, color: "#10b981", icon: Cpu },
  { id: "5", name: "other", value: 5, color: "#6b7280", icon: MoreHorizontal },
];

export function VideoCategories() {
  console.log("Rendering VideoCategories component");
  const { t } = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSaveCategories = async (categories: string[]) => {
    console.log("Saving categories:", categories);
    try {
      // TODO: Implement actual save functionality
      return categories;
    } catch (error) {
      console.error("Error saving categories:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      console.log("Saving categories...");
      await handleSaveCategories(categoryData.map((c) => c.name));
      setIsEditing(false);
      toast.success(t("videos.categories.saveSuccess"));
    } catch (error) {
      console.error("Error saving categories:", error);
      toast.error(t("videos.categories.saveError"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("videos.categories.title")}</CardTitle>
        <CardDescription>{t("videos.categories.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, ""]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            {t("videos.categories.all")}
          </Button>

          {categoryData.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.name}
                variant={
                  selectedCategory === category.name ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
                className="flex items-center gap-1"
              >
                <Icon className="h-4 w-4" />
                <span>{t(`videos.categories.${category.name}`)}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

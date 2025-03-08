"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

// Progress bileşeni için tip tanımlaması
export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  indicatorColor?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "gradient";
  showAnimation?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      indicatorColor,
      showValue = false,
      size = "md",
      variant = "default",
      showAnimation = true,
      ...props
    },
    ref
  ) => {
    // Size değerine göre yükseklik belirleme
    const heightClass = React.useMemo(() => {
      switch (size) {
        case "sm":
          return "h-1.5";
        case "lg":
          return "h-4";
        default:
          return "h-2.5"; // md
      }
    }, [size]);

    // Varyant stillerini belirleme
    const getVariantStyles = () => {
      switch (variant) {
        case "success":
          return "bg-emerald-500";
        case "gradient":
          return "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500";
        default:
          return indicatorColor || "bg-primary";
      }
    };

    return (
      <div className={cn("w-full flex items-center gap-3", className)}>
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(
            "relative w-full overflow-hidden rounded-full",
            "bg-primary/10 dark:bg-primary/20",
            heightClass
          )}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              "h-full w-full flex-1",
              showAnimation && "transition-transform duration-500 ease-in-out",
              getVariantStyles(),
              size === "lg" && "rounded-full"
            )}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
          >
            {/* Animasyonlu parıltı efekti */}
            {showAnimation && (
              <div
                className={cn(
                  "absolute inset-0 opacity-50",
                  "animate-shimmer",
                  "bg-gradient-to-r from-transparent via-white/20 to-transparent"
                )}
                style={{
                  backgroundSize: "200% 100%",
                }}
              />
            )}
          </ProgressPrimitive.Indicator>
        </ProgressPrimitive.Root>

        {showValue && (
          <div
            className={cn(
              "min-w-[40px] text-sm font-medium",
              "text-muted-foreground tabular-nums"
            )}
          >
            {Math.round(value)}%
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

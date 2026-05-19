"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  showLabel?: boolean;
};

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("rounded-full gap-2", className)}
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
      {showLabel ? (
        <span className="text-sm font-medium">{isDark ? "Mode clair" : "Mode sombre"}</span>
      ) : (
        <span className="sr-only">{isDark ? "Mode clair" : "Mode sombre"}</span>
      )}
    </Button>
  );
}

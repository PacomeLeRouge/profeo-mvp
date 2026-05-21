import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatAccent = "lime" | "violet";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: StatAccent;
  /** Chiffres / alertes à mettre en avant (accent violet). */
  emphasis?: boolean;
  variant?: "default" | "solid";
};

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = "lime",
  emphasis = false,
  variant = "default",
}: StatCardProps) {
  const isViolet = accent === "violet";

  if (variant === "solid") {
    return (
      <div
        data-dashboard-stat
        className={cn(
          "inline-flex min-w-0 max-w-full items-center gap-2.5 rounded-full px-4 py-2.5",
          isViolet
            ? emphasis
              ? "bg-highlight text-highlight-foreground"
              : "bg-muted text-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        <span className="text-base font-bold tabular-nums tracking-tight">{value}</span>
        <span className="truncate text-xs font-medium opacity-90">{label}</span>
      </div>
    );
  }

  return (
    <div
      data-dashboard-stat
      className={cn(
        "rounded-2xl border bg-card/80 px-5 py-4 shadow-sm backdrop-blur-md",
        emphasis ? "border-highlight/30" : "border-border"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            isViolet
              ? "bg-highlight/15 text-highlight"
              : "bg-primary text-primary-foreground"
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </div>
        <div>
          <p
            className={cn(
              "text-2xl font-semibold tracking-tight",
              emphasis ? "text-highlight" : "text-foreground"
            )}
          >
            {value}
          </p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

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
};

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = "lime",
  emphasis = false,
}: StatCardProps) {
  const isViolet = accent === "violet";

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
            "flex h-10 w-10 items-center justify-center rounded-xl",
            isViolet ? "bg-highlight/15" : "bg-primary/12"
          )}
        >
          <Icon
            className={cn("h-4 w-4", isViolet ? "text-highlight" : "text-primary")}
            aria-hidden
          />
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

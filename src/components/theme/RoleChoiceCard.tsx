import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type RoleChoiceCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  icon: LucideIcon;
  onSelect: () => void;
  className?: string;
};

export function RoleChoiceCard({
  eyebrow,
  title,
  description,
  ctaLabel,
  icon: Icon,
  onSelect,
  className,
}: RoleChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex min-h-[240px] w-full flex-col rounded-[2rem] border-2 border-border bg-card p-5 text-left shadow-[0_20px_60px_-36px_rgba(26,26,26,0.22)] transition-all sm:min-h-[280px] sm:p-6",
        "hover:border-primary hover:shadow-[0_28px_80px_-32px_rgba(204,255,0,0.28)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        "md:min-h-[320px] md:p-8",
        className
      )}
    >
      <div className="glow-lime mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground md:mb-8 md:h-16 md:w-16">
        <Icon className="h-6 w-6 md:h-7 md:w-7" aria-hidden />
      </div>
      <div className="space-y-3">
        <p className="text-eyebrow text-text-accent">{eyebrow}</p>
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-[2.1rem]">
          {title}
        </h2>
        <p className="max-w-md text-base leading-7 text-foreground/75 md:text-lg md:leading-8">
          {description}
        </p>
      </div>
      <div className="mt-auto pt-8 md:pt-10">
        <span className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform group-hover:translate-x-1">
          {ctaLabel}
        </span>
      </div>
    </button>
  );
}

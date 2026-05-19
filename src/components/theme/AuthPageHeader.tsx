"use client";

import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

type AuthPageHeaderProps = {
  className?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
};

/** Top bar for sign-in / sign-up panels with theme toggle. */
export function AuthPageHeader({ className, leading, trailing }: AuthPageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="min-w-0">{leading}</div>
      <div className="ml-auto flex shrink-0 items-center gap-3">
        <ThemeToggle />
        {trailing}
      </div>
    </div>
  );
}

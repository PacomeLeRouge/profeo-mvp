"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthPageHeaderProps = {
  className?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
};

/** Barre d'en-tête des pages auth (sans toggle — thème dark imposé sur l'accueil). */
export function AuthPageHeader({ className, leading, trailing }: AuthPageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="min-w-0">{leading}</div>
      {trailing ? <div className="ml-auto flex shrink-0 items-center gap-3">{trailing}</div> : null}
    </div>
  );
}

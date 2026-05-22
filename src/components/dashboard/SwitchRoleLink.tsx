"use client";

import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import { getOtherRole, roleMeta, type AppRole } from "@/lib/role-ui";
import { cn } from "@/lib/utils";

type SwitchRoleLinkProps = {
  currentRole: AppRole;
  className?: string;
  variant?: "button" | "text" | "icon" | "navbar";
};

export function SwitchRoleLink({
  currentRole,
  className,
  variant = "button",
}: SwitchRoleLinkProps) {
  const otherRole = getOtherRole(currentRole);
  const otherMeta = roleMeta[otherRole];
  const switchLabel = `Passer en ${otherMeta.label.toLowerCase()}`;

  if (variant === "icon") {
    return (
      <Link
        href="/role-selection?switch=1"
        aria-label={switchLabel}
        title={switchLabel}
        className={cn(
          "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-muted",
          className
        )}
      >
        <ArrowLeftRight className="size-4 shrink-0" aria-hidden />
      </Link>
    );
  }

  if (variant === "navbar") {
    return (
      <Link
        href="/role-selection?switch=1"
        aria-label={switchLabel}
        title={switchLabel}
        className={cn(
          "inline-flex h-9 max-w-[11rem] shrink-0 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-muted sm:max-w-none sm:px-4",
          className
        )}
      >
        <ArrowLeftRight className="size-4 shrink-0" aria-hidden />
        <span className="truncate">{switchLabel}</span>
      </Link>
    );
  }

  if (variant === "text") {
    return (
      <Link
        href="/role-selection?switch=1"
        className={cn(
          "inline-flex items-center gap-1.5 text-sm font-medium text-text-accent underline-offset-4 hover:underline",
          className
        )}
      >
        <ArrowLeftRight className="size-3.5 shrink-0" aria-hidden />
        Passer en {otherMeta.label.toLowerCase()}
      </Link>
    );
  }

  return (
    <Link
      href="/role-selection?switch=1"
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-muted sm:min-h-9",
        className
      )}
    >
      <ArrowLeftRight className="size-4 shrink-0" aria-hidden />
      {switchLabel}
    </Link>
  );
}

"use client";

import type { ReactNode } from "react";
import { DashboardFloatingDecor } from "@/components/dashboard/DashboardFloatingDecor";
import type { DashboardDecorItem } from "@/lib/dashboard-decor";
import { studentDashboardDecor } from "@/lib/dashboard-decor";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: ReactNode;
  className?: string;
  decor?: DashboardDecorItem[];
};

export function DashboardShell({
  children,
  className,
  decor = studentDashboardDecor,
}: DashboardShellProps) {
  return (
    <div className={cn("relative min-h-screen overflow-hidden bg-background text-foreground", className)}>
      <DashboardFloatingDecor items={decor} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

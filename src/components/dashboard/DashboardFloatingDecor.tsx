"use client";

import { useEffect } from "react";
import { OnboardingSymbol } from "@/components/onboarding/OnboardingSymbol";
import { prefetchOnboardingSymbols } from "@/lib/onboarding-symbols";
import type { DashboardDecorItem } from "@/lib/dashboard-decor";

type DashboardFloatingDecorProps = {
  items: DashboardDecorItem[];
};

export function DashboardFloatingDecor({ items }: DashboardFloatingDecorProps) {
  useEffect(() => {
    prefetchOnboardingSymbols(items.map((item) => item.src));
  }, [items]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="opacity-[0.52] saturate-[1.05] dark:opacity-[0.24] dark:saturate-100">
        {items.map((item, index) => (
          <OnboardingSymbol
            key={item.id}
            src={item.src}
            alt={item.alt}
            stepKey={index + 1}
            placement={item.placement}
            size={item.size ?? 220}
            targetOpacity={0.58}
            priority={index < 2}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { cn } from "@/lib/utils";

type OnboardingStepPanelProps = {
  stepKey: string | number;
  direction?: 1 | -1;
  children: React.ReactNode;
  className?: string;
};

export function OnboardingStepPanel({
  stepKey,
  direction = 1,
  children,
  className,
}: OnboardingStepPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(panelRef.current, {
        opacity: 0,
        x: direction * 48,
        filter: "blur(4px)",
        duration: 0.55,
        ease: onboardingEase.enter,
      });
    },
    { scope: panelRef, dependencies: [stepKey, direction], revertOnUpdate: true }
  );

  return (
    <div
      ref={panelRef}
      key={stepKey}
      className={cn("w-full max-w-6xl space-y-10", className)}
    >
      {children}
    </div>
  );
}

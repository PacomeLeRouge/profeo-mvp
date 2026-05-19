"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { cn } from "@/lib/utils";

type OnboardingProgressProps = {
  step: number;
  totalSteps: number;
  stepLabel?: string;
  compact?: boolean;
  className?: string;
};

export function OnboardingProgress({
  step,
  totalSteps,
  stepLabel,
  compact = false,
  className,
}: OnboardingProgressProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef(step);

  useGSAP(
    () => {
      const segments = containerRef.current?.querySelectorAll("[data-progress-segment]");
      if (!segments?.length) return;

      const prevStep = prevStepRef.current;
      prevStepRef.current = step;

      segments.forEach((segment, index) => {
        const stepNumber = index + 1;
        const justCompleted = stepNumber === step && step > prevStep;
        const justUncompleted = stepNumber === prevStep && step < prevStep;

        if (!prefersReducedMotion() && (justCompleted || justUncompleted)) {
          gsap.fromTo(
            segment,
            { scaleY: justCompleted ? 0.6 : 1.2 },
            { scaleY: 1, duration: 0.4, ease: onboardingEase.bounce }
          );
        }
      });
    },
    { scope: containerRef, dependencies: [step] }
  );

  return (
    <div
      ref={containerRef}
      className={cn("flex flex-col items-center", compact ? "gap-2" : "gap-5", className)}
    >
      {stepLabel ? (
        <p
          className={cn(
            "text-muted-foreground",
            compact ? "text-xs font-medium tracking-wide" : "text-sm"
          )}
        >
          {stepLabel}
        </p>
      ) : null}
      <div className={cn("flex flex-wrap items-center justify-center", compact ? "gap-1.5" : "gap-3")}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const isComplete = index + 1 <= step;
          return (
            <div
              key={`progress-${index + 1}`}
              data-progress-segment
              className={cn(
                "origin-center rounded-full transition-colors duration-300",
                compact ? "h-1 w-7 sm:w-8" : "h-3 w-16 md:w-20",
                isComplete ? "bg-primary" : "bg-muted"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

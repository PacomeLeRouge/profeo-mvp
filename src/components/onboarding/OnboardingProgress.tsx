"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { cn } from "@/lib/utils";

type OnboardingProgressProps = {
  step: number;
  totalSteps: number;
  stepLabel?: string;
  className?: string;
};

export function OnboardingProgress({ step, totalSteps, stepLabel, className }: OnboardingProgressProps) {
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
        const isComplete = stepNumber <= step;
        const justCompleted = stepNumber === step && step > prevStep;
        const justUncompleted = stepNumber === prevStep && step < prevStep;

        gsap.to(segment, {
          backgroundColor: isComplete ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.15)",
          duration: prefersReducedMotion() ? 0 : 0.35,
          ease: onboardingEase.enter,
        });

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
    <div ref={containerRef} className={cn("flex flex-col gap-5", className)}>
      {stepLabel ? (
        <div className="w-full max-w-xl self-center text-sm text-muted-foreground">
          <span>{stepLabel}</span>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={`progress-${index + 1}`}
            data-progress-segment
            className="h-3 w-16 origin-center rounded-full bg-primary/15 md:w-20"
            style={{
              backgroundColor: index + 1 <= step ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

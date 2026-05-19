"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { cn } from "@/lib/utils";

type AnimatedTitleProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  stepKey: string | number;
  className?: string;
};

export function AnimatedTitle({ eyebrow, title, subtitle, stepKey, className }: AnimatedTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline();

      tl.from("[data-onboarding-eyebrow]", {
        opacity: 0,
        y: 12,
        duration: 0.4,
        ease: onboardingEase.enter,
      })
        .from(
          "[data-onboarding-word]",
          {
            opacity: 0,
            y: 28,
            rotateX: -12,
            duration: 0.55,
            stagger: 0.06,
            ease: onboardingEase.enter,
          },
          "-=0.15"
        )
        .from(
          "[data-onboarding-subtitle]",
          {
            opacity: 0,
            y: 16,
            duration: 0.4,
            ease: onboardingEase.enter,
          },
          "-=0.2"
        );
    },
    { scope: containerRef, dependencies: [stepKey], revertOnUpdate: true }
  );

  const words = title.split(" ");

  return (
    <div ref={containerRef} className={cn("space-y-4", className)}>
      <p
        data-onboarding-eyebrow
        className="text-sm uppercase tracking-[0.25em] text-muted-foreground"
      >
        {eyebrow}
      </p>
      <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-[4.5rem]">
        {words.map((word, index) => (
          <span key={`${stepKey}-${index}`} className="inline-block overflow-hidden pb-1">
            <span data-onboarding-word className="inline-block">
              {word}
              {index < words.length - 1 ? "\u00A0" : ""}
            </span>
          </span>
        ))}
      </h1>
      {subtitle ? (
        <p data-onboarding-subtitle className="text-lg text-muted-foreground md:text-xl">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

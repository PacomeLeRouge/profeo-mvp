"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { Button } from "@/components/ui/button";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { cn } from "@/lib/utils";

type OnboardingShellProps = {
  brandHref: string;
  headerLabel: string;
  step: number;
  totalSteps: number;
  canContinue: boolean;
  isLastStep: boolean;
  isEditing?: boolean;
  submitLabel?: string;
  continueLabel?: string;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
  className?: string;
};

export function OnboardingShell({
  brandHref,
  headerLabel,
  step,
  totalSteps,
  canContinue,
  isLastStep,
  isEditing = false,
  submitLabel,
  continueLabel = "Continuer",
  onBack,
  onNext,
  onSubmit,
  children,
  className,
}: OnboardingShellProps) {
  const router = useRouter();
  const shellRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from("[data-onboarding-header]", {
        opacity: 0,
        y: -12,
        duration: 0.5,
        ease: onboardingEase.enter,
      });
    },
    { scope: shellRef }
  );

  useGSAP(
    () => {
      if (!continueRef.current || prefersReducedMotion()) return;

      gsap.to(continueRef.current, {
        scale: canContinue ? 1 : 0.97,
        opacity: canContinue ? 1 : 0.45,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    { scope: shellRef, dependencies: [canContinue] }
  );

  const finalSubmitLabel = submitLabel ?? (isEditing ? "Enregistrer" : "Terminer");

  return (
    <div ref={shellRef} className={cn("flex min-h-screen flex-col bg-background text-foreground", className)}>
      <div
        data-onboarding-header
        className="flex items-center justify-between px-8 py-6 md:px-12"
      >
        <button
          type="button"
          onClick={() => router.push(brandHref)}
          className="font-display text-2xl font-bold tracking-tight transition-opacity hover:opacity-70"
        >
          clutch
        </button>
        <span className="text-sm font-medium text-muted-foreground">{headerLabel}</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center md:px-12">
        {children}
      </div>

      <div className="px-6 pb-12 pt-4 md:px-12 md:pb-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 border-t border-border pt-6">
          <OnboardingProgress
            step={step}
            totalSteps={totalSteps}
            stepLabel={`Étape ${step} sur ${totalSteps}`}
          />
          <div className="flex w-full max-w-xl items-center justify-between self-center pt-2">
            <Button variant="ghost" onClick={onBack} className="px-0 text-base">
              Retour
            </Button>
            <div ref={continueRef}>
              {isLastStep ? (
                <Button
                  onClick={onSubmit}
                  disabled={!canContinue}
                  className="h-12 rounded-full px-8 text-base transition-none"
                >
                  {finalSubmitLabel}
                </Button>
              ) : (
                <Button
                  onClick={onNext}
                  disabled={!canContinue}
                  className="h-12 rounded-full px-8 text-base transition-none"
                >
                  {continueLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

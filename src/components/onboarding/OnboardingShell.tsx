"use client";

import { useMemo, useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { Button } from "@/components/ui/button";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { OnboardingSymbol } from "@/components/onboarding/OnboardingSymbol";
import { getSymbolPlacement } from "@/lib/onboarding-symbols";
import { cn } from "@/lib/utils";

type OnboardingShellProps = {
  step: number;
  totalSteps: number;
  stepLabel?: string;
  symbolSrc?: string;
  symbolAlt?: string;
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
  step,
  totalSteps,
  stepLabel,
  symbolSrc,
  symbolAlt = "",
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
  const shellRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLDivElement>(null);
  const symbolPlacement = useMemo(() => getSymbolPlacement(step), [step]);

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
  const progressLabel = stepLabel ?? `Étape ${step} sur ${totalSteps}`;

  return (
    <div
      ref={shellRef}
      className={cn("flex min-h-0 flex-1 flex-col", className)}
    >
      <div className="relative flex min-h-[min(72vh,720px)] flex-1 flex-col overflow-hidden">
        {symbolSrc ? (
          <OnboardingSymbol
            src={symbolSrc}
            alt={symbolAlt}
            stepKey={step}
            placement={symbolPlacement}
            size={320}
          />
        ) : null}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-8 text-center md:px-12 md:pt-10">
          {children}
        </div>
      </div>

      <div className="px-6 pb-12 md:px-12 md:pb-14">
        <div className="mx-auto flex max-w-xl flex-col gap-4">
          <OnboardingProgress
            compact
            step={step}
            totalSteps={totalSteps}
            stepLabel={progressLabel}
          />
          <div className="flex items-center justify-between">
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

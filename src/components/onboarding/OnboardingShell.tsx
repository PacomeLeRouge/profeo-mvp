"use client";

import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { OnboardingSymbol } from "@/components/onboarding/OnboardingSymbol";
import { getSymbolPlacement } from "@/lib/onboarding-symbols";
import { ContactEmailConsent } from "@/components/onboarding/ContactEmailConsent";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

type OnboardingShellProps = {
  step: number;
  totalSteps: number;
  stepLabel?: string;
  symbolSrc?: string;
  symbolAlt?: string;
  canContinue: boolean;
  isSubmitting?: boolean;
  submitError?: string | null;
  isLastStep: boolean;
  isEditing?: boolean;
  requireEmailConsent?: boolean;
  emailConsentVariant?: "student" | "tutor";
  emailConsentAccepted?: boolean;
  onEmailConsentChange?: (accepted: boolean) => void;
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
  isSubmitting = false,
  submitError = null,
  isLastStep,
  isEditing = false,
  requireEmailConsent = false,
  emailConsentVariant = "student",
  emailConsentAccepted = false,
  onEmailConsentChange,
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

  const finalSubmitLabel = submitLabel ?? (isEditing ? "Enregistrer" : "Terminer");
  const actionDisabled = !canContinue || isSubmitting;
  const progressLabel = stepLabel ?? `Étape ${step} sur ${totalSteps}`;

  return (
    <div
      ref={shellRef}
      className={cn("flex min-h-0 flex-1 flex-col", className)}
    >
      <div className="relative flex min-h-[min(72vh,720px)] flex-1 flex-col overflow-hidden">
        {isEditing ? (
          <div className="absolute right-6 top-6 z-20 md:right-12 md:top-8">
            <ThemeToggle />
          </div>
        ) : null}
        {symbolSrc ? (
          <OnboardingSymbol
            src={symbolSrc}
            alt={symbolAlt}
            stepKey={step}
            placement={symbolPlacement}
            size={320}
            priority
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
          {submitError ? (
            <p
              role="alert"
              className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive"
            >
              {submitError}
            </p>
          ) : null}
          {isLastStep && requireEmailConsent && onEmailConsentChange ? (
            <ContactEmailConsent
              variant={emailConsentVariant}
              checked={emailConsentAccepted}
              onCheckedChange={onEmailConsentChange}
            />
          ) : null}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="px-0 text-base">
              Retour
            </Button>
            <div ref={continueRef}>
              {isLastStep ? (
                <Button
                  onClick={onSubmit}
                  disabled={actionDisabled}
                  className="h-12 rounded-full px-8 text-base transition-none"
                >
                  {isSubmitting ? "Enregistrement…" : finalSubmitLabel}
                </Button>
              ) : (
                <Button
                  onClick={onNext}
                  disabled={actionDisabled}
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

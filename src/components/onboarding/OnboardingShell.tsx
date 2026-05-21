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
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto lg:min-h-[min(60vh,720px)]">
        {isEditing ? (
          <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6 md:right-12 md:top-8">
            <ThemeToggle />
          </div>
        ) : null}
        {symbolSrc ? (
          <OnboardingSymbol
            src={symbolSrc}
            alt={symbolAlt}
            stepKey={step}
            placement={symbolPlacement}
            size={280}
            priority
          />
        ) : null}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-start px-4 pb-4 pt-6 text-center sm:px-6 sm:justify-center sm:pb-8 sm:pt-8 md:px-12 md:pb-10 md:pt-10">
          {children}
        </div>
      </div>

      <div className="shrink-0 px-4 pb-safe pt-2 sm:px-6 md:px-12 md:pb-14">
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
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" onClick={onBack} className="h-11 px-0 text-base sm:h-12">
              Retour
            </Button>
            <div ref={continueRef} className="w-full sm:w-auto">
              {isLastStep ? (
                <Button
                  onClick={onSubmit}
                  disabled={actionDisabled}
                  className="h-11 w-full rounded-full px-6 text-base transition-none sm:h-12 sm:w-auto sm:px-8"
                >
                  {isSubmitting ? "Enregistrement…" : finalSubmitLabel}
                </Button>
              ) : (
                <Button
                  onClick={onNext}
                  disabled={actionDisabled}
                  className="h-11 w-full rounded-full px-6 text-base transition-none sm:h-12 sm:w-auto sm:px-8"
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

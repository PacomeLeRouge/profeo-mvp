"use client";

import { onboardingThemeClass } from "@/lib/onboarding-theme";
import { cn } from "@/lib/utils";

type OnboardingPageGateProps = {
  isLoading: boolean;
  error: string | null;
  ready: boolean;
  children: React.ReactNode;
};

export function OnboardingPageGate({
  isLoading,
  error,
  ready,
  children,
}: OnboardingPageGateProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex min-h-screen items-center justify-center",
          onboardingThemeClass
        )}
      >
        <p className="text-muted-foreground">Chargement de votre session…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center",
          onboardingThemeClass
        )}
      >
        <p className="max-w-md text-destructive" role="alert">
          {error}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!ready) return null;

  return <>{children}</>;
}

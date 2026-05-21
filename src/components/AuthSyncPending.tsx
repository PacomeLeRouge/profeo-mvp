"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onboardingThemeClass } from "@/lib/onboarding-theme";
import { cn } from "@/lib/utils";

type AuthSyncPendingProps = {
  className?: string;
};

/** Attend la synchro Clerk → Neon puis relance /auth/continue. */
export function AuthSyncPending({ className }: AuthSyncPendingProps) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAttempt((n) => n + 1);
      router.refresh();
      router.replace("/auth/continue");
    }, 800);

    return () => window.clearTimeout(timer);
  }, [attempt, router]);

  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center",
        onboardingThemeClass,
        className
      )}
    >
      <p className="text-muted-foreground">Finalisation de votre compte…</p>
      {attempt >= 3 ? (
        <button
          type="button"
          onClick={() => window.location.assign("/auth/continue")}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Continuer
        </button>
      ) : null}
    </div>
  );
}

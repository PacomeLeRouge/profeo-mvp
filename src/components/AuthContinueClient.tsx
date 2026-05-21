"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { completeAuthContinueAction } from "@/app/actions/user";
import { onboardingThemeClass } from "@/lib/onboarding-theme";
import { cn } from "@/lib/utils";

const MAX_ATTEMPTS = 12;
const BASE_RETRY_MS = 600;

function retryDelay(attempt: number) {
  return Math.min(BASE_RETRY_MS * 1.5 ** (attempt - 1), 4000);
}

/** Attend la session Clerk côté client, sync Neon, puis redirige. */
export function AuthContinueClient() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const startedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/");
      return;
    }

    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;
    let attempt = 0;

    async function syncAndRedirect() {
      try {
        const path = await completeAuthContinueAction();
        if (!cancelled) {
          window.location.assign(path);
        }
      } catch (err) {
        attempt += 1;
        if (attempt < MAX_ATTEMPTS && !cancelled) {
          window.setTimeout(syncAndRedirect, retryDelay(attempt));
          return;
        }
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Impossible de finaliser la connexion."
          );
        }
      }
    }

    void syncAndRedirect();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, router]);

  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center",
        onboardingThemeClass
      )}
    >
      {error ? (
        <>
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
        </>
      ) : (
        <p className="text-muted-foreground">Préparation de votre espace…</p>
      )}
    </div>
  );
}

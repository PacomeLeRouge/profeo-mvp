"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { setUserRole, switchUserRoleAction } from "@/app/actions/user";
import { useAppData } from "@/hooks/use-app-data";
import { RoleChoiceCard } from "@/components/theme/RoleChoiceCard";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { roleMeta, type AppRole } from "@/lib/role-ui";
import { onboardingThemeClass } from "@/lib/onboarding-theme";
import { GraduationCap, BookOpen, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

function RoleSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded: clerkLoaded, isSignedIn } = useUser();
  const { user, isLoading, error, refresh } = useAppData();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectError, setSelectError] = useState<string | null>(null);
  const source = searchParams.get("source");
  const isSwitchMode = searchParams.get("switch") === "1";
  const isSignupFlow = source === "signup" && !isSwitchMode;
  const currentRole = user?.role as AppRole | undefined;
  const backHref = isSwitchMode && currentRole
    ? `/dashboard/${currentRole}`
    : isSignupFlow
      ? "/sign-up"
      : "/";

  useEffect(() => {
    if (!clerkLoaded || isLoading) return;

    if (!isSignedIn) {
      router.push("/");
      return;
    }

    if (user?.role && !isSwitchMode) {
      router.push("/auth/continue");
    }
  }, [clerkLoaded, isSignedIn, user, isLoading, router, isSwitchMode]);

  const handleSelectRole = async (role: AppRole) => {
    setSelectError(null);
    setIsSelecting(true);
    try {
      if (isSwitchMode) {
        const path = await switchUserRoleAction(role);
        router.push(path);
        return;
      }

      await setUserRole(role);
      const query = source ? `?source=${source}` : "";
      router.push(`/onboarding/${role}${query}`);
    } catch (err) {
      console.error("[role-selection] setUserRole failed:", err);
      setSelectError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer votre choix. Réessayez."
      );
    } finally {
      setIsSelecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={cn("flex min-h-dvh items-center justify-center", onboardingThemeClass)}>
        <p className="text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn("flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center", onboardingThemeClass)}>
        <p className="text-muted-foreground">Chargement de votre profil…</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex min-h-dvh flex-col", onboardingThemeClass)}>
      <header className="flex items-center justify-between px-4 py-5 sm:px-6 sm:py-6 md:px-12">
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="font-display text-2xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-70"
        >
          clutch
        </button>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 flex-col px-4 pb-10 pt-2 sm:px-6 md:px-12 md:pb-12 md:pt-4">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center">
          <div className="w-full space-y-8 md:space-y-12">
            <div className="mx-auto max-w-3xl space-y-5 text-center md:text-left">
              <div className="flex flex-col items-center gap-3 md:items-start">
                {isSwitchMode && currentRole ? <RoleBadge role={currentRole} /> : null}
                <p className="text-eyebrow text-text-accent">
                  {isSwitchMode
                    ? "Changer de parcours"
                    : isSignupFlow
                      ? "Création de compte"
                      : "Choix du profil"}
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center md:justify-start md:gap-4">
                <button
                  type="button"
                  onClick={() => router.push(backHref)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:mt-1 md:mt-2"
                  aria-label="Retour"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="font-display text-2xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-3xl md:text-5xl xl:text-[4.25rem]">
                    {isSwitchMode
                      ? "Envie de changer de casquette ?"
                      : "Comment allez-vous utiliser Clutch ?"}
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-foreground/75 sm:text-lg md:text-xl md:leading-8">
                    {isSwitchMode
                      ? "Vous pouvez passer de l'un à l'autre à tout moment. Clutch adaptera votre espace et vos prochaines étapes."
                      : "Choisissez le parcours qui correspond à votre besoin. Clutch adaptera ensuite les prochaines questions pour aller à l'essentiel."}
                  </p>
                </div>
              </div>
            </div>

            {error || selectError ? (
              <p
                role="alert"
                className="mx-auto max-w-2xl rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive"
              >
                {selectError ?? error}
              </p>
            ) : null}

            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              <RoleChoiceCard
                eyebrow={roleMeta.student.dashboardEyebrow}
                title="Trouver un tuteur"
                description={roleMeta.student.switchDescription}
                ctaLabel={
                  isSwitchMode
                    ? currentRole === "student"
                      ? "Continuer en étudiant"
                      : "Passer en étudiant"
                    : "Choisir le parcours étudiant"
                }
                icon={BookOpen}
                isCurrent={isSwitchMode && currentRole === "student"}
                onSelect={() => !isSelecting && handleSelectRole("student")}
              />
              <RoleChoiceCard
                eyebrow={roleMeta.tutor.dashboardEyebrow}
                title="Proposer mes cours"
                description={roleMeta.tutor.switchDescription}
                ctaLabel={
                  isSwitchMode
                    ? currentRole === "tutor"
                      ? "Continuer en tuteur"
                      : "Passer en tuteur"
                    : "Choisir le parcours tuteur"
                }
                icon={GraduationCap}
                isCurrent={isSwitchMode && currentRole === "tutor"}
                onSelect={() => !isSelecting && handleSelectRole("tutor")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoleSelection() {
  return (
    <Suspense fallback={null}>
      <RoleSelectionContent />
    </Suspense>
  );
}

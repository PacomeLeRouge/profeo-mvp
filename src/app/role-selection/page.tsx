"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setUserRole } from "@/app/actions/user";
import { useAppData } from "@/hooks/use-app-data";
import { RoleChoiceCard } from "@/components/theme/RoleChoiceCard";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { onboardingThemeClass } from "@/lib/onboarding-theme";
import { GraduationCap, BookOpen, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

function RoleSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, error } = useAppData();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectError, setSelectError] = useState<string | null>(null);
  const source = searchParams.get("source");
  const isSignupFlow = source === "signup";
  const backHref = isSignupFlow ? "/sign-up" : "/";

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
    if (!isLoading && user?.role) {
      router.push("/auth/continue");
    }
  }, [user, isLoading, router]);

  const handleSelectRole = async (role: "student" | "tutor") => {
    setSelectError(null);
    setIsSelecting(true);
    try {
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
      <div className={cn("flex min-h-screen items-center justify-center", onboardingThemeClass)}>
        <p className="text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={cn("flex min-h-screen flex-col", onboardingThemeClass)}>
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="font-display text-2xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-70"
        >
          clutch
        </button>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 flex-col px-6 pb-10 pt-2 md:px-12 md:pb-12 md:pt-4">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center">
          <div className="w-full space-y-10 md:space-y-12">
            <div className="mx-auto max-w-3xl space-y-5 text-center md:text-left">
              <p className="text-eyebrow text-text-accent">
                {isSignupFlow ? "Création de compte" : "Choix du profil"}
              </p>
              <div className="flex items-start justify-center gap-3 md:justify-start md:gap-4">
                <button
                  type="button"
                  onClick={() => router.push(backHref)}
                  className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:mt-2"
                  aria-label="Retour"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="space-y-4">
                  <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl xl:text-[4.25rem]">
                    Comment allez-vous utiliser Clutch ?
                  </h1>
                  <p className="max-w-2xl text-lg leading-7 text-foreground/75 md:text-xl md:leading-8">
                    Choisissez le parcours qui correspond à votre besoin. Clutch adaptera ensuite les
                    prochaines questions pour aller à l&apos;essentiel.
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
                eyebrow="Parcours étudiant"
                title="Trouver un tuteur"
                description="Pour progresser dans une matière, préparer un examen ou obtenir un accompagnement ciblé."
                ctaLabel="Choisir le parcours étudiant"
                icon={BookOpen}
                onSelect={() => !isSelecting && handleSelectRole("student")}
              />
              <RoleChoiceCard
                eyebrow="Parcours tuteur"
                title="Proposer mes cours"
                description="Pour créer un profil crédible, présenter votre approche et commencer à accompagner d'autres étudiants."
                ctaLabel="Choisir le parcours tuteur"
                icon={GraduationCap}
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

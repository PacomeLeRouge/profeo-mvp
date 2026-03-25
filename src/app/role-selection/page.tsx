"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { GraduationCap, BookOpen, ArrowLeft } from "lucide-react";

function RoleSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setRole } = useStore();
  const source = searchParams.get("source");
  const isSignupFlow = source === "signup";
  const backHref = isSignupFlow ? "/signup/name" : "/";

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSelectRole = (role: "student" | "tutor") => {
    setRole(role);
    const query = source ? `?source=${source}` : "";
    router.push(`/onboarding/${role}${query}`);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <div className="flex items-center justify-between px-8 py-6 md:px-12">
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="text-2xl font-bold tracking-tight"
        >
          profeo
        </button>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-2 md:px-12 md:pb-8 md:pt-3">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="w-full max-w-6xl space-y-6 md:space-y-8">
            <div className="mx-auto max-w-3xl space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-black/40">
                {isSignupFlow ? "Création de compte" : "Choix du profil"}
              </p>
              <div className="flex items-start justify-center gap-3 text-left md:-ml-10 md:gap-4">
                <button
                  type="button"
                  onClick={() => router.push(backHref)}
                  className="mt-2 inline-flex h-8 w-8 shrink-0 items-center justify-center text-black/75 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/15 focus-visible:ring-offset-4 md:mt-3 md:h-10 md:w-10"
                  aria-label="Retour"
                >
                  <ArrowLeft className="h-6 w-6 md:h-7 md:w-7" />
                </button>
                <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl xl:text-[4.5rem]">
                  Comment allez-vous utiliser Profeo ?
                </h1>
              </div>
              <p className="mx-auto max-w-2xl text-lg leading-7 text-black/50 md:leading-8">
                Choisissez le parcours qui correspond à votre besoin. Profeo adaptera ensuite les prochaines questions pour aller à l&apos;essentiel.
              </p>
            </div>

            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              <button
                type="button"
                onClick={() => handleSelectRole("student")}
                className="group flex min-h-[260px] flex-col rounded-[2rem] border border-black/10 bg-white p-6 text-left transition-all hover:border-black/25 hover:bg-black/[0.02] hover:shadow-[0_24px_80px_-48px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/15 focus-visible:ring-offset-4 md:min-h-[300px] md:p-8"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white md:mb-10 md:h-16 md:w-16">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-black/35">Parcours étudiant</p>
                  <h2 className="text-3xl font-semibold tracking-tight md:text-[2.1rem]">Trouver un tuteur</h2>
                  <p className="max-w-md text-base leading-8 text-black/55 md:text-lg">
                    Pour progresser dans une matière, préparer un examen ou obtenir un accompagnement ciblé.
                  </p>
                </div>
                <div className="mt-auto pt-8 md:pt-12">
                  <div className="inline-flex items-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition-transform group-hover:translate-x-1">
                    Choisir le parcours étudiant
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole("tutor")}
                className="group flex min-h-[260px] flex-col rounded-[2rem] border border-black/10 bg-white p-6 text-left transition-all hover:border-black/25 hover:bg-black/[0.02] hover:shadow-[0_24px_80px_-48px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/15 focus-visible:ring-offset-4 md:min-h-[300px] md:p-8"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white md:mb-10 md:h-16 md:w-16">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-black/35">Parcours tuteur</p>
                  <h2 className="text-3xl font-semibold tracking-tight md:text-[2.1rem]">Proposer mes cours</h2>
                  <p className="max-w-md text-base leading-8 text-black/55 md:text-lg">
                    Pour créer un profil crédible, présenter votre approche et commencer à accompagner d&apos;autres étudiants.
                  </p>
                </div>
                <div className="mt-auto pt-8 md:pt-12">
                  <div className="inline-flex items-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition-transform group-hover:translate-x-1">
                    Choisir le parcours tuteur
                  </div>
                </div>
              </button>
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

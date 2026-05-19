"use client";

import Image from "next/image";
import Link from "next/link";
import { AuthClerkSignIn } from "@/components/AuthClerk";
import { GraduationCap, Shield } from "lucide-react";
import splashBackground from "@/app/img/splash.png";

export function HomeSignIn() {
  return (
    <div className="grid min-h-screen bg-black text-white lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative flex min-h-[40vh] flex-col justify-between overflow-hidden bg-black px-8 py-8 text-white md:px-12 md:py-10 lg:min-h-screen">
          <Image
            src={splashBackground}
            alt="Illustration Clutch — recherche de tuteurs"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/35 to-black/70" />

          <div className="relative z-10 flex items-center gap-3 text-3xl font-semibold tracking-tight">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span>Clutch</span>
          </div>

          <div>
            <div className="relative z-10 max-w-2xl space-y-8 py-8 lg:py-0">
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">
                Tutorat entre étudiants
              </p>
              <div className="space-y-5">
                <h1 className="font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl md:text-6xl xl:text-7xl">
                  Le bon tuteur,
                  <br />
                  au bon moment.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-white/72 md:text-xl">
                  Trouvez de l&apos;aide en cours ou proposez la vôtre — en quelques minutes, sans prise de tête.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/78">
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">
                  Profils vérifiés
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">
                  Demandes suivies
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">
                  Parcours guidé
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-screen flex-col bg-black px-6 py-8 text-white sm:px-8 md:px-12 md:py-10">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight lg:pointer-events-none lg:opacity-0"
            >
              clutch
            </Link>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/40">
              <Shield className="h-3.5 w-3.5" aria-hidden />
              Connexion sécurisée
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-center py-8 md:py-10">
            <div className="mx-auto w-full max-w-md space-y-8">
              <header className="space-y-3">
                <p className="text-sm uppercase tracking-[0.25em] text-white/45">
                  Connexion
                </p>
                <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.05]">
                  Bon retour sur Clutch.
                </h2>
                <p className="text-base leading-7 text-white/60 md:text-lg">
                  Reprenez vos demandes de cours, votre profil et vos parcours — étudiant ou tuteur.
                </p>
              </header>

              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <AuthClerkSignIn />
              </div>

              <p className="text-center text-sm leading-6 text-white/45">
                Première visite ?{" "}
                <Link
                  href="/sign-up"
                  className="font-medium text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  Créer un compte gratuitement
                </Link>
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}

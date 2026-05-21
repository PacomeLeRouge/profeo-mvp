import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AuthClerkSignUp } from "@/components/AuthClerk";
import { AuthPageHeader } from "@/components/theme/AuthPageHeader";
import { ContactEmailDisclaimer } from "@/components/onboarding/ContactEmailDisclaimer";
import { GraduationCap, Shield } from "lucide-react";
import splashBackground from "@/app/img/splash.png";

export default async function SignUpPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/auth/continue");
  }

  return (
    <div className="grid min-h-dvh bg-background text-foreground lg:h-dvh lg:max-h-dvh lg:grid-cols-[1.05fr_0.95fr] lg:overflow-hidden">
      <div className="relative flex min-h-[24vh] flex-col justify-between overflow-hidden px-6 py-6 sm:min-h-[28vh] sm:px-8 md:px-12 md:py-10 lg:h-full lg:max-h-none lg:min-h-full">
        <Image
          src={splashBackground}
          alt="Étudiants qui échangent des cours sur Clutch"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-background/90" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="glow-lime flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">Clutch</span>
        </div>
        <div className="relative z-10 max-w-2xl space-y-5 py-4 lg:space-y-8 lg:py-0">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50 sm:text-sm">
            Tutorat entre étudiants
          </p>
          <div className="space-y-3 lg:space-y-5">
            <h1 className="font-display text-3xl font-bold leading-[0.95] tracking-tight text-white sm:text-4xl md:text-6xl xl:text-[4.25rem]">
              Le bon tuteur,
              <br />
              au bon moment.
            </h1>
            <p className="hidden max-w-lg text-base leading-7 text-white/75 sm:block sm:text-lg sm:leading-8">
              Clutch met en relation étudiants et tuteurs au sein de votre université — pour un cours de
              soutien, une préparation d&apos;examen ou un coup de main entre pairs.
            </p>
          </div>
          <ul className="hidden flex-wrap gap-2.5 text-sm text-white/85 sm:flex">
            {["Tuteurs vérifiés", "Demandes de cours", "Même établissement"].map((label) => (
              <li
                key={label}
                className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-card px-6 pt-safe pb-safe sm:px-8 md:px-12">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col py-6 sm:py-8 lg:py-10">
          <AuthPageHeader
            className="mb-6 shrink-0 sm:mb-8"
            leading={
              <span className="font-display text-xl font-bold tracking-tight lg:hidden">clutch</span>
            }
            trailing={
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Shield className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Connexion sécurisée
              </span>
            }
          />
          <div className="space-y-5 sm:space-y-7">
            <header className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Inscription
              </p>
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Rejoignez Clutch.
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Créez votre compte pour trouver un tuteur ou proposer vos cours — choisissez ensuite votre
                parcours.
              </p>
            </header>
            <div className="glass-panel overflow-hidden rounded-[1.75rem] p-5 sm:p-7">
              <AuthClerkSignUp />
            </div>
            <ContactEmailDisclaimer variant="signup" />
            <p className="text-center text-xs leading-6 text-muted-foreground">
              <Link href="/legal" className="font-medium text-text-accent underline-offset-4 hover:underline">
                Informations légales
              </Link>
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link
                href="/"
                className="font-medium text-text-accent underline-offset-4 transition-colors hover:opacity-80 hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

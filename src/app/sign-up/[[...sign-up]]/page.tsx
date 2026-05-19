import Image from "next/image";
import Link from "next/link";
import { AuthClerkSignUp } from "@/components/AuthClerk";
import { GraduationCap, Shield } from "lucide-react";
import splashBackground from "../../img/splash.png";

export default function SignUpPage() {
  return (
    <motion.div className="grid min-h-screen bg-background text-foreground lg:grid-cols-[1.05fr_0.95fr]">
      <SplashPanel />
      <div className="flex min-h-screen flex-col bg-background px-6 py-8 sm:px-8 md:px-12 md:py-10">
        <motion.div className="flex items-center justify-between">
          <div className="font-display text-2xl font-bold tracking-tight lg:hidden">clutch</div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Déjà un compte ?
          </Link>
        </div>
        <div className="flex flex-1 flex-col justify-center py-8 md:py-10">
          <div className="mx-auto w-full max-w-md space-y-8">
            <header className="space-y-3">
              <p className="text-eyebrow text-muted-foreground">Inscription</p>
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.05]">
                Rejoignez Clutch.
              </h2>
              <p className="text-base leading-7 text-muted-foreground md:text-lg">
                Créez votre espace en tant qu&apos;étudiant ou tuteur — choisissez ensuite votre parcours.
              </p>
            </header>
            <div className="glass-panel rounded-[1.75rem] p-6 sm:p-8">
              <AuthClerkSignUp />
            </div>
            <p className="text-center text-sm leading-6 text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" aria-hidden />
                Connexion sécurisée
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SplashPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-muted px-8 py-8 md:px-12 md:py-10 lg:flex">
      <Image
        src={splashBackground}
        alt="Illustration Clutch"
        fill
        priority
        className="object-cover object-center opacity-90"
      />
      <motion.div className="absolute inset-0 bg-background/55" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/30 to-background/70" />
      <div className="relative z-10 flex items-center gap-3 font-display text-3xl font-bold tracking-tight">
        <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <span>Clutch</span>
      </div>
      <div className="relative z-10 max-w-2xl space-y-8 py-10">
        <p className="text-eyebrow text-muted-foreground">Tutorat entre étudiants</p>
        <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight xl:text-6xl">
          Votre espace
          <br />
          en quelques clics.
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          Un profil clair, des demandes suivies, et un parcours pensé pour la vie étudiante.
        </p>
      </div>
    </div>
  );
}

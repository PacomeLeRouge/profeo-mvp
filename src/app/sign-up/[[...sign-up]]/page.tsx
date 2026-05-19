import Image from "next/image";
import Link from "next/link";
import { AuthClerkSignUp } from "@/components/AuthClerk";
import { GraduationCap, Shield } from "lucide-react";
import splashBackground from "../../img/splash.png";

export default function SignUpPage() {
  return (
    <div className="grid min-h-screen bg-black text-white lg:grid-cols-[1.05fr_0.95fr]">
      <SplashPanel />
      <div className="flex min-h-screen flex-col bg-black px-6 py-8 text-white sm:px-8 md:px-12 md:py-10">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight lg:hidden">clutch</div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white">
            Déjà un compte ?
          </Link>
        </div>
        <div className="flex flex-1 flex-col justify-center py-8 md:py-10">
          <div className="mx-auto w-full max-w-md space-y-8">
            <header className="space-y-3">
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">Inscription</p>
              <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.05]">Rejoignez Clutch.</h2>
              <p className="text-base leading-7 text-white/60 md:text-lg">Créez votre espace en tant qu&apos;étudiant ou tuteur — choisissez ensuite votre parcours.</p>
            </header>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <AuthClerkSignUp />
            </div>
            <p className="text-center text-sm leading-6 text-white/45">
              <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" aria-hidden />Connexion sécurisée</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SplashPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-black px-8 py-8 text-white md:px-12 md:py-10 lg:flex">
      <Image src={splashBackground} alt="Illustration Clutch" fill priority className="object-cover object-center" />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/35 to-black/70" />
      <div className="relative z-10 flex items-center gap-3 text-3xl font-semibold tracking-tight">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15"><GraduationCap className="h-6 w-6" /></div>
        <span>Clutch</span>
      </div>
      <div className="relative z-10 max-w-2xl space-y-8 py-10">
        <p className="text-sm uppercase tracking-[0.25em] text-white/45">Tutorat entre étudiants</p>
        <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight xl:text-6xl">Votre espace<br />en quelques clics.</h1>
        <p className="text-lg leading-8 text-white/72">Un profil clair, des demandes suivies, et un parcours pensé pour la vie étudiante.</p>
      </div>
    </div>
  );
}

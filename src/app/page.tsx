"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap } from "lucide-react";
import splashBackground from "./img/splash.png";

const getDisplayNameFromEmail = (email: string) => {
  const rawName = email.split("@")[0] || "Étudiant";

  return rawName
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useStore((state) => state.login);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      login(getDisplayNameFromEmail(email.trim()));
      router.push("/role-selection?source=login");
    }
  };

  return (
    <form onSubmit={handleLogin} className="grid min-h-screen bg-black text-white lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative flex flex-col justify-between overflow-hidden bg-black px-8 py-8 text-white md:px-12 md:py-10">
        <Image
          src={splashBackground}
          alt="Illustration Profeo"
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
          <span>Profeo</span>
        </div>

        <div className="relative z-10 max-w-2xl space-y-8 py-10 lg:py-0">
          <p className="text-sm uppercase tracking-[0.25em] text-white/45">Tutorat entre étudiants</p>
          <div className="space-y-5">
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight md:text-6xl xl:text-7xl">
              Apprenez mieux.
              <br />
              Enseignez simplement.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-white/72 md:text-xl">
              Une expérience claire pour trouver un tuteur rapidement ou proposer vos cours avec confiance.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-white/78">
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">Parcours guidé</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">Profil clair</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">Rapide à compléter</span>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen flex-col justify-between bg-black px-8 py-8 text-white md:px-12 md:py-10">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight lg:hidden">profeo</div>
          <span className="text-sm font-medium text-white/40">Connexion sécurisée</span>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-xl space-y-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">Espace personnel</p>
              <h2 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl xl:text-6xl">
                Connectez-vous à votre espace.
              </h2>
              <p className="max-w-lg text-lg leading-8 text-white/68">
                Accédez à votre compte pour retrouver votre parcours et vos demandes de cours.
              </p>
            </div>

            <div className="space-y-5">
              <Input
                id="email"
                type="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Votre adresse e-mail"
                className="h-20 rounded-none border-0 border-b-2 border-white/15 px-0 text-left text-2xl font-medium text-white shadow-none placeholder:text-white/22 focus-visible:border-white focus-visible:ring-0 md:text-3xl"
              />
              <Input
                id="password"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Votre mot de passe"
                className="h-20 rounded-none border-0 border-b-2 border-white/15 px-0 text-left text-2xl font-medium text-white shadow-none placeholder:text-white/22 focus-visible:border-white focus-visible:ring-0 md:text-3xl"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between gap-6">
            <button
              type="button"
              onClick={() => router.push("/signup/name")}
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              Créer un compte
            </button>
            <Button type="submit" disabled={!email.trim() || !password.trim()} className="h-12 rounded-full bg-white px-8 text-base text-black hover:bg-white/90">
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

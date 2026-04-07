"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap } from "lucide-react";
import splashBackground from "../../img/splash.png";

export default function SignupNamePage() {
  const [name, setName] = useState("");
  const login = useStore((state) => state.login);
  const router = useRouter();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    login(name.trim());
    router.push("/role-selection?source=signup");
  };

  return (
    <form onSubmit={handleContinue} className="grid min-h-screen bg-black text-white lg:h-screen lg:grid-cols-[1.05fr_0.95fr] lg:overflow-hidden">
      <div className="relative flex flex-col justify-between overflow-hidden bg-black px-8 py-8 text-white md:px-12 md:py-10 lg:min-h-0">
        <Image
          src={splashBackground}
          alt="Illustration Clutch"
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

        <div className="relative z-10 max-w-2xl space-y-8 py-10 lg:py-0">
          <p className="text-sm uppercase tracking-[0.25em] text-white/45">Création de compte</p>
          <div className="space-y-5">
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight md:text-6xl xl:text-7xl">
              Créez votre espace.
              <br />
              Commencez simplement.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-white/72 md:text-xl">
              Quelques informations suffisent pour configurer votre profil et démarrer sur Clutch.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-white/78">
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">Rapide</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">Guidé</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">Clair</span>
          </div>
        </div>

      </div>

      <div className="flex min-h-screen flex-col justify-between bg-black px-8 py-6 pb-8 text-white md:px-12 md:py-8 md:pb-10 lg:min-h-0 lg:py-6 lg:pb-8">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight lg:hidden">clutch</div>
        </div>

        <div className="flex flex-1 items-center justify-center py-6 md:py-8 lg:py-6">
          <div className="w-full max-w-xl space-y-8 md:space-y-9">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">Création de compte</p>
              <h2 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl xl:text-6xl">
                Votre prénom, pour commencer.
              </h2>
              <p className="max-w-lg text-base leading-7 text-white/68 md:text-lg md:leading-8">
                Cette première étape nous permet de personnaliser votre parcours avant le choix du profil.
              </p>
            </div>

            <div className="space-y-5">
              <Input
                id="name"
                placeholder="Taper ici"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-label="Votre prénom ou nom"
                className="h-24 rounded-none border-0 border-b-2 border-white/15 px-0 text-left text-3xl font-medium text-white shadow-none placeholder:text-white/22 focus-visible:border-white focus-visible:ring-0 md:text-4xl"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-4 md:pt-5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              Retour à la connexion
            </button>
            <Button type="submit" disabled={!name.trim()} className="h-12 rounded-full bg-white px-8 text-base text-black hover:bg-white/90">
              Continuer
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

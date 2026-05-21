import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { legalPageMeta, legalSections } from "@/lib/legal/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Informations légales · Clutch",
  description: legalPageMeta.subtitle,
};

export default function LegalPage() {
  return (
    <div className={cn("min-h-dvh", "onboarding-surface")}>
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5 md:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="glow-lime flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-4 w-4" aria-hidden />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">Clutch</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 pb-safe sm:px-6 sm:py-10 md:px-12 md:py-14">
        <header className="space-y-3 border-b border-border pb-8">
          <p className="text-eyebrow text-text-accent">Informations légales</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {legalPageMeta.title}
          </h1>
          <p className="text-base leading-7 text-muted-foreground">{legalPageMeta.subtitle}</p>
          <p className="text-sm text-muted-foreground">
            Version {legalPageMeta.version} · mise à jour le {legalPageMeta.updatedAt}
          </p>
        </header>

        <nav
          aria-label="Sommaire"
          className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-[0_20px_60px_-36px_rgba(26,26,26,0.22)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Sommaire
          </p>
          <ol className="mt-3 space-y-2">
            {legalSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-sm font-medium text-text-accent underline-offset-4 hover:underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 space-y-10">
          {legalSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 space-y-4"
            >
              <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-7 text-foreground/80">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-foreground/80">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

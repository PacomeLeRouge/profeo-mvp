"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ContactEmailConsentStepProps = {
  variant?: "student" | "tutor";
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
};

const copy = {
  student: {
    title: "Échanges par e-mail",
    body: "Clutch met en relation étudiants et tuteurs. Votre adresse de connexion ne sera transmise au tuteur qu'après acceptation de votre demande de cours — pour convenir d'un créneau ensemble, en direct par e-mail.",
    consent:
      "J'accepte que mon adresse e-mail de connexion soit partagée avec le tuteur lorsqu'une demande de cours est acceptée.",
  },
  tutor: {
    title: "Échanges par e-mail",
    body: "Clutch met en relation étudiants et tuteurs. Votre adresse de connexion sera partagée avec les étudiants dont vous acceptez la demande — pour organiser les cours en direct par e-mail.",
    consent:
      "J'accepte que mon adresse e-mail de connexion soit partagée avec les étudiants dont j'accepte la demande.",
  },
} as const;

export function ContactEmailConsentStep({
  variant = "student",
  checked,
  onCheckedChange,
  className,
}: ContactEmailConsentStepProps) {
  const { title, body, consent } = copy[variant];
  const checkboxId = `contact-email-consent-${variant}`;

  return (
    <div className={cn("mx-auto w-full max-w-lg space-y-6 text-left", className)}>
      <div className="rounded-[1.75rem] border border-border bg-card/85 px-5 py-5 shadow-sm backdrop-blur-sm sm:px-6 sm:py-6">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-text-accent">
            <Mail className="h-5 w-5" aria-hidden />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {title}
            </p>
            <p className="text-sm leading-6 text-foreground/80">{body}</p>
            <Link
              href="/legal#partage-email"
              className="inline-block text-sm font-medium text-text-accent underline-offset-4 hover:underline"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex items-start gap-3 rounded-[1.75rem] border border-border bg-card/85 px-5 py-4 shadow-sm backdrop-blur-sm transition-colors sm:px-6 sm:py-5",
          checked && "border-primary/35 bg-primary/5"
        )}
      >
        <Checkbox
          id={checkboxId}
          checked={checked}
          onCheckedChange={(value) => onCheckedChange(value === true)}
          className="mt-0.5 size-5 rounded-md"
        />
        <div className="space-y-1.5">
          <Label
            htmlFor={checkboxId}
            className="cursor-pointer text-sm leading-6 font-medium text-foreground"
          >
            {consent}
          </Label>
          <p className="text-xs leading-5 text-muted-foreground">
            Les messages ne passent pas par Clutch — vous échangez directement par e-mail.
          </p>
        </div>
      </div>
    </div>
  );
}

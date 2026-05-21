import Link from "next/link";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type ContactEmailDisclaimerProps = {
  variant?: "signup" | "student" | "tutor";
  className?: string;
};

const copy = {
  signup: {
    title: "Échanges par e-mail",
    body: "Clutch met en relation étudiants et tuteurs. Votre adresse de connexion pourra être partagée avec l'autre partie une fois une demande de cours acceptée, afin d'organiser vos séances. Les messages ne passent pas par Clutch — vous échangez directement par e-mail. Vous devrez confirmer ce partage à la fin de votre inscription.",
  },
  student: {
    title: "Votre e-mail de contact",
    body: "Nous utilisons l'adresse liée à votre compte Clutch. Elle ne sera transmise au tuteur qu'après acceptation de votre demande de cours, pour convenir d'un créneau ensemble.",
  },
  tutor: {
    title: "Votre e-mail de contact",
    body: "Nous utilisons l'adresse liée à votre compte Clutch. Elle sera partagée avec les étudiants dont vous acceptez la demande, afin d'organiser les cours en direct par e-mail.",
  },
} as const;

export function ContactEmailDisclaimer({
  variant = "signup",
  className,
}: ContactEmailDisclaimerProps) {
  const { title, body } = copy[variant];

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border bg-muted/40 px-4 py-3.5 text-left",
        className
      )}
      aria-label={title}
    >
      <div className="flex gap-3">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {title}
          </p>
          <p className="text-sm leading-6 text-foreground/75">{body}</p>
          <p className="text-sm leading-6">
            <Link
              href="/legal#partage-email"
              className="font-medium text-text-accent underline-offset-4 hover:underline"
            >
              En savoir plus
            </Link>
          </p>
        </div>
      </div>
    </aside>
  );
}

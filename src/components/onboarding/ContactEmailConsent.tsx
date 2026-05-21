import Link from "next/link";
import { cn } from "@/lib/utils";

type ContactEmailConsentProps = {
  variant?: "student" | "tutor";
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
};

const copy = {
  student: {
    label:
      "J'accepte que mon adresse e-mail de connexion soit partagée avec le tuteur lorsqu'une demande de cours est acceptée, afin d'organiser nos échanges directement par e-mail.",
  },
  tutor: {
    label:
      "J'accepte que mon adresse e-mail de connexion soit partagée avec les étudiants dont j'accepte la demande, afin d'organiser nos échanges directement par e-mail.",
  },
} as const;

export function ContactEmailConsent({
  variant = "student",
  checked,
  onCheckedChange,
  className,
}: ContactEmailConsentProps) {
  const id = `contact-email-consent-${variant}`;

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3.5 text-left",
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-border accent-primary"
        required
      />
      <span className="space-y-2">
        <span className="block text-sm leading-6 text-foreground/85">{copy[variant].label}</span>
        <Link
          href="/legal#consentement"
          className="text-sm font-medium text-text-accent underline-offset-4 hover:underline"
        >
          Lire les informations légales
        </Link>
      </span>
    </label>
  );
}

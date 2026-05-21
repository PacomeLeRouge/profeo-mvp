import { Mail } from "lucide-react";
import { buildMailtoHref } from "@/lib/lesson-request-mailto";
import { cn } from "@/lib/utils";

type ContactEmailLinkProps = {
  email: string;
  label?: string;
  className?: string;
  subject?: string;
  body?: string;
  href?: string;
};

export function ContactEmailLink({
  email,
  label,
  className,
  subject,
  body,
  href,
}: ContactEmailLinkProps) {
  const mailtoHref =
    href ?? (subject || body ? buildMailtoHref(email, subject ?? "", body ?? "") : `mailto:${email}`);

  return (
    <a
      href={mailtoHref}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-muted/80 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground",
        className
      )}
    >
      <Mail className="h-3.5 w-3.5" aria-hidden />
      {label ?? email}
    </a>
  );
}

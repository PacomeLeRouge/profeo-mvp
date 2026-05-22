import Link from "next/link";
import {
  describeRequestStatus,
  respondToLessonRequestByEmailToken,
  subjectLabelForRequest,
} from "@/lib/lesson-request-status";
import type { LessonRequestActionStatus } from "@/lib/lesson-request-token";

type PageProps = {
  searchParams: Promise<{
    requestId?: string;
    status?: string;
    token?: string;
  }>;
};

function isActionStatus(value: string | undefined): value is LessonRequestActionStatus {
  return value === "Confirmed" || value === "Declined";
}

export default async function LessonRequestRespondPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { requestId, status, token } = params;

  if (!requestId || !isActionStatus(status) || !token) {
    return (
      <ResultShell
        title="Lien incomplet"
        message="Ce lien ne contient pas toutes les informations nécessaires."
        tone="error"
      />
    );
  }

  const result = await respondToLessonRequestByEmailToken({ requestId, status, token });

  if (!result.ok) {
    return (
      <ResultShell
        title={result.code === "expired_token" ? "Lien expiré" : "Lien invalide"}
        message={result.message}
        tone="error"
        action={{ href: "/dashboard/tutor", label: "Ouvrir mon tableau de bord" }}
      />
    );
  }

  const request = result.request;
  const subjectLabel = subjectLabelForRequest(request);
  const accepted = request.status === "Confirmed";
  const declined = request.status === "Declined";
  const changed = result.kind === "updated";

  if (accepted) {
    return (
      <ResultShell
        title={changed ? "Demande acceptée" : "Demande déjà acceptée"}
        message={
          changed
            ? `${request.studentName} a été notifié(e) par e-mail. Vous pouvez organiser le premier cours directement avec ${request.studentContactEmail}.`
            : `Cette demande de ${subjectLabel} avec ${request.studentName} est déjà ${describeRequestStatus(request.status)}.`
        }
        tone="success"
        action={{ href: "/dashboard/tutor", label: "Voir mes demandes" }}
      />
    );
  }

  if (declined) {
    return (
      <ResultShell
        title={changed ? "Demande refusée" : "Demande déjà refusée"}
        message={
          changed
            ? `${request.studentName} a été informé(e) par e-mail.`
            : `Cette demande de ${subjectLabel} avec ${request.studentName} est déjà ${describeRequestStatus(request.status)}.`
        }
        tone="neutral"
        action={{ href: "/dashboard/tutor", label: "Retour au tableau de bord" }}
      />
    );
  }

  return (
    <ResultShell
      title="Demande en attente"
      message={`Cette demande est encore ${describeRequestStatus(request.status)}.`}
      tone="neutral"
      action={{ href: "/dashboard/tutor", label: "Répondre depuis Clutch" }}
    />
  );
}

function ResultShell({
  title,
  message,
  tone,
  action,
}: {
  title: string;
  message: string;
  tone: "success" | "error" | "neutral";
  action?: { href: string; label: string };
}) {
  const accent =
    tone === "success"
      ? "border-[#ccff00]/40 bg-[#ccff00]/10"
      : tone === "error"
        ? "border-destructive/30 bg-destructive/5"
        : "border-border bg-card";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className={`w-full max-w-lg rounded-[1.5rem] border p-8 shadow-sm ${accent}`}>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Clutch</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">{message}</p>
        {action ? (
          <Link
            href={action.href}
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
    </main>
  );
}

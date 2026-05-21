import type { LessonRequest } from "@/lib/types";

function formatRequestDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildMailtoHref(email: string, subject: string, body: string): string {
  const parts: string[] = [];
  if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
  if (body) parts.push(`body=${encodeURIComponent(body.replace(/\n/g, "\r\n"))}`);
  return parts.length > 0 ? `mailto:${email}?${parts.join("&")}` : `mailto:${email}`;
}

/** Mail pré-rempli — étudiant → tuteur (demande confirmée). */
export function buildStudentToTutorContactMail(params: {
  request: LessonRequest;
  subjectLabel: string;
}): string {
  const { request, subjectLabel } = params;
  const sentAt = formatRequestDateTime(request.createdAt);
  const subject = `Clutch — Cours de ${subjectLabel} avec ${request.tutorName}`;
  const body = [
    `Bonjour ${request.tutorName},`,
    "",
    "Je vous contacte suite à ma demande de cours acceptée sur Clutch.",
    "",
    `Matière : ${subjectLabel}`,
    `Demande envoyée le : ${sentAt}`,
    `Référence : ${request.id.slice(0, 8)}`,
    "",
    "Pourriez-vous me proposer un créneau pour notre premier cours ?",
    "",
    "Merci,",
    request.studentName,
  ].join("\n");

  return buildMailtoHref(request.tutorContactEmail, subject, body);
}

/** Mail pré-rempli — tuteur → étudiant. */
export function buildTutorToStudentContactMail(params: {
  request: LessonRequest;
  subjectLabel: string;
}): string {
  const { request, subjectLabel } = params;
  const sentAt = formatRequestDateTime(request.createdAt);
  const subject = `Clutch — Cours de ${subjectLabel} avec ${request.studentName}`;
  const body = [
    `Bonjour ${request.studentName},`,
    "",
    "Je vous contacte au sujet de votre demande de cours sur Clutch.",
    "",
    `Matière : ${subjectLabel}`,
    `Demande reçue le : ${sentAt}`,
    `Référence : ${request.id.slice(0, 8)}`,
    "",
    "Quelles sont vos disponibilités pour organiser le cours ?",
    "",
    "À bientôt,",
    request.tutorName,
  ].join("\n");

  return buildMailtoHref(request.studentContactEmail, subject, body);
}

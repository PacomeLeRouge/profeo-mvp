import { getAppUrl } from "@/lib/app-url";

function layout(title: string, body: string, ctaLabel: string, ctaHref: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#e8e2d6;font-family:system-ui,-apple-system,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#e8e2d6;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#f7f3ec;border-radius:16px;border:1px solid #cfc6b8;overflow:hidden;">
        <tr><td style="padding:28px 28px 8px;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#5c564e;">Clutch</p>
          <h1 style="margin:0;font-size:22px;line-height:1.3;font-weight:700;">${title}</h1>
        </td></tr>
        <tr><td style="padding:8px 28px 20px;font-size:15px;line-height:1.6;color:#3d3a36;">
          ${body}
        </td></tr>
        <tr><td style="padding:0 28px 28px;">
          <a href="${ctaHref}" style="display:inline-block;background:#ccff00;color:#000;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:999px;">${ctaLabel}</a>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:#5c564e;">Vous recevez cet e-mail car vous utilisez Clutch.</p>
    </td></tr>
  </table>
</body>
</html>`;
}

function plain(lines: string[]): string {
  return lines.join("\n");
}

function contactBlock(label: string, name: string, email: string): string {
  return `
    <tr><td style="padding:10px 16px;font-size:14px;">
      <span style="color:#5c564e;">${label}</span><br/>
      <strong>${escapeHtml(name)}</strong><br/>
      <a href="mailto:${escapeHtml(email)}" style="color:#1a1a1a;">${escapeHtml(email)}</a>
    </td></tr>
  `;
}

export function newLessonRequestEmail(params: {
  tutorName: string;
  studentName: string;
  studentContactEmail: string;
  subjectLabel: string;
  hourlyRate: number;
  formatLabel: string;
  institution: string;
}) {
  const dashboardUrl = `${getAppUrl()}/dashboard/tutor`;
  const title = "Nouvelle demande de prise de contact";
  const body = `
    <p style="margin:0 0 12px;">Bonjour <strong>${escapeHtml(params.tutorName)}</strong>,</p>
    <p style="margin:0 0 16px;"><strong>${escapeHtml(params.studentName)}</strong> souhaite vous contacter pour un cours de <strong>${escapeHtml(params.subjectLabel)}</strong>.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#ebe4d8;border-radius:12px;padding:4px 0;">
      ${contactBlock("Élève", params.studentName, params.studentContactEmail)}
      <tr><td style="padding:10px 16px;font-size:14px;"><span style="color:#5c564e;">Tarif</span><br/><strong>${params.hourlyRate} €/h</strong></td></tr>
      <tr><td style="padding:10px 16px;font-size:14px;"><span style="color:#5c564e;">Format</span><br/><strong>${escapeHtml(params.formatLabel)}</strong></td></tr>
      <tr><td style="padding:10px 16px;font-size:14px;"><span style="color:#5c564e;">Établissement</span><br/><strong>${escapeHtml(params.institution)}</strong></td></tr>
    </table>
    <p style="margin:16px 0 0;">Répondez à l'élève par e-mail ou acceptez la demande depuis votre tableau de bord.</p>
  `;

  return {
    subject: `${params.studentName} souhaite vous contacter — ${params.subjectLabel}`,
    html: layout(title, body, "Voir la demande", dashboardUrl),
    text: plain([
      `Bonjour ${params.tutorName},`,
      "",
      `${params.studentName} souhaite un cours de ${params.subjectLabel}.`,
      `E-mail de l'élève : ${params.studentContactEmail}`,
      `Tarif : ${params.hourlyRate} €/h`,
      `Format : ${params.formatLabel}`,
      `Établissement : ${params.institution}`,
      "",
      `Tableau de bord : ${dashboardUrl}`,
    ]),
  };
}

export function lessonRequestStatusEmail(params: {
  studentName: string;
  tutorName: string;
  tutorContactEmail: string;
  subjectLabel: string;
  status: "Confirmed" | "Declined";
}) {
  const dashboardUrl = `${getAppUrl()}/dashboard/student`;
  const accepted = params.status === "Confirmed";
  const title = accepted ? "Demande acceptée — coordonnées du tuteur" : "Demande refusée";
  const statusText = accepted
    ? `${escapeHtml(params.tutorName)} a accepté votre demande. Voici son e-mail pour organiser le premier cours :`
    : `${escapeHtml(params.tutorName)} a décliné votre demande pour le moment.`;

  const contactSection = accepted
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#ebe4d8;border-radius:12px;padding:4px 0;margin-top:12px;">
        ${contactBlock("Tuteur", params.tutorName, params.tutorContactEmail)}
      </table>`
    : "";

  const body = `
    <p style="margin:0 0 12px;">Bonjour <strong>${escapeHtml(params.studentName)}</strong>,</p>
    <p style="margin:0 0 12px;">${statusText}</p>
    <p style="margin:0;"><strong>Matière :</strong> ${escapeHtml(params.subjectLabel)}</p>
    ${contactSection}
  `;

  return {
    subject: accepted
      ? `${params.tutorName} a accepté — contact : ${params.subjectLabel}`
      : `Réponse à votre demande — ${params.subjectLabel}`,
    html: layout(title, body, "Voir mes demandes", dashboardUrl),
    text: plain([
      `Bonjour ${params.studentName},`,
      "",
      accepted
        ? `${params.tutorName} a accepté votre demande de cours en ${params.subjectLabel}.`
        : `${params.tutorName} a refusé votre demande de cours en ${params.subjectLabel}.`,
      ...(accepted ? [`E-mail du tuteur : ${params.tutorContactEmail}`] : []),
      "",
      `Tableau de bord : ${dashboardUrl}`,
    ]),
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

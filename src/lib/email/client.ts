import { Resend } from "resend";

let resendClient: Resend | null = null;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim());
}

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

export function getEmailFrom(): string | null {
  const from = process.env.EMAIL_FROM?.trim();
  return from || null;
}

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const resend = getResend();
  const from = getEmailFrom();

  if (!resend || !from) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email] Non configuré — message ignoré:", input.subject, "→", input.to);
    }
    return false;
  }

  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });

  if (error) {
    console.error("[email] Échec d'envoi:", error);
    return false;
  }

  return true;
}

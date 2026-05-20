import { config } from "dotenv";
import { newLessonRequestEmail } from "../src/lib/email/templates";
import { sendEmail } from "../src/lib/email/client";

config({ path: ".env.local" });

async function main() {
  const to = process.argv[2];
  if (!to) {
    console.error("Usage: npx tsx scripts/test-contact-email.ts <recipient@email.com>");
    process.exit(1);
  }

  const message = newLessonRequestEmail({
    tutorName: "Sam",
    studentName: "Alex",
    studentContactEmail: "alex.etudiant@example.com",
    subjectLabel: "Mathématiques",
    hourlyRate: 25,
    formatLabel: "En ligne",
    institution: "UCLouvain",
  });

  const ok = await sendEmail({
    to,
    subject: `[Test Clutch] ${message.subject}`,
    html: message.html,
    text: message.text,
  });

  if (!ok) {
    console.error("Échec — vérifiez RESEND_API_KEY et EMAIL_FROM dans .env.local");
    process.exit(1);
  }

  console.log(`E-mail de test envoyé à ${to}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

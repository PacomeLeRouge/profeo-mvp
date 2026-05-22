/**
 * Smoke tests — validation onboarding + résolution e-mail (sans auth Clerk).
 * Usage: npm run test:smoke
 */
import { config } from "dotenv";
import {
  isValidAgeStep,
  isValidFirstNameStep,
  isValidHourlyRateStep,
} from "../src/lib/onboarding-step-validation";
import { normalizeContactEmail, resolveContactEmail } from "../src/lib/contact-email";
import {
  validateStudentProfileInput,
  validateTutorProfileInput,
} from "../src/lib/profile-validation";
import {
  buildLessonRequestRespondUrl,
  createLessonRequestActionToken,
  verifyLessonRequestActionToken,
} from "../src/lib/lesson-request-token";
import { lessonRequestStatusEmail, newLessonRequestEmail } from "../src/lib/email/templates";

config({ path: ".env.local" });

let passed = 0;
let failed = 0;

function ok(label: string) {
  passed++;
  console.log(`  ✓ ${label}`);
}

function fail(label: string, detail?: string) {
  failed++;
  console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
}

function assert(condition: boolean, label: string, detail?: string) {
  if (condition) ok(label);
  else fail(label, detail);
}

async function main() {
  console.log("\n— Validation étapes onboarding —\n");

  assert(isValidFirstNameStep("Sam"), "prénom valide");
  assert(!isValidFirstNameStep("A"), "prénom trop court rejeté");
  assert(isValidAgeStep("22", 18, 99), "âge tuteur valide");
  assert(!isValidAgeStep("17", 18, 99), "âge tuteur 17 rejeté");
  assert(isValidAgeStep("18", 16, 99), "âge étudiant 18 valide");
  assert(isValidHourlyRateStep("25"), "tarif 25 valide");
  assert(!isValidHourlyRateStep("3"), "tarif < 5 rejeté");

  console.log("\n— E-mail de contact (compte Clerk) —\n");

  assert(
    resolveContactEmail("", "user@uclouvain.be") === "user@uclouvain.be",
    "repli sur e-mail compte si vide"
  );
  assert(
    resolveContactEmail("contact@univ.be", "user@gmail.com") === "contact@univ.be",
    "e-mail profil explicite conservé"
  );

  try {
    normalizeContactEmail("bad-email");
    fail("e-mail invalide devrait échouer");
  } catch {
    ok("e-mail invalide rejeté");
  }

  console.log("\n— Boucle demande de cours (tokens + e-mails) —\n");

  process.env.CLERK_SECRET_KEY ||= "smoke-test-secret";

  const requestId = "00000000-0000-4000-8000-000000000001";
  const acceptToken = createLessonRequestActionToken(requestId, "Confirmed");
  assert(
    verifyLessonRequestActionToken(requestId, "Confirmed", acceptToken).valid,
    "token acceptation valide"
  );
  assert(
    !verifyLessonRequestActionToken(requestId, "Declined", acceptToken).valid,
    "token refus rejeté si mauvais statut"
  );

  const respondUrl = buildLessonRequestRespondUrl(requestId, "Confirmed", "https://clutch.test");
  assert(respondUrl.includes("/requests/respond?"), "URL de réponse e-mail générée");

  const tutorMail = newLessonRequestEmail({
    requestId,
    tutorName: "Sam",
    studentName: "Alex",
    studentContactEmail: "alex@student.be",
    subjectLabel: "Mathématiques",
    hourlyRate: 25,
    formatLabel: "En ligne",
    institution: "UCLouvain",
  });
  assert(tutorMail.html.includes("Accepter"), "e-mail tuteur contient CTA accepter");
  assert(tutorMail.text.includes("Accepter :"), "e-mail tuteur contient lien acceptation");

  const studentMail = lessonRequestStatusEmail({
    studentName: "Alex",
    tutorName: "Sam",
    tutorContactEmail: "sam@tutor.be",
    subjectLabel: "Mathématiques",
    status: "Confirmed",
  });
  assert(studentMail.html.includes("sam@tutor.be"), "e-mail étudiant révèle le contact tuteur");
  assert(
    studentMail.subject.includes("a accepté"),
    "e-mail étudiant confirme l'acceptation"
  );

  console.log("\n— Profils (payload type onboarding) —\n");

  try {
    validateStudentProfileInput({
      firstName: "Alex",
      contactEmail: "alex@student.be",
      age: 20,
      educationLevel: "Licence",
      institution: "UCLouvain",
      subjectsOfInterest: ["Math"],
    });
    ok("profil étudiant valide");
  } catch (e) {
    fail("profil étudiant", e instanceof Error ? e.message : String(e));
  }

  try {
    validateTutorProfileInput({
      firstName: "Sam",
      contactEmail: "sam@tutor.be",
      age: 22,
      subjects: ["Math"],
      hourlyRate: 30,
      format: "Online",
      bio: "",
      availability: "Lundi Matin",
      educationLevel: "Master",
      institution: "UCLouvain",
    });
    ok("profil tuteur valide");
  } catch (e) {
    fail("profil tuteur", e instanceof Error ? e.message : String(e));
  }

  console.log("\n— Base de données —\n");

  if (!process.env.DATABASE_URL) {
    console.log("  ⊘ DATABASE_URL absent — ignoré");
  } else {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const { drizzle } = await import("drizzle-orm/neon-http");
      const { sql } = await import("drizzle-orm");
      const db = drizzle(neon(process.env.DATABASE_URL));
      await db.execute(sql`SELECT 1`);
      ok("connexion Neon OK");
    } catch (e) {
      fail("connexion Neon", e instanceof Error ? e.message : String(e));
    }
  }

  console.log(`\n— Résultat: ${passed} ok, ${failed} échec(s) —\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

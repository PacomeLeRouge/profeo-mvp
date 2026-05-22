import { config } from "dotenv";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const TEMPLATE_PATH = resolve(ROOT, ".env.example");
const LOCAL_PATH = resolve(ROOT, ".env.local");

const REQUIRED_KEYS = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "CLERK_WEBHOOK_SECRET",
  "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL",
  "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL",
  "DATABASE_URL",
] as const;

const RECOMMENDED_KEYS = ["NEXT_PUBLIC_APP_URL"] as const;

const OPTIONAL_KEYS = ["RESEND_API_KEY", "EMAIL_FROM"] as const;

function parseEnvKeys(filePath: string): Set<string> {
  const keys = new Set<string>();
  const content = readFileSync(filePath, "utf8");

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=/);
    if (match?.[1]) keys.add(match[1]);
  }

  return keys;
}

function hasValue(key: string, env: NodeJS.ProcessEnv): boolean {
  return Boolean(env[key]?.trim());
}

function main() {
  if (!existsSync(TEMPLATE_PATH)) {
    console.error("Missing .env.example at repo root.");
    process.exit(1);
  }

  if (!existsSync(LOCAL_PATH)) {
    console.error("Missing .env.local — run: vercel env pull .env.local --yes");
    process.exit(1);
  }

  config({ path: LOCAL_PATH });
  const templateKeys = parseEnvKeys(TEMPLATE_PATH);
  const env = process.env;

  const missingRequired = REQUIRED_KEYS.filter((key) => !hasValue(key, env));
  const missingRecommended = RECOMMENDED_KEYS.filter((key) => !hasValue(key, env));
  const unknownInTemplate = [...templateKeys].filter(
    (key) =>
      !REQUIRED_KEYS.includes(key as (typeof REQUIRED_KEYS)[number]) &&
      !RECOMMENDED_KEYS.includes(key as (typeof RECOMMENDED_KEYS)[number]) &&
      !OPTIONAL_KEYS.includes(key as (typeof OPTIONAL_KEYS)[number])
  );

  console.log("Bootstrap env check");
  console.log(`- Template: .env.example (${templateKeys.size} keys)`);
  console.log(`- Local: .env.local`);
  console.log(`- Required: ${REQUIRED_KEYS.length - missingRequired.length}/${REQUIRED_KEYS.length} present`);
  console.log(
    `- Recommended: ${RECOMMENDED_KEYS.length - missingRecommended.length}/${RECOMMENDED_KEYS.length} present`
  );

  if (missingRequired.length > 0) {
    console.error("\nMissing required keys:");
    for (const key of missingRequired) console.error(`  - ${key}`);
  }

  if (missingRecommended.length > 0) {
    console.warn("\nMissing recommended keys (needed for production e-mail links):");
    for (const key of missingRecommended) console.warn(`  - ${key}`);
  }

  if (unknownInTemplate.length > 0) {
    console.warn("\nKeys in .env.example not tracked by bootstrap:check:");
    for (const key of unknownInTemplate) console.warn(`  - ${key}`);
  }

  if (missingRequired.length > 0) {
    process.exit(1);
  }

  console.log("\nOK — required environment variables are set.");
}

main();

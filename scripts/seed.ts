import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { inArray } from "drizzle-orm";
import { tutorProfiles, users } from "../src/db/schema";

config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required. Copy .env.example to .env.local first.");
}

const db = drizzle(neon(connectionString));

const demoSeedUserIds = ["seed_u1", "seed_u2", "seed_u3"];

async function main() {
  await db.delete(tutorProfiles).where(inArray(tutorProfiles.userId, demoSeedUserIds));
  await db.delete(users).where(inArray(users.id, demoSeedUserIds));

  console.log(`Removed ${demoSeedUserIds.length} demo tutor account(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

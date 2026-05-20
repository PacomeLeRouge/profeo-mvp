import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { tutorProfiles, users } from "../src/db/schema";

config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required. Copy .env.example to .env.local first.");
}

const db = drizzle(neon(connectionString));

const seedTutors = [
  {
    userId: "seed_u1",
    email: "alice@example.com",
    name: "Alice Dubois",
    subjects: ["Math", "Science"] as const,
    hourlyRate: 35,
    format: "Online" as const,
    bio: "Tuteur passionné de mathématiques et de sciences avec 5 ans d'expérience.",
    availability: "Lun-Mer 16h-20h",
    educationLevel: "Master",
    institution: "Université de Paris",
  },
  {
    userId: "seed_u2",
    email: "thomas@example.com",
    name: "Thomas Martin",
    subjects: ["English"] as const,
    hourlyRate: 25,
    format: "In-person" as const,
    bio: "Professeur d'anglais dévoué, spécialisé en grammaire et rédaction.",
    availability: "Sam-Dim 10h-14h",
    educationLevel: "Licence",
    institution: "Sorbonne Université",
  },
  {
    userId: "seed_u3",
    email: "catherine@example.com",
    name: "Catherine Leroy",
    subjects: ["Chemistry", "Physics"] as const,
    hourlyRate: 40,
    format: "Both" as const,
    bio: "Ancienne professeure de biologie au lycée.",
    availability: "Mar, Jeu, Ven 17h-21h",
    educationLevel: "Doctorat",
    institution: "ENS",
  },
];

async function main() {
  for (const tutor of seedTutors) {
    await db
      .insert(users)
      .values({
        id: tutor.userId,
        email: tutor.email,
        name: tutor.name,
        role: "tutor",
      })
      .onConflictDoNothing();

    await db
      .insert(tutorProfiles)
      .values({
        userId: tutor.userId,
        name: tutor.name,
        subjects: [...tutor.subjects],
        hourlyRate: tutor.hourlyRate,
        format: tutor.format,
        bio: tutor.bio,
        availability: tutor.availability,
        educationLevel: tutor.educationLevel,
        institution: tutor.institution,
        contactEmail: tutor.email,
      })
      .onConflictDoNothing();
  }

  console.log(`Seeded ${seedTutors.length} demo tutors.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

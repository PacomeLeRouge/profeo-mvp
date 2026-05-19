"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { lessonRequests, studentProfiles, tutorProfiles, users } from "@/db/schema";
import { ensureDbUser, requireAuthUserId, syncClerkFirstName } from "@/lib/auth";
import { listPublishedTutorProfiles } from "@/lib/data/dashboard";
import { mapStudentProfile, mapTutorProfile } from "@/lib/mappers";
import {
  normalizeFirstName,
  validateStudentProfileInput,
  validateTutorProfileInput,
} from "@/lib/profile-validation";
import type { Format, Subject } from "@/lib/types";

async function syncUserFirstName(userId: string, firstName: string) {
  const trimmed = normalizeFirstName(firstName);

  await db
    .update(users)
    .set({ name: trimmed, updatedAt: new Date() })
    .where(eq(users.id, userId));

  await syncClerkFirstName(userId, trimmed);

  return trimmed;
}

async function syncTutorPublicName(userId: string, displayName: string) {
  const tutor = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, userId),
  });
  if (!tutor) return;

  await db
    .update(tutorProfiles)
    .set({ name: displayName, updatedAt: new Date() })
    .where(eq(tutorProfiles.userId, userId));

  await db
    .update(lessonRequests)
    .set({ tutorName: displayName })
    .where(eq(lessonRequests.tutorProfileId, tutor.id));
}

function revalidateAfterProfileSave(role: "student" | "tutor") {
  revalidatePath("/", "layout");
  if (role === "student") {
    revalidatePath("/dashboard/student");
    revalidatePath("/onboarding/student");
  } else {
    revalidatePath("/dashboard/tutor");
    revalidatePath("/dashboard/student");
    revalidatePath("/onboarding/tutor");
  }
}

export async function getStudentProfileAction() {
  const userId = await requireAuthUserId();
  const row = await db.query.studentProfiles.findFirst({
    where: eq(studentProfiles.userId, userId),
  });
  return row ? mapStudentProfile(row) : null;
}

export async function getTutorProfileAction() {
  const userId = await requireAuthUserId();
  const row = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, userId),
  });
  return row ? mapTutorProfile(row) : null;
}

export async function listTutorProfilesAction() {
  await requireAuthUserId();
  return listPublishedTutorProfiles();
}

export async function saveStudentProfileAction(data: {
  firstName: string;
  age?: number;
  educationLevel: string;
  institution: string;
  subjectsOfInterest: Subject[];
}) {
  const userId = await requireAuthUserId();
  const user = await ensureDbUser();
  if (!user || user.role !== "student") {
    throw new Error("Only students can save a student profile");
  }

  const validated = validateStudentProfileInput(data);
  await syncUserFirstName(userId, validated.firstName);

  const existing = await db.query.studentProfiles.findFirst({
    where: eq(studentProfiles.userId, userId),
  });

  if (existing) {
    const [updated] = await db
      .update(studentProfiles)
      .set({
        age: validated.age,
        educationLevel: validated.educationLevel,
        institution: validated.institution,
        subjectsOfInterest: validated.subjectsOfInterest,
        updatedAt: new Date(),
      })
      .where(eq(studentProfiles.userId, userId))
      .returning();

    revalidateAfterProfileSave("student");
    return mapStudentProfile(updated);
  }

  const [created] = await db
    .insert(studentProfiles)
    .values({
      userId,
      age: validated.age,
      educationLevel: validated.educationLevel,
      institution: validated.institution,
      subjectsOfInterest: validated.subjectsOfInterest,
    })
    .returning();

  revalidateAfterProfileSave("student");
  return mapStudentProfile(created);
}

export async function saveTutorProfileAction(data: {
  firstName: string;
  age?: number;
  subjects: Subject[];
  hourlyRate: number;
  format: Format;
  bio: string;
  availability: string;
  educationLevel: string;
  institution: string;
}) {
  const userId = await requireAuthUserId();
  const user = await ensureDbUser();
  if (!user || user.role !== "tutor") {
    throw new Error("Only tutors can save a tutor profile");
  }

  const validated = validateTutorProfileInput(data);
  const displayName = await syncUserFirstName(userId, validated.firstName);

  const existing = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, userId),
  });

  const payload = {
    name: displayName,
    age: validated.age,
    subjects: validated.subjects,
    hourlyRate: validated.hourlyRate,
    format: validated.format,
    bio: validated.bio,
    availability: validated.availability,
    educationLevel: validated.educationLevel,
    institution: validated.institution,
    updatedAt: new Date(),
  };

  if (existing) {
    const [updated] = await db
      .update(tutorProfiles)
      .set(payload)
      .where(eq(tutorProfiles.userId, userId))
      .returning();

    await syncTutorPublicName(userId, displayName);
    revalidateAfterProfileSave("tutor");
    return mapTutorProfile(updated);
  }

  const [created] = await db
    .insert(tutorProfiles)
    .values({ userId, ...payload })
    .returning();

  revalidateAfterProfileSave("tutor");
  return mapTutorProfile(created);
}

export async function updateUserDisplayNameAction(name: string) {
  const userId = await requireAuthUserId();
  const displayName = await syncUserFirstName(userId, name);
  await syncTutorPublicName(userId, displayName);
  revalidatePath("/", "layout");
}

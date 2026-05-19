"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { studentProfiles, tutorProfiles, users } from "@/db/schema";
import { ensureDbUser, requireAuthUserId } from "@/lib/auth";
import { listPublishedTutorProfiles } from "@/lib/data/dashboard";
import { mapStudentProfile, mapTutorProfile } from "@/lib/mappers";
import { assertValidSubjects } from "@/lib/subjects";
import type { Format, Subject } from "@/lib/types";

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

  assertValidSubjects(data.subjectsOfInterest);

  const existing = await db.query.studentProfiles.findFirst({
    where: eq(studentProfiles.userId, userId),
  });

  if (existing) {
    const [updated] = await db
      .update(studentProfiles)
      .set({
        age: data.age,
        educationLevel: data.educationLevel,
        institution: data.institution,
        subjectsOfInterest: data.subjectsOfInterest,
        updatedAt: new Date(),
      })
      .where(eq(studentProfiles.userId, userId))
      .returning();
    revalidatePath("/dashboard/student");
    return mapStudentProfile(updated);
  }

  const [created] = await db
    .insert(studentProfiles)
    .values({
      userId,
      age: data.age,
      educationLevel: data.educationLevel,
      institution: data.institution,
      subjectsOfInterest: data.subjectsOfInterest,
    })
    .returning();

  revalidatePath("/dashboard/student");
  return mapStudentProfile(created);
}

export async function saveTutorProfileAction(data: {
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

  assertValidSubjects(data.subjects);

  const existing = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, userId),
  });

  const payload = {
    name: user.name,
    age: data.age,
    subjects: data.subjects,
    hourlyRate: data.hourlyRate,
    format: data.format,
    bio: data.bio,
    availability: data.availability,
    educationLevel: data.educationLevel,
    institution: data.institution,
    updatedAt: new Date(),
  };

  if (existing) {
    const [updated] = await db
      .update(tutorProfiles)
      .set(payload)
      .where(eq(tutorProfiles.userId, userId))
      .returning();
    revalidatePath("/dashboard/tutor");
    revalidatePath("/dashboard/student");
    return mapTutorProfile(updated);
  }

  const [created] = await db
    .insert(tutorProfiles)
    .values({ userId, ...payload })
    .returning();

  revalidatePath("/dashboard/tutor");
  revalidatePath("/dashboard/student");
  return mapTutorProfile(created);
}

export async function updateUserDisplayNameAction(name: string) {
  const userId = await requireAuthUserId();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Name is required");

  await db
    .update(users)
    .set({ name: trimmed, updatedAt: new Date() })
    .where(eq(users.id, userId));

  const tutor = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, userId),
  });
  if (tutor) {
    await db
      .update(tutorProfiles)
      .set({ name: trimmed, updatedAt: new Date() })
      .where(eq(tutorProfiles.userId, userId));
  }

  revalidatePath("/", "layout");
}

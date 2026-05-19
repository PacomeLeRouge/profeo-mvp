import { redirect } from "next/navigation";
import { desc, eq, notLike } from "drizzle-orm";
import { db } from "@/db";
import {
  lessonRequests,
  studentProfiles,
  tutorProfiles,
  users,
} from "@/db/schema";
import { ensureDbUser, getOnboardingRedirectPath } from "@/lib/auth";
import { DEMO_SEED_USER_PREFIX } from "@/lib/demo-seed";
import { mapLessonRequest, mapStudentProfile, mapTutorProfile } from "@/lib/mappers";
import type { LessonRequest, Role, StudentProfile, TutorProfile, User } from "@/lib/types";

function mapUser(row: typeof users.$inferSelect): User & { email: string } {
  return {
    id: row.id,
    name: row.name,
    role: row.role as Role,
    email: row.email,
  };
}

export async function listPublishedTutorProfiles() {
  const rows = await db.query.tutorProfiles.findMany({
    where: notLike(tutorProfiles.userId, `${DEMO_SEED_USER_PREFIX}%`),
    orderBy: [desc(tutorProfiles.createdAt)],
  });
  return rows.map(mapTutorProfile);
}

async function listStudentRequests(studentUserId: string): Promise<LessonRequest[]> {
  const rows = await db.query.lessonRequests.findMany({
    where: eq(lessonRequests.studentUserId, studentUserId),
    orderBy: [desc(lessonRequests.createdAt)],
  });
  return rows.map(mapLessonRequest);
}

async function listTutorRequests(tutorProfileId: string): Promise<LessonRequest[]> {
  const rows = await db.query.lessonRequests.findMany({
    where: eq(lessonRequests.tutorProfileId, tutorProfileId),
    orderBy: [desc(lessonRequests.createdAt)],
  });
  return rows.map(mapLessonRequest);
}

export type StudentDashboardData = {
  user: User & { email: string };
  studentProfile: StudentProfile;
  tutors: TutorProfile[];
  requests: LessonRequest[];
};

export type TutorDashboardData = {
  user: User & { email: string };
  tutorProfile: TutorProfile;
  requests: LessonRequest[];
};

export async function loadStudentDashboard(): Promise<StudentDashboardData> {
  const row = await ensureDbUser();
  if (!row) redirect("/");

  const user = mapUser(row);

  if (user.role !== "student") {
    redirect(await getOnboardingRedirectPath());
  }

  const profileRow = await db.query.studentProfiles.findFirst({
    where: eq(studentProfiles.userId, user.id),
  });
  if (!profileRow) redirect("/onboarding/student");

  const [tutors, requests] = await Promise.all([
    listPublishedTutorProfiles(),
    listStudentRequests(user.id),
  ]);

  return {
    user,
    studentProfile: mapStudentProfile(profileRow),
    tutors,
    requests,
  };
}

export async function loadTutorDashboard(): Promise<TutorDashboardData> {
  const row = await ensureDbUser();
  if (!row) redirect("/");

  const user = mapUser(row);

  if (user.role !== "tutor") {
    redirect(await getOnboardingRedirectPath());
  }

  const profileRow = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, user.id),
  });
  if (!profileRow) redirect("/onboarding/tutor");

  const tutorProfile = mapTutorProfile(profileRow);
  const requests = await listTutorRequests(tutorProfile.id);

  return {
    user,
    tutorProfile,
    requests,
  };
}

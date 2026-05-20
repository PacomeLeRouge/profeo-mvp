"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { lessonRequests, studentProfiles, tutorProfiles, users } from "@/db/schema";
import { resolveContactEmail } from "@/lib/contact-email";
import { requireAuthUserId } from "@/lib/auth";
import {
  notifyStudentOfLessonRequestStatus,
  notifyTutorOfNewLessonRequest,
} from "@/lib/email/lesson-requests";
import { mapLessonRequest } from "@/lib/mappers";
import { isSubject } from "@/lib/subjects";
import type { Subject } from "@/lib/types";

export async function listMyLessonRequestsAction() {
  const userId = await requireAuthUserId();
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user?.role) return [];

  if (user.role === "student") {
    const rows = await db.query.lessonRequests.findMany({
      where: eq(lessonRequests.studentUserId, userId),
      orderBy: (r, { desc }) => [desc(r.createdAt)],
    });
    return rows.map(mapLessonRequest);
  }

  const tutor = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, userId),
  });
  if (!tutor) return [];

  const rows = await db.query.lessonRequests.findMany({
    where: eq(lessonRequests.tutorProfileId, tutor.id),
    orderBy: (r, { desc }) => [desc(r.createdAt)],
  });
  return rows.map(mapLessonRequest);
}

export async function createLessonRequestAction(data: {
  tutorProfileId: string;
  tutorName: string;
  subject: Subject;
}) {
  const userId = await requireAuthUserId();
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (user?.role !== "student") {
    throw new Error("Only students can create lesson requests");
  }

  const studentProfile = await db.query.studentProfiles.findFirst({
    where: eq(studentProfiles.userId, userId),
  });
  if (!studentProfile) {
    throw new Error("Complétez votre profil étudiant avant d'envoyer une demande");
  }

  const tutor = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.id, data.tutorProfileId),
  });
  if (!tutor) throw new Error("Tutor not found");

  const tutorUser = await db.query.users.findFirst({
    where: eq(users.id, tutor.userId),
  });
  if (!tutorUser?.email) throw new Error("Tuteur introuvable");
  if (tutor.userId === userId) throw new Error("Cannot request yourself");
  if (!isSubject(data.subject)) throw new Error(`Matière invalide : ${data.subject}`);
  if (!tutor.subjects.includes(data.subject)) {
    throw new Error("Ce tuteur n'enseigne pas cette matière");
  }

  const studentContactEmail = resolveContactEmail(
    studentProfile.contactEmail,
    user.email
  );
  const tutorContactEmail = resolveContactEmail(tutor.contactEmail, tutorUser.email);

  const [created] = await db
    .insert(lessonRequests)
    .values({
      studentUserId: userId,
      tutorProfileId: data.tutorProfileId,
      tutorName: tutor.name,
      studentName: user.name,
      studentContactEmail,
      tutorContactEmail,
      subject: data.subject,
    })
    .returning();

  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/tutor");

  void notifyTutorOfNewLessonRequest({
    tutorUserId: tutor.userId,
    tutorContactEmail,
    studentName: user.name,
    studentContactEmail,
    subject: data.subject,
  }).catch((err) => console.error("[email] notify tutor:", err));

  return mapLessonRequest(created);
}

export async function updateLessonRequestStatusAction(
  requestId: string,
  status: "Confirmed" | "Declined"
) {
  const userId = await requireAuthUserId();
  const tutor = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, userId),
  });
  if (!tutor) throw new Error("Tutor profile required");

  const [updated] = await db
    .update(lessonRequests)
    .set({ status })
    .where(
      and(
        eq(lessonRequests.id, requestId),
        eq(lessonRequests.tutorProfileId, tutor.id)
      )
    )
    .returning();

  if (!updated) throw new Error("Request not found");

  revalidatePath("/dashboard/tutor");
  revalidatePath("/dashboard/student");

  void notifyStudentOfLessonRequestStatus({
    studentContactEmail: updated.studentContactEmail,
    studentName: updated.studentName,
    tutorName: updated.tutorName,
    tutorContactEmail: updated.tutorContactEmail,
    subject: updated.subject as Subject,
    status,
  }).catch((err) => console.error("[email] notify student:", err));

  return mapLessonRequest(updated);
}

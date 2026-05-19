import { eq } from "drizzle-orm";
import { db } from "@/db";
import { tutorProfiles, users } from "@/db/schema";
import { sendEmail } from "@/lib/email/client";
import {
  lessonRequestStatusEmail,
  newLessonRequestEmail,
} from "@/lib/email/templates";
import { subjectTranslations } from "@/lib/subjects";
import type { Subject } from "@/lib/types";

const formatLabels: Record<string, string> = {
  Online: "En ligne",
  "In-person": "En personne",
  Both: "En ligne & présentiel",
};

export async function notifyTutorOfNewLessonRequest(params: {
  tutorUserId: string;
  studentUserId: string;
  subject: Subject;
}): Promise<void> {
  const [tutorUser, studentUser, tutorProfile] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, params.tutorUserId) }),
    db.query.users.findFirst({ where: eq(users.id, params.studentUserId) }),
    db.query.tutorProfiles.findFirst({ where: eq(tutorProfiles.userId, params.tutorUserId) }),
  ]);

  if (!tutorUser?.email || !studentUser || !tutorProfile) return;

  const subjectLabel = subjectTranslations[params.subject] ?? params.subject;
  const message = newLessonRequestEmail({
    tutorName: tutorUser.name,
    studentName: studentUser.name,
    subjectLabel,
    hourlyRate: tutorProfile.hourlyRate,
    formatLabel: formatLabels[tutorProfile.format] ?? tutorProfile.format,
    institution: tutorProfile.institution,
  });

  await sendEmail({
    to: tutorUser.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });
}

export async function notifyStudentOfLessonRequestStatus(params: {
  studentUserId: string;
  tutorUserId: string;
  subject: Subject;
  status: "Confirmed" | "Declined";
}): Promise<void> {
  const [studentUser, tutorUser] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, params.studentUserId) }),
    db.query.users.findFirst({ where: eq(users.id, params.tutorUserId) }),
  ]);

  if (!studentUser?.email || !tutorUser) return;

  const subjectLabel = subjectTranslations[params.subject] ?? params.subject;
  const message = lessonRequestStatusEmail({
    studentName: studentUser.name,
    tutorName: tutorUser.name,
    subjectLabel,
    status: params.status,
  });

  await sendEmail({
    to: studentUser.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });
}

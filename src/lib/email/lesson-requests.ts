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
  tutorContactEmail: string;
  studentName: string;
  studentContactEmail: string;
  subject: Subject;
}): Promise<void> {
  const [tutorUser, tutorProfile] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, params.tutorUserId) }),
    db.query.tutorProfiles.findFirst({ where: eq(tutorProfiles.userId, params.tutorUserId) }),
  ]);

  if (!tutorUser || !tutorProfile) return;

  const subjectLabel = subjectTranslations[params.subject] ?? params.subject;
  const message = newLessonRequestEmail({
    tutorName: tutorUser.name,
    studentName: params.studentName,
    studentContactEmail: params.studentContactEmail,
    subjectLabel,
    hourlyRate: tutorProfile.hourlyRate,
    formatLabel: formatLabels[tutorProfile.format] ?? tutorProfile.format,
    institution: tutorProfile.institution,
  });

  await sendEmail({
    to: params.tutorContactEmail,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });
}

export async function notifyStudentOfLessonRequestStatus(params: {
  studentContactEmail: string;
  studentName: string;
  tutorName: string;
  tutorContactEmail: string;
  subject: Subject;
  status: "Confirmed" | "Declined";
}): Promise<void> {
  const subjectLabel = subjectTranslations[params.subject] ?? params.subject;
  const message = lessonRequestStatusEmail({
    studentName: params.studentName,
    tutorName: params.tutorName,
    tutorContactEmail: params.tutorContactEmail,
    subjectLabel,
    status: params.status,
  });

  await sendEmail({
    to: params.studentContactEmail,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });
}

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { lessonRequests } from "@/db/schema";
import { notifyStudentOfLessonRequestStatus } from "@/lib/email/lesson-requests";
import { mapLessonRequest } from "@/lib/mappers";
import {
  verifyLessonRequestActionToken,
  type LessonRequestActionStatus,
} from "@/lib/lesson-request-token";
import { subjectTranslations } from "@/lib/subjects";
import type { LessonRequest, RequestStatus } from "@/lib/types";

export type LessonRequestStatusOutcome =
  | {
      ok: true;
      kind: "updated" | "unchanged";
      request: LessonRequest;
    }
  | {
      ok: false;
      code: "not_found" | "invalid_token" | "expired_token" | "forbidden";
      message: string;
    };

async function notifyStudentIfNeeded(
  row: typeof lessonRequests.$inferSelect,
  status: LessonRequestActionStatus
) {
  void notifyStudentOfLessonRequestStatus({
    studentContactEmail: row.studentContactEmail,
    studentName: row.studentName,
    tutorName: row.tutorName,
    tutorContactEmail: row.tutorContactEmail,
    subject: row.subject as LessonRequest["subject"],
    status,
  }).catch((err) => console.error("[email] notify student:", err));
}

async function applyStatusChange(
  requestId: string,
  status: LessonRequestActionStatus,
  whereExtra?: ReturnType<typeof eq>
): Promise<LessonRequestStatusOutcome> {
  const existing = await db.query.lessonRequests.findFirst({
    where: eq(lessonRequests.id, requestId),
  });

  if (!existing) {
    return {
      ok: false,
      code: "not_found",
      message: "Demande introuvable.",
    };
  }

  if (existing.status === status) {
    return {
      ok: true,
      kind: "unchanged",
      request: mapLessonRequest(existing),
    };
  }

  if (existing.status !== "Pending") {
    return {
      ok: true,
      kind: "unchanged",
      request: mapLessonRequest(existing),
    };
  }

  const conditions = [eq(lessonRequests.id, requestId), eq(lessonRequests.status, "Pending")];
  if (whereExtra) conditions.push(whereExtra);

  const [updated] = await db
    .update(lessonRequests)
    .set({ status })
    .where(and(...conditions))
    .returning();

  if (!updated) {
    const latest = await db.query.lessonRequests.findFirst({
      where: eq(lessonRequests.id, requestId),
    });
    if (!latest) {
      return {
        ok: false,
        code: "not_found",
        message: "Demande introuvable.",
      };
    }
    return {
      ok: true,
      kind: "unchanged",
      request: mapLessonRequest(latest),
    };
  }

  revalidatePath("/dashboard/tutor");
  revalidatePath("/dashboard/student");
  await notifyStudentIfNeeded(updated, status);

  return {
    ok: true,
    kind: "updated",
    request: mapLessonRequest(updated),
  };
}

export async function updateLessonRequestStatusForTutor(params: {
  requestId: string;
  status: LessonRequestActionStatus;
  tutorProfileId: string;
}): Promise<LessonRequestStatusOutcome> {
  return applyStatusChange(
    params.requestId,
    params.status,
    eq(lessonRequests.tutorProfileId, params.tutorProfileId)
  );
}

export async function respondToLessonRequestByEmailToken(params: {
  requestId: string;
  status: LessonRequestActionStatus;
  token: string;
}): Promise<LessonRequestStatusOutcome> {
  const verification = verifyLessonRequestActionToken(
    params.requestId,
    params.status,
    params.token
  );

  if (!verification.valid) {
    return {
      ok: false,
      code: verification.reason === "expired" ? "expired_token" : "invalid_token",
      message:
        verification.reason === "expired"
          ? "Ce lien a expiré. Connectez-vous à Clutch pour répondre depuis votre tableau de bord."
          : "Lien invalide ou déjà utilisé.",
    };
  }

  return applyStatusChange(params.requestId, params.status);
}

export function describeRequestStatus(status: RequestStatus): string {
  switch (status) {
    case "Pending":
      return "en attente";
    case "Confirmed":
      return "acceptée";
    case "Declined":
      return "refusée";
    default:
      return status;
  }
}

export function subjectLabelForRequest(request: LessonRequest): string {
  return subjectTranslations[request.subject] ?? request.subject;
}

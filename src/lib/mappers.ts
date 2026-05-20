import type {
  LessonRequest,
  StudentProfile,
  Subject,
  TutorProfile,
} from "@/lib/types";
import type {
  lessonRequests,
  studentProfiles,
  tutorProfiles,
} from "@/db/schema";

type DbTutor = typeof tutorProfiles.$inferSelect;
type DbStudent = typeof studentProfiles.$inferSelect;
type DbRequest = typeof lessonRequests.$inferSelect;

export function mapTutorProfile(row: DbTutor): TutorProfile {
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    contactEmail: row.contactEmail,
    age: row.age ?? undefined,
    subjects: row.subjects as Subject[],
    hourlyRate: row.hourlyRate,
    format: row.format,
    bio: row.bio,
    availability: row.availability,
    educationLevel: row.educationLevel,
    institution: row.institution,
  };
}

export function mapStudentProfile(row: DbStudent): StudentProfile {
  return {
    id: row.id,
    userId: row.userId,
    contactEmail: row.contactEmail,
    age: row.age ?? undefined,
    educationLevel: row.educationLevel,
    institution: row.institution,
    subjectsOfInterest: row.subjectsOfInterest as Subject[],
  };
}

export function mapLessonRequest(row: DbRequest): LessonRequest {
  return {
    id: row.id,
    studentId: row.studentUserId,
    tutorId: row.tutorProfileId,
    tutorName: row.tutorName,
    studentName: row.studentName,
    studentContactEmail: row.studentContactEmail,
    tutorContactEmail: row.tutorContactEmail,
    subject: row.subject as Subject,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

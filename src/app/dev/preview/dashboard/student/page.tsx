"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StudentDashboardView } from "@/components/dashboard/student/StudentDashboardView";
import { mockTutors } from "@/lib/store/mockData";
import type { Subject } from "@/lib/subjects";
import type { LessonRequest, TutorProfile } from "@/lib/types";

const previewUser = {
  id: "preview_student",
  name: "Étudiant Preview",
};

const initialPreviewRequests: LessonRequest[] = [
  {
    id: "preview_req_1",
    studentId: previewUser.id,
    tutorId: "t1",
    tutorName: "Alice Dubois",
    subject: "Math",
    status: "Pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "preview_req_2",
    studentId: previewUser.id,
    tutorId: "t3",
    tutorName: "Catherine Leroy",
    subject: "Chemistry",
    status: "Confirmed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

export default function DevStudentDashboardPreviewPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<LessonRequest[]>(initialPreviewRequests);

  const handleSendRequest = async ({
    tutor,
    subject,
  }: {
    tutor: TutorProfile;
    subject: Subject;
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 250));

    setRequests((current) => [
      {
        id: `preview_req_${Date.now()}`,
        studentId: previewUser.id,
        tutorId: tutor.id,
        tutorName: tutor.name,
        subject,
        status: "Pending",
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
  };

  return (
    <StudentDashboardView
      preview
      tutors={mockTutors}
      user={previewUser}
      requests={requests}
      onEditProfile={() => router.push("/dev/preview/student")}
      onSendRequest={handleSendRequest}
    />
  );
}

"use client";

import { useRouter } from "next/navigation";
import { createLessonRequestAction } from "@/app/actions/requests";
import { useAppData } from "@/hooks/use-app-data";
import { StudentDashboardView } from "@/components/dashboard/student/StudentDashboardView";
import type { Subject } from "@/lib/subjects";

export default function StudentDashboard() {
  const { tutors, user, requests, isLoading, refresh } = useAppData();
  const router = useRouter();

  if (isLoading || !user) return null;

  return (
    <StudentDashboardView
      tutors={tutors}
      user={user}
      requests={requests}
      isLoading={isLoading}
      onEditProfile={() => router.push("/onboarding/student")}
      onSendRequest={async ({ tutor, subject }) => {
        await createLessonRequestAction({
          tutorProfileId: tutor.id,
          tutorName: tutor.name,
          subject: subject as Subject,
        });
        await refresh();
      }}
    />
  );
}

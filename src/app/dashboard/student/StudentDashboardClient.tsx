"use client";

import { useRouter } from "next/navigation";
import { createLessonRequestAction } from "@/app/actions/requests";
import { refreshStudentDashboardAction } from "@/app/actions/dashboard";
import { StudentDashboardView } from "@/components/dashboard/student/StudentDashboardView";
import type { StudentDashboardData } from "@/lib/data/dashboard";
import type { Subject } from "@/lib/subjects";
import { useState } from "react";

type Props = {
  initialData: StudentDashboardData;
};

export function StudentDashboardClient({ initialData }: Props) {
  const router = useRouter();
  const [data, setData] = useState(initialData);

  const refresh = async () => {
    const next = await refreshStudentDashboardAction();
    setData(next);
    router.refresh();
  };

  return (
    <StudentDashboardView
      tutors={data.tutors}
      user={data.user}
      requests={data.requests}
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

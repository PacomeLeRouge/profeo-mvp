"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateLessonRequestStatusAction } from "@/app/actions/requests";
import { refreshTutorDashboardAction } from "@/app/actions/dashboard";
import { TutorDashboardView } from "@/components/dashboard/tutor/TutorDashboardView";
import type { TutorDashboardData } from "@/lib/data/dashboard";

type Props = {
  initialData: TutorDashboardData;
};

export function TutorDashboardClient({ initialData }: Props) {
  const router = useRouter();
  const [data, setData] = useState(initialData);

  const refresh = async () => {
    const next = await refreshTutorDashboardAction();
    setData(next);
    router.refresh();
  };

  return (
    <TutorDashboardView
      user={data.user}
      tutorProfile={data.tutorProfile}
      requests={data.requests}
      onEditProfile={() => router.push("/onboarding/tutor")}
      onUpdateRequestStatus={async (id, status) => {
        await updateLessonRequestStatusAction(id, status);
        await refresh();
      }}
    />
  );
}

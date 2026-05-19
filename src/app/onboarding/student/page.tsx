"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveStudentProfileAction } from "@/app/actions/profiles";
import { useAppData } from "@/hooks/use-app-data";
import { StudentOnboardingFlow } from "@/components/onboarding/StudentOnboardingFlow";

function StudentOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, studentProfile, isLoading } = useAppData();
  const source = searchParams.get("source");
  const roleSelectionHref = source ? `/role-selection?source=${source}` : "/role-selection";

  if (isLoading || !user) return null;

  return (
    <StudentOnboardingFlow
      exitHref={studentProfile ? `/dashboard/${user.role}` : roleSelectionHref}
      initialFirstName={user.name}
      initialProfile={studentProfile}
      onSubmit={async (data) => {
        await saveStudentProfileAction(data);
        router.refresh();
        router.push("/dashboard/student");
      }}
    />
  );
}

export default function StudentOnboarding() {
  return (
    <Suspense fallback={null}>
      <StudentOnboardingContent />
    </Suspense>
  );
}

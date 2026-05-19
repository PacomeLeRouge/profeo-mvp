"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveTutorProfileAction } from "@/app/actions/profiles";
import { useAppData } from "@/hooks/use-app-data";
import { TutorOnboardingFlow } from "@/components/onboarding/TutorOnboardingFlow";

function TutorOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, tutorProfile, isLoading } = useAppData();
  const source = searchParams.get("source");
  const roleSelectionHref = source ? `/role-selection?source=${source}` : "/role-selection";

  if (isLoading || !user) return null;

  return (
    <TutorOnboardingFlow
      exitHref={tutorProfile ? `/dashboard/${user.role}` : roleSelectionHref}
      initialProfile={tutorProfile}
      onSubmit={async (data) => {
        await saveTutorProfileAction(data);
        router.push("/dashboard/tutor");
      }}
    />
  );
}

export default function TutorOnboarding() {
  return (
    <Suspense fallback={null}>
      <TutorOnboardingContent />
    </Suspense>
  );
}

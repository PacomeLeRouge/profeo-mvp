"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveTutorProfileAction } from "@/app/actions/profiles";
import { useAppData } from "@/hooks/use-app-data";
import { OnboardingPageGate } from "@/components/onboarding/OnboardingPageGate";
import { TutorOnboardingFlow } from "@/components/onboarding/TutorOnboardingFlow";

function TutorOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, tutorProfile, isLoading, error } = useAppData();
  const source = searchParams.get("source");
  const roleSelectionHref = source ? `/role-selection?source=${source}` : "/role-selection";

  return (
    <OnboardingPageGate isLoading={isLoading} error={error} ready={!!user}>
    {user ? (
    <TutorOnboardingFlow
      exitHref={tutorProfile ? `/dashboard/${user.role}` : roleSelectionHref}
      accountEmail={user.email ?? ""}
      initialFirstName={user.name}
      initialProfile={tutorProfile}
      onSubmit={async (data) => {
        await saveTutorProfileAction(data);
        router.refresh();
        router.push("/dashboard/tutor");
      }}
    />
    ) : null}
    </OnboardingPageGate>
  );
}

export default function TutorOnboarding() {
  return (
    <Suspense fallback={null}>
      <TutorOnboardingContent />
    </Suspense>
  );
}

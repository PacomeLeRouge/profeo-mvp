"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveStudentProfileAction } from "@/app/actions/profiles";
import { useAppData } from "@/hooks/use-app-data";
import { OnboardingPageGate } from "@/components/onboarding/OnboardingPageGate";
import { StudentOnboardingFlow } from "@/components/onboarding/StudentOnboardingFlow";

function StudentOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, studentProfile, isLoading, error } = useAppData();
  const source = searchParams.get("source");
  const roleSelectionHref = source ? `/role-selection?source=${source}` : "/role-selection";

  return (
    <OnboardingPageGate isLoading={isLoading} error={error} ready={!!user}>
    {user ? (
    <StudentOnboardingFlow
      exitHref={studentProfile ? `/dashboard/${user.role}` : roleSelectionHref}
      accountEmail={user.email ?? ""}
      initialFirstName={user.name}
      initialProfile={studentProfile}
      onSubmit={async (data) => {
        await saveStudentProfileAction(data);
        router.refresh();
        router.push("/dashboard/student");
      }}
    />
    ) : null}
    </OnboardingPageGate>
  );
}

export default function StudentOnboarding() {
  return (
    <Suspense fallback={null}>
      <StudentOnboardingContent />
    </Suspense>
  );
}

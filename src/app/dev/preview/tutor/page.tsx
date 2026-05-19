"use client";

import { TutorOnboardingFlow } from "@/components/onboarding/TutorOnboardingFlow";

export default function DevTutorPreviewPage() {
  return (
    <TutorOnboardingFlow
      preview
      exitHref="/dev"
      onSubmit={async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }}
    />
  );
}

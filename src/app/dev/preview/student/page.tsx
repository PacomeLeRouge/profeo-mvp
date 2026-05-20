"use client";

import { StudentOnboardingFlow } from "@/components/onboarding/StudentOnboardingFlow";

export default function DevStudentPreviewPage() {
  return (
    <StudentOnboardingFlow
      preview
      exitHref="/dev"
      accountEmail="preview@clutch.dev"
      onSubmit={async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }}
    />
  );
}

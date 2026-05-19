"use client";

import { AnimatedTitle } from "@/components/onboarding/AnimatedTitle";

type OnboardingStepTitleProps = {
  step: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function OnboardingStepTitle({ step, ...props }: OnboardingStepTitleProps) {
  return <AnimatedTitle stepKey={step} {...props} />;
}

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Subject, StudentProfile } from "@/lib/types";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OnboardingStepPanel } from "@/components/onboarding/OnboardingStepPanel";
import { AnimatedTitle } from "@/components/onboarding/AnimatedTitle";
import { AnimatedNumberField } from "@/components/onboarding/AnimatedNumberField";
import { InstitutionAutocomplete } from "@/components/onboarding/InstitutionAutocomplete";
import { ChoiceChipGroup } from "@/components/onboarding/ChoiceChip";
import { DevPreviewBanner } from "@/components/onboarding/DevPreviewBanner";
import { SUBJECTS, subjectTranslations } from "@/lib/subjects";
import { studentEducationLevels } from "@/components/onboarding/onboarding-shared";
import { Button } from "@/components/ui/button";

const totalSteps = 4;

type StudentOnboardingFlowProps = {
  preview?: boolean;
  exitHref: string;
  initialProfile?: StudentProfile | null;
  onSubmit: (data: {
    age?: number;
    educationLevel: string;
    institution: string;
    subjectsOfInterest: Subject[];
  }) => Promise<void>;
};

export function StudentOnboardingFlow({
  preview = false,
  exitHref,
  initialProfile = null,
  onSubmit,
}: StudentOnboardingFlowProps) {
  const router = useRouter();
  const directionRef = useRef<1 | -1>(1);
  const isEditing = !!initialProfile && !preview;

  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [age, setAge] = useState(initialProfile?.age ? String(initialProfile.age) : "");
  const [educationLevel, setEducationLevel] = useState(initialProfile?.educationLevel || "");
  const [institution, setInstitution] = useState(initialProfile?.institution || "");
  const [subjects, setSubjects] = useState<Subject[]>(initialProfile?.subjectsOfInterest || []);

  const handleSubjectToggle = (subject: string) => {
    const typedSubject = subject as Subject;
    setSubjects((prev) =>
      prev.includes(typedSubject)
        ? prev.filter((s) => s !== typedSubject)
        : [...prev, typedSubject]
    );
  };

  const handleNext = () => {
    directionRef.current = 1;
    setStep((current) => Math.min(current + 1, totalSteps));
  };

  const handleBack = () => {
    if (step === 1) {
      router.push(exitHref);
      return;
    }
    directionRef.current = -1;
    setStep((current) => Math.max(current - 1, 1));
  };

  const handleSubmit = async () => {
    await onSubmit({
      age: age ? Number(age) : undefined,
      educationLevel,
      institution,
      subjectsOfInterest: subjects,
    });

    if (preview) {
      setCompleted(true);
      return;
    }
  };

  const handleRestartPreview = () => {
    setCompleted(false);
    setStep(1);
    setAge("");
    setEducationLevel("");
    setInstitution("");
    setSubjects([]);
    directionRef.current = 1;
  };

  const canContinue =
    (step === 1 && !!age) ||
    (step === 2 && !!educationLevel) ||
    (step === 3 && !!institution.trim()) ||
    (step === 4 && subjects.length > 0);

  if (completed) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-black">
        {preview ? <DevPreviewBanner /> : null}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="max-w-lg space-y-6">
            <p className="text-sm uppercase tracking-[0.25em] text-black/40">Preview terminée</p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Onboarding étudiant complété
            </h1>
            <p className="text-lg text-black/55">
              En mode dev, rien n&apos;a été enregistré. Relancez le parcours pour retester les animations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button onClick={handleRestartPreview} className="h-12 rounded-full px-8">
                Recommencer
              </Button>
              <Button variant="ghost" onClick={() => router.push("/dev")} className="h-12 rounded-full px-8">
                Hub dev
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {preview ? <DevPreviewBanner /> : null}
      <OnboardingShell
        brandHref={exitHref}
        headerLabel={
          preview
            ? `Preview · Étape ${step} sur ${totalSteps}`
            : isEditing
              ? "Modification du profil"
              : `Étape ${step} sur ${totalSteps}`
        }
        step={step}
        totalSteps={totalSteps}
        canContinue={canContinue}
        isLastStep={step === totalSteps}
        isEditing={isEditing}
        submitLabel={preview ? "Terminer (preview)" : undefined}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        className="min-h-0 flex-1"
      >
        {step === 1 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <AnimatedTitle stepKey={step} eyebrow="Profil étudiant" title="Votre âge ?" />
            <AnimatedNumberField
              label="Votre âge"
              placeholder="18"
              unit="ans"
              min={16}
              max={99}
              step={1}
              value={age}
              onChange={setAge}
              aria-label="Votre âge"
            />
          </OnboardingStepPanel>
        )}

        {step === 2 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <AnimatedTitle stepKey={step} eyebrow="Profil étudiant" title="Votre niveau d'études ?" />
            <ChoiceChipGroup
              stepKey={step}
              options={studentEducationLevels}
              value={educationLevel}
              onChange={setEducationLevel}
            />
          </OnboardingStepPanel>
        )}

        {step === 3 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <AnimatedTitle stepKey={step} eyebrow="Profil étudiant" title="Votre établissement ?" />
            <InstitutionAutocomplete
              value={institution}
              onChange={setInstitution}
              aria-label="Votre établissement"
            />
          </OnboardingStepPanel>
        )}

        {step === 4 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <AnimatedTitle
              stepKey={step}
              eyebrow="Profil étudiant"
              title="Sur quelles matières avez-vous besoin d'aide ?"
            />
            <ChoiceChipGroup
              stepKey={step}
              options={SUBJECTS.map((subject) => ({
                value: subject,
                label: subjectTranslations[subject],
              }))}
              value={subjects}
              onChange={handleSubjectToggle}
              multiple
            />
          </OnboardingStepPanel>
        )}
      </OnboardingShell>
    </div>
  );
}

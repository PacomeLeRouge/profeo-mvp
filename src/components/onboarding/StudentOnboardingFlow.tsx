"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Subject, StudentProfile } from "@/lib/types";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OnboardingStepPanel } from "@/components/onboarding/OnboardingStepPanel";
import { OnboardingStepTitle } from "@/components/onboarding/OnboardingStepTitle";
import { AnimatedNumberField } from "@/components/onboarding/AnimatedNumberField";
import { AnimatedTextField } from "@/components/onboarding/AnimatedTextField";
import { InstitutionAutocomplete } from "@/components/onboarding/InstitutionAutocomplete";
import { ChoiceChipGroup } from "@/components/onboarding/ChoiceChip";
import { DevPreviewBanner } from "@/components/onboarding/DevPreviewBanner";
import { SUBJECTS, subjectTranslations } from "@/lib/subjects";
import { studentEducationLevels } from "@/components/onboarding/onboarding-shared";
import { Button } from "@/components/ui/button";
import { onboardingThemeClass } from "@/lib/onboarding-theme";
import { getOnboardingSymbol, getOnboardingSymbolAlt } from "@/lib/onboarding-symbols";
import { cn } from "@/lib/utils";

const totalSteps = 5;

type StudentOnboardingFlowProps = {
  preview?: boolean;
  exitHref: string;
  initialFirstName?: string;
  initialProfile?: StudentProfile | null;
  onSubmit: (data: {
    firstName: string;
    age?: number;
    educationLevel: string;
    institution: string;
    subjectsOfInterest: Subject[];
  }) => Promise<void>;
};

export function StudentOnboardingFlow({
  preview = false,
  exitHref,
  initialFirstName = "",
  initialProfile = null,
  onSubmit,
}: StudentOnboardingFlowProps) {
  const router = useRouter();
  const directionRef = useRef<1 | -1>(1);
  const isEditing = !!initialProfile && !preview;

  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [firstName, setFirstName] = useState(initialFirstName);
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
      firstName: firstName.trim(),
      age: age ? Number(age) : undefined,
      educationLevel,
      institution,
      subjectsOfInterest: subjects,
    });

    if (preview) {
      setCompleted(true);
    }
  };

  const handleRestartPreview = () => {
    setCompleted(false);
    setStep(1);
    setFirstName(initialFirstName);
    setAge("");
    setEducationLevel("");
    setInstitution("");
    setSubjects([]);
    directionRef.current = 1;
  };

  const canContinue =
    (step === 1 && firstName.trim().length >= 2) ||
    (step === 2 && !!age) ||
    (step === 3 && !!educationLevel) ||
    (step === 4 && !!institution.trim()) ||
    (step === 5 && subjects.length > 0);

  if (completed) {
    return (
      <div className={cn(onboardingThemeClass, "flex min-h-screen flex-col")}>
        {preview ? <DevPreviewBanner /> : null}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="max-w-lg space-y-6">
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Preview terminée</p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Onboarding étudiant complété
            </h1>
            <p className="text-lg text-muted-foreground">
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
    <div className={cn(onboardingThemeClass, "flex min-h-screen flex-col")}>
      {preview ? <DevPreviewBanner /> : null}
      <OnboardingShell
        step={step}
        totalSteps={totalSteps}
        symbolSrc={getOnboardingSymbol("student", step)}
        symbolAlt={getOnboardingSymbolAlt("student", step)}
        stepLabel={
          preview
            ? `Preview · Étape ${step} sur ${totalSteps}`
            : isEditing
              ? "Modification du profil"
              : undefined
        }
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
            <OnboardingStepTitle
              step={step}
              eyebrow="Profil étudiant"
              title="Comment vous appelez-vous ?"
              subtitle="Votre prénom sera visible par les tuteurs."
            />
            <AnimatedTextField
              label="Votre prénom"
              placeholder="Alex"
              value={firstName}
              onChange={setFirstName}
              hint="Au moins 2 caractères."
              aria-label="Votre prénom"
            />
          </OnboardingStepPanel>
        )}

        {step === 2 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <OnboardingStepTitle step={step} eyebrow="Profil étudiant" title="Votre âge ?" />
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

        {step === 3 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <OnboardingStepTitle step={step} eyebrow="Profil étudiant" title="Votre niveau d'études ?" />
            <ChoiceChipGroup
              stepKey={step}
              options={studentEducationLevels}
              value={educationLevel}
              onChange={setEducationLevel}
            />
          </OnboardingStepPanel>
        )}

        {step === 4 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <OnboardingStepTitle step={step} eyebrow="Profil étudiant" title="Votre établissement ?" />
            <InstitutionAutocomplete
              value={institution}
              onChange={setInstitution}
              aria-label="Votre établissement"
            />
          </OnboardingStepPanel>
        )}

        {step === 5 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <OnboardingStepTitle
              step={step}
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

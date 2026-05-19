"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Subject, Format, TutorProfile } from "@/lib/types";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OnboardingStepPanel } from "@/components/onboarding/OnboardingStepPanel";
import { OnboardingStepTitle } from "@/components/onboarding/OnboardingStepTitle";
import { AnimatedNumberField } from "@/components/onboarding/AnimatedNumberField";
import { AnimatedTextField } from "@/components/onboarding/AnimatedTextField";
import { InstitutionAutocomplete } from "@/components/onboarding/InstitutionAutocomplete";
import { ChoiceChipGroup } from "@/components/onboarding/ChoiceChip";
import { AvailabilityGrid } from "@/components/onboarding/AvailabilityGrid";
import { DevPreviewBanner } from "@/components/onboarding/DevPreviewBanner";
import { SUBJECTS, subjectTranslations } from "@/lib/subjects";
import { tutorEducationLevels } from "@/components/onboarding/onboarding-shared";
import { Button } from "@/components/ui/button";
import { onboardingThemeClass } from "@/lib/onboarding-theme";
import { getOnboardingSymbol, getOnboardingSymbolAlt } from "@/lib/onboarding-symbols";
import { cn } from "@/lib/utils";

const totalSteps = 8;

type TutorOnboardingFlowProps = {
  preview?: boolean;
  exitHref: string;
  initialFirstName?: string;
  initialProfile?: TutorProfile | null;
  onSubmit: (data: {
    firstName: string;
    age?: number;
    subjects: Subject[];
    hourlyRate: number;
    format: Format;
    bio: string;
    availability: string;
    educationLevel: string;
    institution: string;
  }) => Promise<void>;
};

export function TutorOnboardingFlow({
  preview = false,
  exitHref,
  initialFirstName = "",
  initialProfile = null,
  onSubmit,
}: TutorOnboardingFlowProps) {
  const router = useRouter();
  const directionRef = useRef<1 | -1>(1);
  const isEditing = !!initialProfile && !preview;

  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [firstName, setFirstName] = useState(initialFirstName || initialProfile?.name || "");
  const [age, setAge] = useState(initialProfile?.age ? String(initialProfile.age) : "");
  const [educationLevel, setEducationLevel] = useState(initialProfile?.educationLevel || "");
  const [institution, setInstitution] = useState(initialProfile?.institution || "");
  const [subjects, setSubjects] = useState<Subject[]>(initialProfile?.subjects || []);
  const [hourlyRate, setHourlyRate] = useState(
    initialProfile?.hourlyRate ? String(initialProfile.hourlyRate) : ""
  );
  const [format, setFormat] = useState<Format>(initialProfile?.format || "Online");
  const [selectedSlots, setSelectedSlots] = useState<string[]>(
    initialProfile?.availability
      ? initialProfile.availability.includes(" • ")
        ? initialProfile.availability.split(" • ")
        : initialProfile.availability === "Non précisé"
          ? []
          : [initialProfile.availability]
      : []
  );

  const handleSubjectToggle = (subject: string) => {
    const typedSubject = subject as Subject;
    setSubjects((prev) =>
      prev.includes(typedSubject)
        ? prev.filter((s) => s !== typedSubject)
        : [...prev, typedSubject]
    );
  };

  const handleSlotToggle = (day: string, time: string) => {
    const slot = `${day} ${time}`;
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
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
    const availability =
      selectedSlots.length > 0 ? selectedSlots.join(" • ") : "Non précisé";

    await onSubmit({
      firstName: firstName.trim(),
      age: age ? Number(age) : undefined,
      subjects,
      hourlyRate: Number(hourlyRate),
      format,
      bio: initialProfile?.bio ?? "",
      availability,
      educationLevel,
      institution,
    });

    if (preview) {
      setCompleted(true);
    }
  };

  const handleRestartPreview = () => {
    setCompleted(false);
    setStep(1);
    setFirstName(initialFirstName || initialProfile?.name || "");
    setAge("");
    setEducationLevel("");
    setInstitution("");
    setSubjects([]);
    setHourlyRate("");
    setFormat("Online");
    setSelectedSlots([]);
    directionRef.current = 1;
  };

  const canContinue =
    (step === 1 && firstName.trim().length >= 2) ||
    (step === 2 && !!age) ||
    (step === 3 && !!educationLevel) ||
    (step === 4 && !!institution.trim()) ||
    (step === 5 && subjects.length > 0) ||
    (step === 6 && !!hourlyRate) ||
    (step === 7 && !!format) ||
    (step === 8 && selectedSlots.length > 0);

  if (completed) {
    return (
      <div className={cn(onboardingThemeClass, "flex min-h-screen flex-col")}>
        <DevPreviewBanner />
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="max-w-lg space-y-6">
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Preview terminée</p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Onboarding tuteur complété
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
        symbolSrc={getOnboardingSymbol("tutor", step)}
        symbolAlt={getOnboardingSymbolAlt("tutor", step)}
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
        submitLabel={preview ? "Terminer (preview)" : isEditing ? "Enregistrer" : "Publier mon profil"}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        className="min-h-0 flex-1"
      >
        {step === 1 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <OnboardingStepTitle
              step={step}
              eyebrow="Profil tuteur"
              title="Comment vous appelez-vous ?"
              subtitle="Votre prénom sera affiché sur votre profil public."
            />
            <AnimatedTextField
              label="Votre prénom"
              placeholder="Sam"
              value={firstName}
              onChange={setFirstName}
              hint="Au moins 2 caractères."
              aria-label="Votre prénom"
            />
          </OnboardingStepPanel>
        )}

        {step === 2 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <OnboardingStepTitle
              step={step} eyebrow="Profil tuteur" title="Quel âge avez-vous ?" />
            <AnimatedNumberField
              label="Votre âge"
              placeholder="22"
              unit="ans"
              min={18}
              max={99}
              step={1}
              value={age}
              onChange={setAge}
              aria-label="Quel âge avez-vous"
            />
          </OnboardingStepPanel>
        )}

        {step === 3 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <OnboardingStepTitle
              step={step}
              eyebrow="Profil tuteur"
              title="Quel est votre niveau d'études ?"
            />
            <ChoiceChipGroup
              stepKey={step}
              options={tutorEducationLevels}
              value={educationLevel}
              onChange={setEducationLevel}
            />
          </OnboardingStepPanel>
        )}

        {step === 4 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <OnboardingStepTitle
              step={step}
              eyebrow="Profil tuteur"
              title="Dans quel établissement étudiez-vous ?"
            />
            <InstitutionAutocomplete
              value={institution}
              onChange={setInstitution}
              aria-label="Dans quel établissement étudiez-vous"
            />
          </OnboardingStepPanel>
        )}

        {step === 5 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <OnboardingStepTitle
              step={step}
              eyebrow="Profil tuteur"
              title="Quelles matières souhaitez-vous enseigner ?"
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

        {step === 6 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <OnboardingStepTitle
              step={step}
              eyebrow="Profil tuteur"
              title="Quel tarif horaire souhaitez-vous ?"
            />
            <AnimatedNumberField
              label="Tarif horaire"
              placeholder="20"
              suffix="€ / heure"
              min={5}
              max={200}
              step={5}
              allowDecimal
              value={hourlyRate}
              onChange={setHourlyRate}
              hint="Montant en euros par heure"
              aria-label="Quel tarif horaire souhaitez-vous"
            />
          </OnboardingStepPanel>
        )}

        {step === 7 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <OnboardingStepTitle
              step={step}
              eyebrow="Profil tuteur"
              title="Sous quel format souhaitez-vous enseigner ?"
            />
            <ChoiceChipGroup
              stepKey={step}
              options={[
                { value: "Online", label: "En ligne uniquement" },
                { value: "In-person", label: "En personne uniquement" },
                { value: "Both", label: "Les deux (en ligne et en personne)" },
              ]}
              value={format}
              onChange={(value) => setFormat(value as Format)}
            />
          </OnboardingStepPanel>
        )}

        {step === 8 && (
          <OnboardingStepPanel stepKey={step} direction={directionRef.current}>
            <OnboardingStepTitle
              step={step}
              eyebrow="Profil tuteur"
              title="Quand êtes-vous généralement disponible ?"
              subtitle="Sélectionnez un ou plusieurs créneaux habituels."
            />
            <AvailabilityGrid
              stepKey={step}
              selectedSlots={selectedSlots}
              onToggle={handleSlotToggle}
              onSetSlots={setSelectedSlots}
            />
          </OnboardingStepPanel>
        )}
      </OnboardingShell>
    </div>
  );
}

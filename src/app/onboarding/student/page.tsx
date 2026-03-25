"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Subject } from "@/lib/types";

// Translation map for subjects
const subjectTranslations: Record<Subject, string> = {
  'Math': 'Mathématiques',
  'English': 'Anglais',
  'Science': 'Sciences',
  'History': 'Histoire',
  'Physics': 'Physique',
  'Computer Science': 'Informatique'
};

const studentSteps = [
  "Âge",
  "Niveau d'études",
  "Établissement",
  "Matières"
] as const;

const educationLevels = ["Lycée", "Licence", "Master", "Doctorat", "Autre"] as const;

function StudentOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateStudentProfile, studentProfile } = useStore();
  const source = searchParams.get("source");
  const roleSelectionHref = source ? `/role-selection?source=${source}` : "/role-selection";
  
  const isEditing = !!studentProfile;
  
  const [step, setStep] = useState(1);
  const [age, setAge] = useState(studentProfile?.age ? String(studentProfile.age) : "");
  const [educationLevel, setEducationLevel] = useState(studentProfile?.educationLevel || "");
  const [institution, setInstitution] = useState(studentProfile?.institution || "");
  const [subjects, setSubjects] = useState<Subject[]>(studentProfile?.subjectsOfInterest || []);
  const totalSteps = studentSteps.length;

  const handleSubjectToggle = (subject: Subject) => {
    setSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleNext = () => {
    setStep((current) => Math.min(current + 1, totalSteps));
  };

  const handleBack = () => {
    setStep((current) => Math.max(current - 1, 1));
  };

  const handleSubmit = () => {
    if (!user) return;
    
    updateStudentProfile({
      age: age ? Number(age) : undefined,
      educationLevel,
      institution,
      subjectsOfInterest: subjects,
    });
    
    router.push("/dashboard/student");
  };

  const canContinue =
    (step === 1 && !!age) ||
    (step === 2 && !!educationLevel) ||
    (step === 3 && !!institution.trim()) ||
    (step === 4 && subjects.length > 0);

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <div className="flex items-center justify-between px-8 py-6 md:px-12">
        <button
          type="button"
          onClick={() => router.push(isEditing ? `/dashboard/${user.role}` : roleSelectionHref)}
          className="text-2xl font-bold tracking-tight"
        >
          profeo
        </button>
        <span className="text-sm font-medium text-black/50">
          {isEditing ? "Modification du profil" : `Étape ${step} sur ${totalSteps}`}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center md:px-12">
        {step === 1 && (
          <div className="w-full max-w-3xl space-y-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-black/40">Profil étudiant</p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-[4.5rem]">Votre âge ?</h1>
            </div>
            <div className="mx-auto max-w-md">
              <Input
                type="number"
                placeholder="Taper ici"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                aria-label="Votre âge"
                inputMode="numeric"
                className="h-24 rounded-none border-0 border-b-2 border-black/15 px-0 text-center text-4xl font-medium shadow-none placeholder:text-black/20 focus-visible:border-black focus-visible:ring-0 md:text-5xl"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-5xl space-y-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-black/40">Profil étudiant</p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-[4.5rem]">Votre niveau d&apos;études ?</h1>
            </div>
            <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4">
              {educationLevels.map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant="ghost"
                  onClick={() => setEducationLevel(level)}
                  className={`min-h-14 rounded-full border px-7 py-4 text-lg transition-colors focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 ${
                    educationLevel === level
                      ? "border-black bg-black text-white hover:bg-black hover:text-white"
                      : "border-black/15 bg-transparent text-black hover:bg-black/5"
                  }`}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-4xl space-y-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-black/40">Profil étudiant</p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-[4.5rem]">Votre établissement ?</h1>
            </div>
            <div className="mx-auto max-w-2xl">
              <Input
                type="text"
                placeholder="Taper ici"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                aria-label="Votre établissement"
                className="h-24 rounded-none border-0 border-b-2 border-black/15 px-0 text-center text-3xl font-medium shadow-none placeholder:text-black/20 focus-visible:border-black focus-visible:ring-0 md:text-4xl"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="w-full max-w-5xl space-y-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-black/40">Profil étudiant</p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-[4.5rem]">Sur quelles matières avez-vous besoin d&apos;aide ?</h1>
            </div>
            <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4">
              {(['Math', 'English', 'Science', 'History', 'Physics', 'Computer Science'] as Subject[]).map((subject) => (
                <Button
                  key={subject}
                  type="button"
                  variant="ghost"
                  onClick={() => handleSubjectToggle(subject)}
                  className={`min-h-14 rounded-full border px-7 py-4 text-lg transition-colors focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 ${
                    subjects.includes(subject)
                      ? "border-black bg-black text-white hover:bg-black hover:text-white"
                      : "border-black/15 bg-transparent text-black hover:bg-black/5"
                  }`}
                >
                  {subjectTranslations[subject]}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-12 pt-4 md:px-12 md:pb-14">
        <div className="mx-auto flex max-w-4xl flex-col gap-5 border-t border-black/8 pt-6">
          <div className="w-full max-w-xl self-center text-sm text-black/45">
            <span>{`Étape ${step} sur ${totalSteps}`}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={`student-progress-${index + 1}`}
                className={`h-3 w-16 rounded-full transition-colors md:w-20 ${
                  index + 1 <= step ? "bg-black" : "bg-black/15"
                }`}
              />
            ))}
          </div>
          <div className="flex w-full max-w-xl self-center items-center justify-between pt-2">
            <Button
              variant="ghost"
              onClick={step === 1 ? () => router.push(roleSelectionHref) : handleBack}
              className="px-0 text-base"
            >
              Retour
            </Button>
            {step === totalSteps ? (
              <Button
                onClick={handleSubmit}
                disabled={!canContinue}
                className="h-12 rounded-full px-8 text-base"
              >
                {isEditing ? "Enregistrer" : "Terminer"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canContinue}
                className="h-12 rounded-full px-8 text-base"
              >
                Continuer
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentOnboarding() {
  return (
    <Suspense fallback={null}>
      <StudentOnboardingContent />
    </Suspense>
  );
}

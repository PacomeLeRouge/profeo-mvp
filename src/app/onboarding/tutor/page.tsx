"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Subject, Format } from "@/lib/types";

const subjectTranslations: Record<Subject, string> = {
  'Math': 'Mathématiques',
  'English': 'Anglais',
  'Science': 'Sciences',
  'History': 'Histoire',
  'Physics': 'Physique',
  'Computer Science': 'Informatique'
};

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const timeSlots = ['Matin', 'Après-midi', 'Soirée'];

const tutorSteps = [
  "Âge",
  "Présentation",
  "Niveau d'études",
  "Établissement",
  "Matières",
  "Tarif",
  "Format",
  "Disponibilités"
] as const;

const educationLevels = ["Licence", "Master", "Doctorat", "Autre"] as const;

function TutorOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateTutorProfile, tutorProfile } = useStore();
  const source = searchParams.get("source");
  const roleSelectionHref = source ? `/role-selection?source=${source}` : "/role-selection";

  const isEditing = !!tutorProfile;

  const [step, setStep] = useState(1);
  const [age, setAge] = useState(tutorProfile?.age ? String(tutorProfile.age) : "");
  const [bio, setBio] = useState(tutorProfile?.bio || "");
  const [educationLevel, setEducationLevel] = useState(tutorProfile?.educationLevel || "");
  const [institution, setInstitution] = useState(tutorProfile?.institution || "");
  const [subjects, setSubjects] = useState<Subject[]>(tutorProfile?.subjects || []);
  const [hourlyRate, setHourlyRate] = useState(tutorProfile?.hourlyRate ? String(tutorProfile.hourlyRate) : "");
  const [format, setFormat] = useState<Format>(tutorProfile?.format || "Online");
  const [selectedSlots, setSelectedSlots] = useState<string[]>(
    tutorProfile?.availability
      ? tutorProfile.availability.includes(' • ')
        ? tutorProfile.availability.split(' • ')
        : tutorProfile.availability === "Non précisé"
          ? []
          : [tutorProfile.availability]
      : []
  );

  const totalSteps = tutorSteps.length;

  const handleSubjectToggle = (subject: Subject) => {
    setSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSlotToggle = (day: string, time: string) => {
    const slot = `${day} ${time}`;
    setSelectedSlots(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
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

    const availability = selectedSlots.length > 0
      ? selectedSlots.join(' • ')
      : "Non précisé";

    updateTutorProfile({
      age: age ? Number(age) : undefined,
      subjects,
      hourlyRate: Number(hourlyRate),
      format,
      bio,
      availability,
      educationLevel,
      institution,
    });

    router.push("/dashboard/tutor");
  };

  const canContinue =
    (step === 1 && !!age) ||
    (step === 2 && !!bio.trim()) ||
    (step === 3 && !!educationLevel) ||
    (step === 4 && !!institution.trim()) ||
    (step === 5 && subjects.length > 0) ||
    (step === 6 && !!hourlyRate) ||
    (step === 7 && !!format) ||
    (step === 8 && selectedSlots.length > 0);

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <div className="flex items-center justify-between px-8 py-6 md:px-12">
        <button
          type="button"
          onClick={() => router.push(isEditing ? `/dashboard/${user.role}` : roleSelectionHref)}
          className="text-2xl font-bold tracking-tight"
        >
          clutch
        </button>
        <span className="text-sm font-medium text-black/50">
          {isEditing ? "Modification du profil" : `Étape ${step} sur ${totalSteps}`}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center md:px-12">
        {step === 1 && (
          <div className="w-full max-w-3xl space-y-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-black/40">Profil tuteur</p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-[4.5rem]">Quel âge avez-vous ?</h1>
            </div>
            <div className="mx-auto max-w-md">
              <Input
                type="number"
                placeholder="Taper ici"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                aria-label="Quel âge avez-vous"
                inputMode="numeric"
                className="h-24 rounded-none border-0 border-b-2 border-black/15 px-0 text-center text-4xl font-medium shadow-none placeholder:text-black/20 focus-visible:border-black focus-visible:ring-0 md:text-5xl"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-4xl space-y-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-black/40">Profil tuteur</p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-[4.5rem]">Présentez-vous en quelques lignes</h1>
            </div>
            <div className="mx-auto w-full max-w-2xl">
              <Textarea
                placeholder="Exemple : Je suis étudiant en master et j'aime aider à débloquer les notions difficiles."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                aria-label="Présentez-vous en quelques lignes"
                className="min-h-[220px] rounded-[2rem] border-black/10 px-6 py-5 text-left text-lg leading-8 shadow-none focus-visible:border-black/30 focus-visible:ring-2 focus-visible:ring-black/10 md:text-xl"
              />
              <p className="mt-4 text-sm text-black/45">Quelques phrases simples suffisent pour rassurer les étudiants.</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-5xl space-y-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-black/40">Profil tuteur</p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-[4.5rem]">Quel est votre niveau d&apos;études ?</h1>
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

        {step === 4 && (
          <div className="w-full max-w-4xl space-y-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-black/40">Profil tuteur</p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-[4.5rem]">Dans quel établissement étudiez-vous ?</h1>
            </div>
            <div className="mx-auto max-w-2xl">
              <Input
                type="text"
                placeholder="Taper ici"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                aria-label="Dans quel établissement étudiez-vous"
                className="h-24 rounded-none border-0 border-b-2 border-black/15 px-0 text-center text-3xl font-medium shadow-none placeholder:text-black/20 focus-visible:border-black focus-visible:ring-0 md:text-4xl"
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="w-full max-w-5xl space-y-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-black/40">Profil tuteur</p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-[4.5rem]">Quelles matières souhaitez-vous enseigner ?</h1>
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

        {step === 6 && (
          <div className="w-full max-w-3xl space-y-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-black/40">Profil tuteur</p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-[4.5rem]">Quel tarif horaire souhaitez-vous ?</h1>
            </div>
            <div className="mx-auto max-w-md">
              <Input
                type="number"
                placeholder="Exemple : 20"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                aria-label="Quel tarif horaire souhaitez-vous"
                inputMode="decimal"
                className="h-24 rounded-none border-0 border-b-2 border-black/15 px-0 text-center text-4xl font-medium shadow-none placeholder:text-black/20 focus-visible:border-black focus-visible:ring-0 md:text-5xl"
              />
              <p className="mt-4 text-sm text-black/45">Montant en euros par heure</p>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="w-full max-w-5xl space-y-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-black/40">Profil tuteur</p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-[4.5rem]">Sous quel format souhaitez-vous enseigner ?</h1>
            </div>
            <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4">
              {[
                { value: "Online" as Format, label: "En ligne uniquement" },
                { value: "In-person" as Format, label: "En personne uniquement" },
                { value: "Both" as Format, label: "Les deux (en ligne et en personne)" },
              ].map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="ghost"
                  onClick={() => setFormat(option.value)}
                  className={`min-h-14 rounded-full border px-7 py-4 text-lg transition-colors focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 ${
                    format === option.value
                      ? "border-black bg-black text-white hover:bg-black hover:text-white"
                      : "border-black/15 bg-transparent text-black hover:bg-black/5"
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="w-full max-w-6xl space-y-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-black/40">Profil tuteur</p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-[4.5rem]">Quand êtes-vous généralement disponible ?</h1>
              <p className="text-lg text-black/50">Sélectionnez un ou plusieurs créneaux habituels.</p>
            </div>
            <div className="overflow-x-auto">
              <div className="mx-auto min-w-[760px] max-w-5xl overflow-hidden rounded-3xl border border-black/10">
                <div className="grid grid-cols-8 border-b border-black/10 bg-black/[0.02] text-sm font-medium text-black/60">
                  <div className="border-r border-black/10 px-4 py-4"></div>
                  {daysOfWeek.map((day) => (
                    <div key={day} className="border-r border-black/10 px-4 py-4 text-center last:border-r-0">
                      {day.substring(0, 3)}
                    </div>
                  ))}
                </div>
                {timeSlots.map((time) => (
                  <div key={time} className="grid grid-cols-8 border-b border-black/10 last:border-b-0">
                    <div className="flex items-center justify-center border-r border-black/10 bg-black/[0.02] px-4 py-5 text-sm font-medium text-black/60">
                      {time}
                    </div>
                    {daysOfWeek.map((day) => {
                      const slot = `${day} ${time}`;
                      const isSelected = selectedSlots.includes(slot);

                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSlotToggle(day, time)}
                          className={`border-r border-black/10 px-2 py-3 transition-colors last:border-r-0 ${
                            isSelected ? "bg-black/90" : "bg-white hover:bg-black/[0.04]"
                          }`}
                        >
                          <div className={`h-12 rounded-2xl ${isSelected ? "bg-white/10" : "bg-transparent"}`} />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-12 pt-4 md:px-12 md:pb-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 border-t border-black/8 pt-6">
          <div className="w-full max-w-xl self-center text-sm text-black/45">
            <span>{`Étape ${step} sur ${totalSteps}`}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={`tutor-progress-${index + 1}`}
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
                {isEditing ? "Enregistrer" : "Publier mon profil"}
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

export default function TutorOnboarding() {
  return (
    <Suspense fallback={null}>
      <TutorOnboardingContent />
    </Suspense>
  );
}

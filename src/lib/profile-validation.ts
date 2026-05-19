import { SUBJECTS, assertValidSubjects } from "@/lib/subjects";
import type { Format, Subject } from "@/lib/types";

const MIN_AGE_STUDENT = 16;
const MIN_AGE_TUTOR = 18;
const MAX_AGE = 99;

export function normalizeFirstName(firstName: string): string {
  const trimmed = firstName.trim().replace(/\s+/g, " ");
  if (trimmed.length < 2) {
    throw new Error("Le prénom doit contenir au moins 2 caractères");
  }
  if (trimmed.length > 40) {
    throw new Error("Le prénom ne peut pas dépasser 40 caractères");
  }
  return trimmed;
}

export function validateStudentProfileInput(data: {
  firstName: string;
  age?: number;
  educationLevel: string;
  institution: string;
  subjectsOfInterest: Subject[];
}) {
  const firstName = normalizeFirstName(data.firstName);

  if (data.age !== undefined) {
    if (!Number.isInteger(data.age) || data.age < MIN_AGE_STUDENT || data.age > MAX_AGE) {
      throw new Error(`L'âge doit être entre ${MIN_AGE_STUDENT} et ${MAX_AGE} ans`);
    }
  }

  if (!data.educationLevel.trim()) {
    throw new Error("Le niveau d'études est requis");
  }

  if (!data.institution.trim()) {
    throw new Error("L'établissement est requis");
  }

  if (data.subjectsOfInterest.length === 0) {
    throw new Error("Sélectionnez au moins une matière");
  }

  assertValidSubjects(data.subjectsOfInterest);

  return {
    firstName,
    age: data.age,
    educationLevel: data.educationLevel.trim(),
    institution: data.institution.trim(),
    subjectsOfInterest: data.subjectsOfInterest,
  };
}

export function validateTutorProfileInput(data: {
  firstName: string;
  age?: number;
  subjects: Subject[];
  hourlyRate: number;
  format: Format;
  bio: string;
  availability: string;
  educationLevel: string;
  institution: string;
}) {
  const firstName = normalizeFirstName(data.firstName);

  if (data.age !== undefined) {
    if (!Number.isInteger(data.age) || data.age < MIN_AGE_TUTOR || data.age > MAX_AGE) {
      throw new Error(`L'âge doit être entre ${MIN_AGE_TUTOR} et ${MAX_AGE} ans`);
    }
  }

  if (!data.educationLevel.trim()) {
    throw new Error("Le niveau d'études est requis");
  }

  if (!data.institution.trim()) {
    throw new Error("L'établissement est requis");
  }

  if (data.subjects.length === 0) {
    throw new Error("Sélectionnez au moins une matière");
  }

  assertValidSubjects(data.subjects);

  if (!Number.isFinite(data.hourlyRate) || data.hourlyRate < 5 || data.hourlyRate > 200) {
    throw new Error("Le tarif horaire doit être entre 5 et 200 €");
  }

  if (!["Online", "In-person", "Both"].includes(data.format)) {
    throw new Error("Format d'enseignement invalide");
  }

  return {
    firstName,
    age: data.age,
    subjects: data.subjects,
    hourlyRate: Math.round(data.hourlyRate),
    format: data.format,
    bio: data.bio.trim() || "Profil tuteur Clutch",
    availability: data.availability.trim() || "Non précisé",
    educationLevel: data.educationLevel.trim(),
    institution: data.institution.trim(),
  };
}

export { SUBJECTS };

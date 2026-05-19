import type { Subject } from "@/lib/types";
import { SUBJECTS, subjectTranslations } from "@/lib/subjects";

export { SUBJECTS as allSubjects, subjectTranslations };
export type { Subject };

export const studentEducationLevels = ["Lycée", "Licence", "Master", "Doctorat", "Autre"] as const;
export const tutorEducationLevels = ["Licence", "Master", "Doctorat", "Autre"] as const;

export const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
export const timeSlots = ["Matin", "Après-midi", "Soirée"];

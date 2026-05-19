export const SUBJECTS = [
  "Math",
  "English",
  "Science",
  "History",
  "Physics",
  "Computer Science",
  "Chemistry",
  "Economics",
  "Geography",
  "French",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const subjectTranslations: Record<Subject, string> = {
  Math: "Mathématiques",
  English: "Anglais",
  Science: "Sciences",
  History: "Histoire",
  Physics: "Physique",
  "Computer Science": "Informatique",
  Chemistry: "Chimie",
  Economics: "Économie",
  Geography: "Géographie",
  French: "Français",
};

export function isSubject(value: string): value is Subject {
  return (SUBJECTS as readonly string[]).includes(value);
}

export function assertValidSubjects(subjects: string[]): asserts subjects is Subject[] {
  for (const subject of subjects) {
    if (!isSubject(subject)) {
      throw new Error(`Matière invalide : ${subject}`);
    }
  }
}

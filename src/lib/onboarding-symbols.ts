/** Glassmorphism 3D symbols for onboarding steps (public/onboarding/symbols). */

export type OnboardingRole = "student" | "tutor";

const symbols = {
  age: "/onboarding/symbols/onboarding-symbol-age.png",
  education: "/onboarding/symbols/onboarding-symbol-education.png",
  institution: "/onboarding/symbols/onboarding-symbol-institution.png",
  subjects: "/onboarding/symbols/onboarding-symbol-subjects.png",
  rate: "/onboarding/symbols/onboarding-symbol-rate.png",
  format: "/onboarding/symbols/onboarding-symbol-format.png",
  availability: "/onboarding/symbols/onboarding-symbol-availability.png",
  connection: "/onboarding/symbols/onboarding-symbol-connection.png",
} as const;

export type OnboardingSymbolKey = keyof typeof symbols;

export const onboardingSymbolPaths = symbols;

const tutorStepSymbols: Record<number, OnboardingSymbolKey> = {
  1: "education",
  2: "age",
  3: "education",
  4: "institution",
  5: "subjects",
  6: "rate",
  7: "format",
  8: "availability",
  9: "connection",
};

const studentStepSymbols: Record<number, OnboardingSymbolKey> = {
  1: "education",
  2: "age",
  3: "education",
  4: "institution",
  5: "subjects",
  6: "connection",
};

export function getOnboardingSymbol(
  role: OnboardingRole,
  step: number
): (typeof symbols)[OnboardingSymbolKey] | undefined {
  const key = role === "tutor" ? tutorStepSymbols[step] : studentStepSymbols[step];
  return key ? symbols[key] : undefined;
}

/** Unique symbol URLs used across a role's onboarding flow. */
export function getOnboardingSymbolUrlsForRole(role: OnboardingRole): string[] {
  const map = role === "tutor" ? tutorStepSymbols : studentStepSymbols;
  return [...new Set(Object.values(map).map((key) => symbols[key]))];
}

const prefetched = new Set<string>();

/** Preload symbol PNGs (browser cache) — safe to call multiple times. */
export function prefetchOnboardingSymbols(urls: string[]) {
  if (typeof window === "undefined") return;

  for (const url of urls) {
    if (prefetched.has(url)) continue;
    prefetched.add(url);

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);

    const img = new window.Image();
    img.src = url;
  }
}

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const corners = ["top-left", "top-right", "bottom-right", "bottom-left"] as const;

export type SymbolPlacement = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  translateX: string;
  translateY: string;
  rotate: number;
  floatX: number;
  floatY: number;
};

/** Corner placement per step — cycles corners with light jitter. */
export function getSymbolPlacement(stepKey: string | number): SymbolPlacement {
  const step = typeof stepKey === "number" ? stepKey : Number(stepKey) || 1;
  const corner = corners[(step - 1) % corners.length];
  const jitter = seeded(step * 9.17) * 2;
  const r3 = seeded(step * 17.91);
  const r4 = seeded(step * 23.47);
  const r5 = seeded(step * 31.02);

  const base = {
    rotate: -10 + r3 * 20,
    floatX: 10 + r4 * 14,
    floatY: 12 + r5 * 14,
  };

  switch (corner) {
    case "top-left":
      return {
        ...base,
        top: `${10 + jitter}%`,
        left: `${8 + jitter}%`,
        translateX: "-8%",
        translateY: "-8%",
      };
    case "top-right":
      return {
        ...base,
        top: `${10 + jitter}%`,
        right: `${8 + jitter}%`,
        translateX: "8%",
        translateY: "-8%",
      };
    case "bottom-right":
      return {
        ...base,
        bottom: `${12 + jitter}%`,
        right: `${10 + jitter}%`,
        translateX: "8%",
        translateY: "8%",
      };
    case "bottom-left":
      return {
        ...base,
        bottom: `${12 + jitter}%`,
        left: `${10 + jitter}%`,
        translateX: "-8%",
        translateY: "8%",
      };
  }
}

export function getOnboardingSymbolAlt(role: OnboardingRole, step: number): string {
  const labels: Record<OnboardingSymbolKey, string> = {
    age: "Âge",
    education: "Niveau d'études",
    institution: "Établissement",
    subjects: "Matières",
    rate: "Tarif horaire",
    format: "Format d'enseignement",
    availability: "Disponibilités",
    connection: "Échanges par e-mail",
  };
  const key = role === "tutor" ? tutorStepSymbols[step] : studentStepSymbols[step];
  if (key === "connection") return "Échanges par e-mail";
  if (step === 1) return "Prénom";
  return key ? labels[key] : "Étape d'onboarding";
}

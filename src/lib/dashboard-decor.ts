import { onboardingSymbolPaths, type SymbolPlacement } from "@/lib/onboarding-symbols";

export type DashboardDecorItem = {
  id: string;
  src: string;
  alt: string;
  placement: SymbolPlacement;
  size?: number;
};

const studentPlacements: SymbolPlacement[] = [
  {
    top: "4%",
    right: "0%",
    translateX: "12%",
    translateY: "-6%",
    rotate: 14,
    floatX: 14,
    floatY: 16,
  },
  {
    bottom: "22%",
    left: "-4%",
    translateX: "-10%",
    translateY: "6%",
    rotate: -10,
    floatX: 11,
    floatY: 14,
  },
  {
    top: "38%",
    right: "12%",
    translateX: "6%",
    translateY: "0%",
    rotate: -16,
    floatX: 12,
    floatY: 11,
  },
  {
    bottom: "6%",
    right: "20%",
    translateX: "8%",
    translateY: "10%",
    rotate: 8,
    floatX: 10,
    floatY: 13,
  },
];

const tutorPlacements: SymbolPlacement[] = [
  {
    top: "6%",
    left: "2%",
    translateX: "-8%",
    translateY: "-4%",
    rotate: -12,
    floatX: 12,
    floatY: 15,
  },
  {
    top: "32%",
    right: "0%",
    translateX: "10%",
    translateY: "0%",
    rotate: 18,
    floatX: 13,
    floatY: 12,
  },
  {
    bottom: "14%",
    left: "6%",
    translateX: "-6%",
    translateY: "8%",
    rotate: 6,
    floatX: 11,
    floatY: 14,
  },
  {
    bottom: "4%",
    right: "8%",
    translateX: "6%",
    translateY: "6%",
    rotate: -8,
    floatX: 10,
    floatY: 12,
  },
];

function buildDecor(
  specs: { id: string; key: keyof typeof onboardingSymbolPaths; alt: string; size: number }[],
  placements: SymbolPlacement[]
): DashboardDecorItem[] {
  return specs.map((spec, index) => ({
    id: spec.id,
    src: onboardingSymbolPaths[spec.key],
    alt: spec.alt,
    placement: placements[index] ?? placements[0]!,
    size: spec.size,
  }));
}

export const studentDashboardDecor = buildDecor(
  [
    { id: "subjects", key: "subjects", alt: "Matières", size: 260 },
    { id: "connection", key: "connection", alt: "Mise en relation", size: 220 },
    { id: "education", key: "education", alt: "Parcours", size: 200 },
    { id: "availability", key: "availability", alt: "Disponibilités", size: 180 },
  ],
  studentPlacements
);

export const tutorDashboardDecor = buildDecor(
  [
    { id: "rate", key: "rate", alt: "Tarif", size: 240 },
    { id: "connection", key: "connection", alt: "Demandes", size: 210 },
    { id: "institution", key: "institution", alt: "Établissement", size: 190 },
    { id: "format", key: "format", alt: "Format", size: 170 },
  ],
  tutorPlacements
);

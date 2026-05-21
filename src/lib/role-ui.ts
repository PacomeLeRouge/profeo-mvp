import type { LucideIcon } from "lucide-react";
import { BookOpen, GraduationCap } from "lucide-react";
import type { Role } from "@/lib/types";

export type AppRole = Exclude<Role, null>;

type RoleMeta = {
  label: string;
  dashboardEyebrow: string;
  switchDescription: string;
  icon: LucideIcon;
};

export const roleMeta: Record<AppRole, RoleMeta> = {
  student: {
    label: "Étudiant",
    dashboardEyebrow: "Parcours étudiant",
    switchDescription: "Trouver un tuteur et envoyer des demandes de cours.",
    icon: BookOpen,
  },
  tutor: {
    label: "Tuteur",
    dashboardEyebrow: "Parcours tuteur",
    switchDescription: "Proposer vos cours et gérer les demandes reçues.",
    icon: GraduationCap,
  },
};

export function getOtherRole(role: AppRole): AppRole {
  return role === "student" ? "tutor" : "student";
}

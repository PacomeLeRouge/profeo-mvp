"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { subjectTranslations } from "@/lib/subjects";
import { TutorProfile } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, Monitor, Sparkles } from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getAvailabilitySlots(availability: string) {
  const slots = availability.split(" • ").map((slot) => slot.trim()).filter(Boolean);
  return slots.length > 0 ? slots : [availability];
}

type TutorCardProps = {
  tutor: TutorProfile;
  index: number;
  onRequest: (tutor: TutorProfile) => void;
};

export function TutorCard({ tutor, index, onRequest }: TutorCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.5,
        delay: index * 0.08,
        ease: onboardingEase.enter,
      });
    },
    { scope: cardRef, dependencies: [tutor.id] }
  );

  const slots = getAvailabilitySlots(tutor.availability);
  const visibleSlots = slots.slice(0, 3);
  const hiddenCount = slots.length - visibleSlots.length;

  return (
    <article
      ref={cardRef}
      className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_24px_60px_-36px_rgba(0,0,0,0.25)]"
    >
      <div className="border-b border-border p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-white">
              {getInitials(tutor.name)}
            </div>
            <div className="min-w-0 space-y-1">
              <h3 className="truncate text-lg font-semibold tracking-tight">{tutor.name}</h3>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">
                  {tutor.educationLevel} · {tutor.institution}
                </span>
              </p>
            </div>
          </div>
          <div className="rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-white whitespace-nowrap">
            {tutor.hourlyRate}€/h
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap gap-2">
          {tutor.subjects.map((subject) => (
            <Badge
              key={subject}
              variant="secondary"
              className="rounded-full border border-border bg-muted px-3 py-1 text-foreground/70"
            >
              {subjectTranslations[subject]}
            </Badge>
          ))}
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {tutor.bio || "Profil tuteur — disponible pour accompagner sur ses matières."}
        </p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {tutor.format === "Online" || tutor.format === "Both" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
              <Monitor className="h-3.5 w-3.5" aria-hidden />
              En ligne
            </span>
          ) : null}
          {tutor.format === "In-person" || tutor.format === "Both" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              Présentiel
            </span>
          ) : null}
        </div>

        <div className="rounded-2xl bg-muted p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Disponibilités
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {visibleSlots.map((slot) => (
              <span
                key={`${tutor.id}-${slot}`}
                className="rounded-full border border-border bg-white px-2.5 py-1 text-xs text-foreground/65"
              >
                {slot}
              </span>
            ))}
            {hiddenCount > 0 ? (
              <span className="rounded-full px-2 py-1 text-xs text-muted-foreground">+{hiddenCount}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-border p-5 pt-4">
        <Button
          className="w-full rounded-full"
          onClick={() => onRequest(tutor)}
        >
          Demander un cours
        </Button>
      </div>
    </article>
  );
}

export function TutorEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="col-span-full rounded-[1.75rem] border border-dashed border-border bg-muted px-6 py-16 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold">Aucun tuteur ne correspond</p>
          <p className="text-sm leading-6 text-muted-foreground">
            Essaie une autre matière ou élargis ton budget pour voir plus de profils.
          </p>
        </div>
        <Button variant="outline" className="rounded-full" onClick={onReset}>
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );
}

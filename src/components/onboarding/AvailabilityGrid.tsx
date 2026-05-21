"use client";

import type { Dispatch, SetStateAction } from "react";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { daysOfWeek, timeSlots } from "@/components/onboarding/onboarding-shared";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type AvailabilityGridProps = {
  selectedSlots: string[];
  onToggle: (day: string, time: string) => void;
  onSetSlots: Dispatch<SetStateAction<string[]>>;
  stepKey: string | number;
};

function slotKey(day: string, time: string) {
  return `${day} ${time}`;
}

function slotsForDay(day: string) {
  return timeSlots.map((time) => slotKey(day, time));
}

function slotsForTime(time: string) {
  return daysOfWeek.map((day) => slotKey(day, time));
}

export function AvailabilityGrid({
  selectedSlots,
  onToggle,
  onSetSlots,
  stepKey,
}: AvailabilityGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const selectedSet = new Set(selectedSlots);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-availability-cell]", {
        opacity: 0,
        duration: 0.3,
        stagger: { amount: 0.35, from: "start" },
        ease: onboardingEase.enter,
        delay: 0.08,
      });
    },
    { scope: gridRef, dependencies: [stepKey], revertOnUpdate: true }
  );

  const toggleDay = (day: string) => {
    const slots = slotsForDay(day);
    const allOn = slots.every((s) => selectedSet.has(s));
    onSetSlots((prev) => {
      const next = new Set(prev);
      if (allOn) slots.forEach((s) => next.delete(s));
      else slots.forEach((s) => next.add(s));
      return [...next];
    });
  };

  const toggleTime = (time: string) => {
    const slots = slotsForTime(time);
    const allOn = slots.every((s) => selectedSet.has(s));
    onSetSlots((prev) => {
      const next = new Set(prev);
      if (allOn) slots.forEach((s) => next.delete(s));
      else slots.forEach((s) => next.add(s));
      return [...next];
    });
  };

  const clearAll = () => onSetSlots([]);

  const count = selectedSlots.length;
  const total = daysOfWeek.length * timeSlots.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <p
          className={cn(
            "text-sm font-medium tabular-nums transition-colors",
            count > 0 ? "text-foreground" : "text-muted-foreground"
          )}
          aria-live="polite"
        >
          {count === 0
            ? "Aucun créneau sélectionné"
            : count === 1
              ? "1 créneau sélectionné"
              : `${count} créneaux sélectionnés`}
          <span className="font-normal text-muted-foreground"> · {total} au total</span>
        </p>
        {count > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 shrink-0 rounded-full px-4 text-muted-foreground hover:text-foreground"
            onClick={clearAll}
          >
            Tout effacer
          </Button>
        ) : null}
      </div>

      <div ref={gridRef} className="-mx-1 overflow-x-auto overscroll-x-contain px-1 pb-2 touch-pan-x">
        <div className="mx-auto min-w-[36rem] max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:rounded-3xl">
          <div className="grid grid-cols-8 border-b border-border bg-muted/50">
            <div className="border-r border-border px-2 py-3" aria-hidden />
            {daysOfWeek.map((day) => {
              const daySlots = slotsForDay(day);
              const dayCount = daySlots.filter((s) => selectedSet.has(s)).length;
              const allDay = dayCount === daySlots.length;
              const someDay = dayCount > 0 && !allDay;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  title={`${allDay ? "Désélectionner" : "Sélectionner"} toute la journée — ${day}`}
                  className={cn(
                    "touch-manipulation border-r border-border px-1 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-wide transition-colors last:border-r-0 sm:px-2 sm:text-xs",
                    "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                    allDay
                      ? "surface-brand-tint"
                      : someDay
                        ? "surface-brand-tint-partial"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="block sm:hidden">{day.substring(0, 2)}</span>
                  <span className="hidden sm:block">{day.substring(0, 3)}</span>
                </button>
              );
            })}
          </div>

          {timeSlots.map((time) => (
            <div
              key={time}
              className="grid grid-cols-8 border-b border-border last:border-b-0"
            >
              <button
                type="button"
                onClick={() => toggleTime(time)}
                title={`Sélectionner tous les créneaux « ${time} »`}
                className={cn(
                  "touch-manipulation flex min-h-14 items-center justify-center border-r border-border bg-muted/30 px-1.5 text-[0.65rem] font-medium transition-colors sm:min-h-[3.75rem] sm:px-2 sm:text-sm",
                  "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                  slotsForTime(time).every((s) => selectedSet.has(s))
                    ? "surface-brand-tint"
                    : slotsForTime(time).some((s) => selectedSet.has(s))
                      ? "surface-brand-tint-partial"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {time}
              </button>

              {daysOfWeek.map((day) => {
                const slot = slotKey(day, time);
                const isSelected = selectedSet.has(slot);

                return (
                  <button
                    key={slot}
                    type="button"
                    data-availability-cell
                    aria-pressed={isSelected}
                    aria-label={`${day}, ${time}${isSelected ? " — sélectionné" : " — non sélectionné"}`}
                    onClick={() => onToggle(day, time)}
                    className={cn(
                      "touch-manipulation min-h-11 min-w-11 w-full border-r border-border transition-colors duration-150 last:border-r-0 sm:min-h-[3.75rem]",
                      "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                      isSelected
                        ? "bg-primary"
                        : "bg-muted/25 hover:bg-muted/50 active:bg-muted/70"
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto max-w-5xl px-1 text-center text-sm leading-relaxed text-muted-foreground">
        Touchez une case pour un créneau précis, ou un jour / une période dans l&apos;en-tête pour
        tout sélectionner d&apos;un coup.
      </p>
    </div>
  );
}

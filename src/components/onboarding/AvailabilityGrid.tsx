"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { daysOfWeek, timeSlots } from "@/components/onboarding/onboarding-shared";
import { cn } from "@/lib/utils";

type AvailabilityGridProps = {
  selectedSlots: string[];
  onToggle: (day: string, time: string) => void;
  stepKey: string | number;
};

export function AvailabilityGrid({ selectedSlots, onToggle, stepKey }: AvailabilityGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from("[data-availability-cell]", {
        opacity: 0,
        scale: 0.85,
        duration: 0.35,
        stagger: { amount: 0.5, from: "start" },
        ease: onboardingEase.enter,
        delay: 0.15,
      });
    },
    { scope: gridRef, dependencies: [stepKey], revertOnUpdate: true }
  );

  const handleToggle = (day: string, time: string, cell: HTMLButtonElement | null) => {
    if (!prefersReducedMotion() && cell) {
      gsap.fromTo(
        cell,
        { scale: 0.92 },
        { scale: 1, duration: 0.35, ease: onboardingEase.bounce }
      );
    }
    onToggle(day, time);
  };

  return (
    <div ref={gridRef} className="overflow-x-auto">
      <div className="mx-auto min-w-[760px] max-w-5xl overflow-hidden rounded-3xl border border-border">
        <div className="grid grid-cols-8 border-b border-border bg-muted text-sm font-medium text-muted-foreground">
          <div className="border-r border-border px-4 py-4" />
          {daysOfWeek.map((day) => (
            <div key={day} className="border-r border-border px-4 py-4 text-center last:border-r-0">
              {day.substring(0, 3)}
            </div>
          ))}
        </div>
        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-8 border-b border-border last:border-b-0">
            <div className="flex items-center justify-center border-r border-border bg-muted px-4 py-5 text-sm font-medium text-muted-foreground">
              {time}
            </div>
            {daysOfWeek.map((day) => {
              const slot = `${day} ${time}`;
              const isSelected = selectedSlots.includes(slot);

              return (
                <button
                  key={slot}
                  type="button"
                  data-availability-cell
                  onClick={(e) => handleToggle(day, time, e.currentTarget)}
                  className={cn(
                    "border-r border-border px-2 py-3 transition-colors duration-200 last:border-r-0",
                    isSelected ? "bg-primary/90" : "bg-white hover:bg-muted"
                  )}
                >
                  <div
                    className={cn(
                      "h-12 rounded-2xl transition-all duration-200",
                      isSelected ? "bg-white/15 shadow-inner" : "bg-transparent"
                    )}
                  />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

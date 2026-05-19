"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { cn } from "@/lib/utils";

type ChoiceChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  index?: number;
  stepKey: string | number;
  className?: string;
};

export function ChoiceChip({ label, selected, onClick, index = 0, stepKey, className }: ChoiceChipProps) {
  const chipRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(chipRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.92,
        duration: 0.45,
        delay: 0.15 + index * 0.06,
        ease: onboardingEase.enter,
      });
    },
    { scope: chipRef, dependencies: [stepKey], revertOnUpdate: true }
  );

  useGSAP(
    () => {
      if (!chipRef.current || prefersReducedMotion()) return;

      gsap.to(chipRef.current, {
        scale: selected ? 1.04 : 1,
        duration: 0.35,
        ease: onboardingEase.bounce,
      });
    },
    { scope: chipRef, dependencies: [selected] }
  );

  const handleClick = () => {
    if (!prefersReducedMotion() && chipRef.current) {
      gsap.fromTo(
        chipRef.current,
        { scale: selected ? 1 : 0.96 },
        { scale: selected ? 1.04 : 1, duration: 0.4, ease: onboardingEase.bounce }
      );
    }
    onClick();
  };

  return (
    <button
      ref={chipRef}
      type="button"
      onClick={handleClick}
      className={cn(
        "min-h-14 rounded-full border px-7 py-4 text-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-transparent text-foreground hover:bg-muted",
        className
      )}
    >
      {label}
    </button>
  );
}

type ChoiceChipGroupProps = {
  options: readonly string[] | { value: string; label: string }[];
  value: string | string[];
  onChange: (value: string) => void;
  stepKey: string | number;
  multiple?: boolean;
  className?: string;
};

export function ChoiceChipGroup({
  options,
  value,
  onChange,
  stepKey,
  multiple = false,
  className,
}: ChoiceChipGroupProps) {
  const normalized = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option
  );

  const isSelected = (optionValue: string) =>
    multiple ? (value as string[]).includes(optionValue) : value === optionValue;

  return (
    <div className={cn("mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4", className)}>
      {normalized.map((option, index) => (
        <ChoiceChip
          key={option.value}
          label={option.label}
          selected={isSelected(option.value)}
          onClick={() => onChange(option.value)}
          index={index}
          stepKey={stepKey}
        />
      ))}
    </div>
  );
}

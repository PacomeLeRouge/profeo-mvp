"use client";

import { useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { cn } from "@/lib/utils";

type AnimatedNumberFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  unit?: string;
  hint?: string;
  autoFocus?: boolean;
  allowDecimal?: boolean;
  className?: string;
  "aria-label"?: string;
};

export function AnimatedNumberField({
  value,
  onChange,
  label,
  placeholder = "—",
  min = 0,
  max = 999,
  step = 1,
  suffix,
  unit,
  hint,
  autoFocus = true,
  allowDecimal = false,
  className,
  "aria-label": ariaLabel,
}: AnimatedNumberFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const numericValue = value === "" ? null : Number(value);
  const isValidNumber = numericValue !== null && !Number.isNaN(numericValue);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(containerRef.current, {
        opacity: 0,
        y: 28,
        scale: 0.98,
        duration: 0.55,
        ease: onboardingEase.enter,
        delay: 0.15,
      });

      if (autoFocus) {
        gsap.delayedCall(0.4, () => inputRef.current?.focus());
      }
    },
    { scope: containerRef, dependencies: [label], revertOnUpdate: true }
  );

  useGSAP(
    () => {
      if (!displayRef.current || prefersReducedMotion() || !isValidNumber) return;

      gsap.fromTo(
        displayRef.current,
        { y: 8, opacity: 0.4 },
        { y: 0, opacity: 1, duration: 0.35, ease: onboardingEase.bounce }
      );
    },
    { scope: containerRef, dependencies: [value] }
  );

  const animateButton = (button: HTMLButtonElement | null) => {
    if (!button || prefersReducedMotion()) return;
    gsap.fromTo(
      button,
      { scale: 0.88 },
      { scale: 1, duration: 0.4, ease: onboardingEase.bounce }
    );
  };

  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  const formatValue = (next: number) => {
    if (allowDecimal) return String(next);
    return String(Math.round(next));
  };

  const applyDelta = (delta: number, button: HTMLButtonElement | null) => {
    animateButton(button);
    const base = isValidNumber ? numericValue : min;
    onChange(formatValue(clamp(base + delta)));
  };

  const handleInputChange = (raw: string) => {
    if (raw === "") {
      onChange("");
      return;
    }

    const pattern = allowDecimal ? /^\d*\.?\d*$/ : /^\d*$/;
    if (!pattern.test(raw)) return;
    onChange(raw);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value === "" || Number.isNaN(Number(value))) return;
    onChange(formatValue(clamp(Number(value))));
  };

  return (
    <div ref={containerRef} className={cn("mx-auto w-full max-w-lg", className)}>
      <div
        className={cn(
          "rounded-[2rem] border bg-black/[0.02] px-6 py-8 transition-shadow duration-300 sm:px-8 sm:py-10",
          isFocused
            ? "border-black/20 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.18)]"
            : "border-black/10"
        )}
      >
        <p className="text-center text-xs font-medium uppercase tracking-[0.22em] text-black/35">
          {label}
        </p>

        <div className="mt-6 flex items-center justify-center gap-4 sm:gap-6">
          <button
            type="button"
            aria-label={`Diminuer ${label.toLowerCase()}`}
            disabled={isValidNumber && numericValue <= min}
            onClick={(e) => applyDelta(-step, e.currentTarget)}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-colors hover:border-black/20 hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-30 sm:h-16 sm:w-16"
          >
            <Minus className="h-5 w-5" strokeWidth={2.25} />
          </button>

          <div
            ref={displayRef}
            className="relative flex min-w-[7rem] flex-col items-center sm:min-w-[8rem]"
          >
            <input
              ref={inputRef}
              type="text"
              inputMode={allowDecimal ? "decimal" : "numeric"}
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
              placeholder={placeholder}
              aria-label={ariaLabel ?? label}
              className="w-full border-0 bg-transparent text-center text-5xl font-semibold tabular-nums tracking-tight text-black outline-none placeholder:text-black/15 sm:text-6xl"
            />
            {(unit || (value && suffix)) ? (
              <p className="mt-1 text-sm font-medium text-black/40">
                {value && suffix ? suffix : unit}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            aria-label={`Augmenter ${label.toLowerCase()}`}
            disabled={isValidNumber && numericValue >= max}
            onClick={(e) => applyDelta(step, e.currentTarget)}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black text-white transition-transform hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-30 sm:h-16 sm:w-16"
          >
            <Plus className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>
      </div>

      {hint ? <p className="mt-5 text-center text-sm text-black/45">{hint}</p> : null}
    </div>
  );
}

/** @deprecated Use AnimatedNumberField */
export const AnimatedTextInput = AnimatedNumberField;

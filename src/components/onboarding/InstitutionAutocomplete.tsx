"use client";

import { useId, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import {
  filterEuropeanUniversities,
  type EuropeanUniversity,
} from "@/data/european-universities";
import { cn } from "@/lib/utils";

type InstitutionAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  hint?: string;
  autoFocus?: boolean;
  className?: string;
  "aria-label"?: string;
};

export function InstitutionAutocomplete({
  value,
  onChange,
  label = "Établissement",
  placeholder = "Tapez une lettre…",
  hint = "Commencez à taper le nom de votre université — suggestions parmi les 100 plus grandes d'Europe.",
  autoFocus = true,
  className,
  "aria-label": ariaLabel,
}: InstitutionAutocompleteProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const suggestions = filterEuropeanUniversities(value);
  const showSuggestions = isOpen && isFocused && value.trim().length > 0 && suggestions.length > 0;
  const isActive = isFocused || value.length > 0;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(containerRef.current, {
        opacity: 0,
        y: 32,
        duration: 0.55,
        ease: onboardingEase.enter,
        delay: 0.2,
      });

      if (autoFocus) {
        gsap.delayedCall(0.45, () => inputRef.current?.focus());
      }
    },
    { scope: containerRef, dependencies: [label], revertOnUpdate: true }
  );

  useGSAP(
    () => {
      if (!labelRef.current) return;

      gsap.to(labelRef.current, {
        y: isActive ? -36 : 0,
        scale: isActive ? 0.72 : 1,
        opacity: isActive ? 0.55 : 0.35,
        duration: prefersReducedMotion() ? 0 : 0.28,
        ease: "power2.out",
      });
    },
    { scope: containerRef, dependencies: [isActive, isFocused] }
  );

  useGSAP(
    () => {
      if (!showSuggestions || !listRef.current || prefersReducedMotion()) return;

      gsap.fromTo(
        listRef.current.querySelectorAll("[data-suggestion-item]"),
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.28,
          stagger: 0.04,
          ease: onboardingEase.enter,
        }
      );
    },
    { scope: containerRef, dependencies: [showSuggestions, value, suggestions.length], revertOnUpdate: true }
  );

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleBlur = () => {
    window.setTimeout(() => {
      setIsFocused(false);
      setIsOpen(false);
    }, 120);
  };

  const handleChange = (next: string) => {
    onChange(next);
    setIsOpen(true);

    if (!prefersReducedMotion() && next.length === 1 && inputRef.current) {
      gsap.fromTo(
        inputRef.current,
        { scale: 0.985 },
        { scale: 1, duration: 0.35, ease: onboardingEase.bounce }
      );
    }
  };

  const handleSelect = (university: EuropeanUniversity) => {
    onChange(university.name);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className={cn("relative mx-auto w-full max-w-2xl", className)}>
      <div className="relative pt-8">
        <span
          ref={labelRef}
          className="pointer-events-none absolute left-0 right-0 top-0 origin-left text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          {label}
        </span>

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isActive ? placeholder : ""}
            aria-label={ariaLabel ?? label}
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={showSuggestions}
            role="combobox"
            autoComplete="off"
            className="h-20 w-full border-0 bg-transparent px-2 text-center text-xl font-medium text-foreground outline-none placeholder:text-foreground/20 break-words sm:h-24 sm:text-2xl md:text-4xl"
          />

          {showSuggestions ? (
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              className="absolute left-0 right-0 top-full z-20 mt-2 max-h-[40vh] overflow-y-auto rounded-3xl border border-border bg-card py-2 text-left shadow-[0_24px_60px_-32px_rgba(0,0,0,0.35)] sm:max-h-72"
            >
              {suggestions.map((university) => (
                <li key={`${university.name}-${university.city}`} role="option">
                  <button
                    type="button"
                    data-suggestion-item
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(university)}
                    className="flex w-full flex-col gap-0.5 px-5 py-3 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                  >
                    <span className="text-base font-medium text-foreground md:text-lg">
                      {university.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {university.city}, {university.country}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {hint ? (
        <p className="mt-5 text-sm text-muted-foreground">
          {value.trim().length === 0
            ? hint
            : suggestions.length === 0
              ? "Aucune université trouvée — vous pouvez saisir le nom manuellement."
              : `${suggestions.length} suggestion${suggestions.length > 1 ? "s" : ""}`}
        </p>
      ) : null}
    </div>
  );
}

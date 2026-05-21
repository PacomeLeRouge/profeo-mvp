"use client";

import { useId, useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { cn } from "@/lib/utils";

type AnimatedTextFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  hint?: string;
  type?: "text" | "email";
  autoFocus?: boolean;
  className?: string;
  "aria-label"?: string;
};

export function AnimatedTextField({
  value,
  onChange,
  label,
  placeholder = "…",
  hint,
  type = "text",
  autoFocus = true,
  className,
  "aria-label": ariaLabel,
}: AnimatedTextFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const showPlaceholder = value.trim().length === 0;
  const showLabel = Boolean(label?.trim());
  const fieldLabel = ariaLabel ?? label ?? "Champ texte";

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

  return (
    <div ref={containerRef} className={cn("relative mx-auto w-full max-w-2xl", className)}>
      <div className={cn("relative", showLabel && "pt-8")}>
        {showLabel ? (
          <span className="pointer-events-none absolute left-0 right-0 top-0 origin-left text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </span>
        ) : null}
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={showPlaceholder ? placeholder : ""}
          aria-label={fieldLabel}
          aria-describedby={hint ? hintId : undefined}
          autoComplete={type === "email" ? "email" : "given-name"}
          className={cn(
            "h-20 w-full border-0 bg-transparent px-2 text-center text-2xl font-medium text-foreground outline-none placeholder:text-muted-foreground/75 break-words sm:h-24 sm:text-3xl md:text-4xl",
            type === "text" && "capitalize"
          )}
        />
      </div>
      {hint ? (
        <p id={hintId} className="mt-4 text-center text-xs text-muted-foreground/80">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

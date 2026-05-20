"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { cn } from "@/lib/utils";

type AnimatedTextFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
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
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

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
      <div className="relative pt-8">
        <span className="pointer-events-none absolute left-0 right-0 top-0 origin-left text-center text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isActive ? placeholder : ""}
          aria-label={ariaLabel ?? label}
          autoComplete={type === "email" ? "email" : "given-name"}
          className={cn(
            "h-24 w-full border-0 bg-transparent px-0 text-center text-3xl font-medium text-foreground outline-none placeholder:text-foreground/20 md:text-4xl",
            type === "text" && "capitalize"
          )}
        />
      </div>
      {hint ? <p className="mt-5 text-center text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

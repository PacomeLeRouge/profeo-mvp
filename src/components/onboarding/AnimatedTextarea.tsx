"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import { cn } from "@/lib/utils";

type AnimatedTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  hint?: string;
  autoFocus?: boolean;
  className?: string;
  "aria-label"?: string;
};

export function AnimatedTextarea({
  value,
  onChange,
  label,
  placeholder,
  hint,
  autoFocus = true,
  className,
  "aria-label": ariaLabel,
}: AnimatedTextareaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

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
        gsap.delayedCall(0.45, () => textareaRef.current?.focus());
      }
    },
    { scope: containerRef, dependencies: [label], revertOnUpdate: true }
  );

  useGSAP(
    () => {
      gsap.to(borderRef.current, {
        scale: isFocused ? 1.01 : 1,
        boxShadow: isFocused
          ? "0 0 0 2px rgba(0,0,0,0.08), 0 20px 40px -24px rgba(0,0,0,0.25)"
          : "0 0 0 1px rgba(0,0,0,0.08), 0 0 0 0 rgba(0,0,0,0)",
        duration: prefersReducedMotion() ? 0 : 0.35,
        ease: onboardingEase.enter,
      });
    },
    { scope: containerRef, dependencies: [isFocused] }
  );

  return (
    <div ref={containerRef} className={cn("mx-auto w-full max-w-2xl", className)}>
      <p className="mb-4 text-left text-sm font-medium uppercase tracking-[0.2em] text-black/35">
        {label}
      </p>
      <div
        ref={borderRef}
        className="overflow-hidden rounded-[2rem] border border-black/10 bg-white will-change-transform"
        style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.08)" }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          aria-label={ariaLabel ?? label}
          className="min-h-[220px] w-full resize-none border-0 bg-transparent px-6 py-5 text-left text-lg leading-8 text-black outline-none placeholder:text-black/25 md:text-xl"
        />
      </div>
      {hint ? <p className="mt-4 text-left text-sm text-black/45">{hint}</p> : null}
    </div>
  );
}

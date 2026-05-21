"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion, onboardingEase } from "@/lib/gsap-config";
import type { SymbolPlacement } from "@/lib/onboarding-symbols";
import { cn } from "@/lib/utils";

type OnboardingSymbolProps = {
  src: string;
  alt: string;
  stepKey: string | number;
  placement: SymbolPlacement;
  className?: string;
  size?: number;
  /** Opacité cible de l’animation d’entrée (défaut onboarding : 0.42). */
  targetOpacity?: number;
  priority?: boolean;
};

export function OnboardingSymbol({
  src,
  alt,
  stepKey,
  placement,
  className,
  size = 320,
  targetOpacity = 0.42,
  priority = false,
}: OnboardingSymbolProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const floater = floatRef.current;
      if (!root || !floater || !isLoaded) return;

      if (prefersReducedMotion()) {
        gsap.set([root, floater], { clearProps: "all", opacity: 1, y: 0, x: 0, scale: 1, rotation: placement.rotate });
        return;
      }

      const phase = typeof stepKey === "number" ? stepKey : 1;
      const driftX = phase % 2 === 0 ? placement.floatX : -placement.floatX;

      gsap.killTweensOf([root, floater]);

      gsap.fromTo(
        root,
        { opacity: 0, scale: 0.75 },
        {
          opacity: targetOpacity,
          scale: 1,
          duration: 0.9,
          ease: onboardingEase.bounce,
        }
      );

      gsap.fromTo(
        floater,
        { y: 0, x: 0, rotation: placement.rotate - 6 },
        {
          y: -placement.floatY,
          x: driftX,
          rotation: placement.rotate + 6,
          duration: 3.2 + (phase % 4) * 0.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }
      );

      gsap.to(floater, {
        scale: 1.06,
        duration: 2.4 + (phase % 3) * 0.35,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.5,
      });
    },
    { scope: rootRef, dependencies: [stepKey, placement, targetOpacity, isLoaded], revertOnUpdate: true }
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        "pointer-events-none absolute z-0 select-none",
        !isLoaded && "opacity-0",
        className
      )}
      style={{
        top: placement.top,
        right: placement.right,
        bottom: placement.bottom,
        left: placement.left,
        transform: `translate(${placement.translateX}, ${placement.translateY})`,
      }}
      aria-hidden
    >
      <div ref={floatRef} className="relative will-change-transform">
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          priority={priority}
          onLoad={() => setIsLoaded(true)}
          className="h-auto w-[min(92vw,var(--symbol-size))] max-w-none object-contain opacity-90"
          style={{ "--symbol-size": `${size}px` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

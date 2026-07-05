"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface AmbientParticlesProps {
  count?: number;
  className?: string;
  color?: string;
}

/** Slow-drifting golden motes — pure CSS, zero per-frame JS. */
export function AmbientParticles({
  count = 18,
  className,
  color = "rgb(212 175 55 / 0.5)",
}: AmbientParticlesProps) {
  const reduced = usePrefersReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Deterministic pseudo-random spread so SSR/CSR match.
        const seed = (i * 9301 + 49297) % 233280;
        const rand = (n: number) => (((seed * (n + 1)) % 997) / 997);
        return {
          left: rand(1) * 100,
          top: rand(2) * 100,
          size: 1.5 + rand(3) * 3,
          duration: 7 + rand(4) * 9,
          delay: -rand(5) * 12,
          opacity: 0.25 + rand(6) * 0.5,
        };
      }),
    [count]
  );

  if (reduced) return null;

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full [animation:float-organic_var(--d)_ease-in-out_infinite]"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
            ["--d" as string]: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

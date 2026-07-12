"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ensureGsap } from "@/lib/animation/gsap-config";
import { cn } from "@/lib/utils";

interface PinSectionProps {
  children: ReactNode;
  className?: string;
  /** How long the pin lasts, in viewport-heights of scroll (default 1). */
  length?: number;
  /** Media query that must match for pinning (default: desktop only). */
  media?: string;
  /** Called with 0–1 progress while pinned. */
  onProgress?: (progress: number) => void;
}

/**
 * Reusable scroll pin: holds its children fixed for `length` extra
 * viewport-heights of scroll and reports progress — both to `onProgress`
 * and as a `--pin-progress` CSS variable on the wrapper, so children can
 * drive keyframes/`animation-timeline`-style effects without JS.
 *
 * On small screens and for reduced-motion users the section renders as
 * normal flow content — pinning is a desktop enhancement.
 */
export function PinSection({
  children,
  className,
  length = 1,
  media = "(min-width: 1024px)",
  onProgress,
}: PinSectionProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const { gsap, ScrollTrigger } = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add(`${media} and (prefers-reduced-motion: no-preference)`, () => {
      const st = ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: () => `+=${length * window.innerHeight}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          wrap.style.setProperty("--pin-progress", self.progress.toFixed(4));
          progressRef.current?.(self.progress);
        },
      });
      return () => st.kill();
    });

    return () => mm.revert();
  }, [length, media]);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      {children}
    </div>
  );
}

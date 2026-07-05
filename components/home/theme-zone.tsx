"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ensureGsap } from "@/lib/animation/gsap-config";

interface ThemeZoneProps {
  bg: string;
  fg: string;
  headerFg?: string;
  children: ReactNode;
  className?: string;
}

/**
 * While this zone is in view, the page background/foreground CSS vars
 * morph to its palette — the connective tissue of the scroll story.
 */
export function ThemeZone({ bg, fg, headerFg, children, className }: ThemeZoneProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();
    const root = document.documentElement;
    const apply = () =>
      gsap.to(root, {
        "--page-bg": bg,
        "--page-fg": fg,
        "--header-fg": headerFg ?? fg,
        duration: 0.9,
        ease: "power2.out",
        overwrite: "auto",
      });
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 55%",
      end: "bottom 55%",
      onEnter: apply,
      onEnterBack: apply,
    });
    return () => st.kill();
  }, [bg, fg, headerFg]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

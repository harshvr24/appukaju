"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { ensureGsap } from "@/lib/animation/gsap-config";
import { setLenis } from "@/lib/lenis";

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { gsap, ScrollTrigger } = ensureGsap();
    const lenis = new Lenis({
      lerp: 0.11,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}

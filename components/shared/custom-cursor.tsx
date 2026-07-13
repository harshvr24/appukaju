"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsap } from "@/lib/animation/gsap-config";

/**
 * Additive custom cursor: a terracotta dot plus a trailing ring that grows
 * over interactive elements and can show a micro-label declared as
 * `data-cursor="label:View"` on any ancestor. The native cursor is kept —
 * this layer only enriches it. Renders nothing on touch devices and for
 * reduced-motion users.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    const update = () => setEnabled(fine.matches);
    update();
    fine.addEventListener("change", update);
    return () => fine.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!enabled || !dot || !ring || !label) return;
    const { gsap } = ensureGsap();

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, force3D: true });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let currentLabel = "";
    const setMode = (interactive: boolean, text: string) => {
      gsap.to(ring, {
        scale: text ? 3.2 : interactive ? 1.9 : 1,
        opacity: 1,
        backgroundColor: text ? "rgb(201 111 74 / 0.92)" : "rgb(201 111 74 / 0)",
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(dot, { opacity: text ? 0 : 1, duration: 0.2 });
      if (text !== currentLabel) {
        currentLabel = text;
        label.textContent = text;
        gsap.fromTo(
          label,
          { opacity: 0, scale: 0.6 },
          { opacity: text ? 1 : 0, scale: 1, duration: 0.25, ease: "power2.out" }
        );
      }
    };

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      const el = e.target as Element | null;
      const labelled = el?.closest<HTMLElement>("[data-cursor]");
      const text = labelled?.dataset.cursor?.startsWith("label:")
        ? labelled.dataset.cursor.slice(6)
        : "";
      const interactive = !!el?.closest("a, button, [role='button'], input, textarea, select, [data-cursor]");
      setMode(interactive, text);
    };

    const onDown = () => gsap.to(ring, { scale: "-=0.3", duration: 0.15 });
    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <div
        ref={dotRef}
        className="absolute top-0 left-0 size-1.5 rounded-full bg-terracotta"
      />
      <div
        ref={ringRef}
        className="absolute top-0 left-0 grid size-8 place-items-center rounded-full border border-terracotta/70"
      >
        <span
          ref={labelRef}
          className="text-[0.3rem] font-semibold tracking-[0.12em] text-parchment uppercase opacity-0"
        />
      </div>
    </div>
  );
}

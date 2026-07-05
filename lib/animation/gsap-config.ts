"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Import-and-call from any client component that uses ScrollTrigger. */
export function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out", duration: 0.9 });
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

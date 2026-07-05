import type Lenis from "lenis";

/** Module-level singleton so any client component can drive smooth scrollTo. */
let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const getLenis = () => instance;

export function scrollToTarget(target: string | number | HTMLElement, offset = 0) {
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.4 });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else {
    const el =
      typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}

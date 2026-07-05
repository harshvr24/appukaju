import type { Variants } from "motion/react";
import { EASE_OUT_EXPO, DUR } from "./easings";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT_EXPO, delay: i * 0.08 },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.slow, ease: "easeOut" } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DUR.base, ease: EASE_OUT_EXPO },
  },
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const maskRevealUp: Variants = {
  hidden: { y: "110%" },
  visible: (i: number = 0) => ({
    y: "0%",
    transition: { duration: DUR.slow, ease: EASE_OUT_EXPO, delay: i * 0.06 },
  }),
};

export const drawerRight: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
  exit: { x: "100%", transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
};

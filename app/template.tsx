"use client";

import { motion } from "motion/react";
import { EASE_OUT_EXPO } from "@/lib/animation/easings";

/** Soft cinematic enter on every route change. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";

/** True only after client hydration — use to gate persisted-store reads. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

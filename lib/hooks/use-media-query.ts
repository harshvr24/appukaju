"use client";

import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string, serverDefault = false) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverDefault
  );
}

export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsCoarsePointer = () => useMediaQuery("(pointer: coarse)");

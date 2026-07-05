/** Shared easing curves — keep motion language consistent across FM + CSS. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_LUXE = [0.65, 0, 0.35, 1] as const;
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;

export const DUR = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
  cinematic: 1.6,
} as const;

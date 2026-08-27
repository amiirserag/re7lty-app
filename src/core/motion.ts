export const MotionTokens = {
  instant: 0.12,
  fast: 0.22,
  normal: 0.35,
  cinematic: 0.65,
  hero: 0.85,
  stagger: 0.045,
  buttonSpring: { type: "spring" as const, stiffness: 420, damping: 28 },
  cardSpring: { type: "spring" as const, stiffness: 280, damping: 26 },
  heroSpring: { type: "spring" as const, stiffness: 160, damping: 22 },
};

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function haptic(kind: "selection" | "light" | "success" = "selection") {
  try {
    if (!("vibrate" in navigator)) return;
    if (kind === "success") navigator.vibrate([12, 40, 18]);
    else if (kind === "light") navigator.vibrate(10);
    else navigator.vibrate(8);
  } catch {
    /* ignore */
  }
}

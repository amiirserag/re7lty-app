import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../core/motion";

const SPRING = { stiffness: 320, damping: 28, mass: 0.35 };

function isInteractive(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return !!target.closest(
    "button, a, [role='button'], [data-cursor], .pressable, .ios-car-card, .cta-primary, .filter-chip, .nav-item",
  );
}

/** Smooth follow cursor — AnimMasterLib-style ring + dot (desktop only). */
export function MouseCursor() {
  const [active, setActive] = useState(false);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    setActive(true);
    document.documentElement.classList.add("mouse-cursor-on");

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => setHover(isInteractive(e.target));
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("mouse-cursor-on");
    };
  }, [rawX, rawY, visible]);

  if (!active) return null;

  return (
    <div className="mouse-cursor-layer" aria-hidden>
      <motion.div
        className="mouse-cursor-ring"
        style={{ x, y }}
        animate={{
          scale: hover ? 2.4 : 1,
          opacity: visible ? (hover ? 0.45 : 0.75) : 0,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      />
      <motion.div
        className="mouse-cursor-dot"
        style={{ x, y }}
        animate={{
          scale: hover ? 0 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.12 }}
      />
    </div>
  );
}

import type { Transition, Variants } from "framer-motion";

// Brief-mandated spring. Critically damped enough to avoid bounce
// (impeccable: no bounce/elastic) while staying physics-based.
export const SPRING: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 0.5
};

export const SPRING_SOFT: Transition = {
  type: "spring",
  stiffness: 70,
  damping: 22,
  mass: 0.6
};

export const STAGGER_CONTAINER: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0.05 }
  }
};

// Each character/word: lift + 3D tip-in.
export const REVEAL_CHILD: Variants = {
  hidden: { opacity: 0, y: 22, rotateX: -40 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: SPRING }
};

// Modern focus-in: lift + de-blur. One-shot on section entry.
export const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: SPRING_SOFT
  }
};

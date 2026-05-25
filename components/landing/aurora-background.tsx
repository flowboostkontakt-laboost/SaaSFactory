"use client";

import { motion, useReducedMotion } from "framer-motion";

// Drifting violet/aqua light + a slow conic ring. Pure transform/opacity
// so it stays cheap; frozen under prefers-reduced-motion.
export function AuroraBackground() {
  const reduce = useReducedMotion();

  const float = (
    dx: number,
    dy: number,
    s: number,
    dur: number
  ) =>
    reduce
      ? undefined
      : {
          x: [0, dx, 0],
          y: [0, dy, 0],
          scale: [1, s, 1],
          transition: {
            duration: dur,
            repeat: Infinity,
            repeatType: "mirror" as const,
            ease: "easeInOut" as const
          }
        };

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        animate={float(120, -80, 1.15, 16)}
        className="absolute -left-32 top-[-10%] h-[42rem] w-[42rem] rounded-full bg-violet/25 blur-[150px]"
      />
      <motion.div
        animate={float(-140, 90, 1.2, 20)}
        className="absolute -right-24 top-1/4 h-[40rem] w-[40rem] rounded-full bg-aqua/20 blur-[160px]"
      />
      <motion.div
        animate={float(60, 120, 1.1, 24)}
        className="absolute bottom-[-20%] left-1/3 h-[38rem] w-[38rem] rounded-full bg-violet/15 blur-[170px]"
      />

      <motion.div
        animate={
          reduce
            ? undefined
            : {
                rotate: 360,
                transition: {
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear"
                }
              }
        }
        className="absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.18] [mask-image:radial-gradient(circle,transparent_55%,black_56%,black_64%,transparent_66%)]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, #7c5cff, transparent 35%, #22d3c5, transparent 70%)"
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(124,92,255,0.12),transparent_60%)]" />
    </div>
  );
}

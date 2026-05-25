"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring
} from "framer-motion";
import { cn } from "@/lib/utils";

// useSpring wants SpringOptions (no orchestration keys), not a full Transition.
const TILT_SPRING = { stiffness: 220, damping: 26, mass: 0.4 } as const;

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees toward the cursor. */
  maxTilt?: number;
};

export function SpotlightCard({
  children,
  className,
  maxTilt = 7
}: SpotlightCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Normalized pointer offset from card center, range roughly [-0.5, 0.5].
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const rotateX = useSpring(offsetY, TILT_SPRING);
  const rotateY = useSpring(offsetX, TILT_SPRING);

  // Raw cursor position (px) for the spotlight gradient.
  const pointerX = useMotionValue(-200);
  const pointerY = useMotionValue(-200);
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${pointerX}px ${pointerY}px, rgba(197, 141, 27, 0.18), transparent 70%)`;

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    pointerX.set(px);
    pointerY.set(py);
    offsetX.set((px / rect.width - 0.5) * maxTilt);
    offsetY.set(-(py / rect.height - 0.5) * maxTilt);
  }

  function handlePointerLeave() {
    offsetX.set(0);
    offsetY.set(0);
    pointerX.set(-200);
    pointerY.set(-200);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        reduce
          ? undefined
          : {
              rotateX,
              rotateY,
              transformPerspective: 1100,
              transformStyle: "preserve-3d"
            }
      }
      className={cn(
        "group relative isolate overflow-hidden rounded-[28px] border border-offwhite/10 bg-charcoal-900/70 backdrop-blur-xl will-change-transform",
        "shadow-ambient",
        className
      )}
    >
      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
      ) : null}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

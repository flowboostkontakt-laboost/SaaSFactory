"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring
} from "framer-motion";
import { cn } from "@/lib/utils";

const MAGNET_SPRING = { stiffness: 260, damping: 18, mass: 0.4 } as const;

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  /** Pixel pull strength toward the cursor. */
  strength?: number;
};

export function MagneticButton({
  href,
  children,
  variant = "primary",
  className,
  strength = 14
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, MAGNET_SPRING);
  const sy = useSpring(y, MAGNET_SPRING);

  function handleMove(event: React.PointerEvent<HTMLAnchorElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(relX * strength * 2);
    y.set(relY * strength * 2);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  const [burst, setBurst] = useState<{ id: number; x: number; y: number } | null>(
    null
  );

  function handleDown(event: React.PointerEvent<HTMLAnchorElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setBurst({
      id: Date.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  }

  return (
    <motion.div
      style={reduce ? undefined : { x: sx, y: sy }}
      className="inline-block will-change-transform"
    >
      <Link
        ref={ref}
        href={href as Route}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        onPointerDown={handleDown}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden rounded-full text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950",
          variant === "primary"
            ? "bg-violet px-7 py-3.5 text-white hover:bg-violet/90"
            : "border border-offwhite/15 px-7 py-3.5 text-offwhite hover:border-offwhite/40",
          className
        )}
      >
        <AnimatePresence>
          {burst ? (
            <motion.span
              key={burst.id}
              aria-hidden
              initial={{ opacity: 0.5, scale: 0 }}
              animate={{ opacity: 0, scale: 4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              onAnimationComplete={() => setBurst(null)}
              style={{ left: burst.x, top: burst.y }}
              className="pointer-events-none absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-md"
            />
          ) : null}
        </AnimatePresence>
        <span className="relative z-10">{children}</span>
      </Link>
    </motion.div>
  );
}

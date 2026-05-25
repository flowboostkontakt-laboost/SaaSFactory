"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <>
      <motion.div
        aria-hidden
        initial={{ y: "0%" }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
        className="pointer-events-none fixed inset-0 z-[100] bg-violet"
      >
        <div className="absolute bottom-0 left-0 h-px w-full bg-aqua/70" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </>
  );
}

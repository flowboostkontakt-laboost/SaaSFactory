"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FADE_UP } from "@/lib/motion";

export function Reveal({
  children,
  className,
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={FADE_UP}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

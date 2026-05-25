"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SPRING } from "@/lib/motion";

type RotatingWordProps = {
  words: string[];
  className?: string;
  interval?: number;
};

export function RotatingWord({
  words,
  className,
  interval = 2300
}: RotatingWordProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setIndex((p) => (p + 1) % words.length),
      interval
    );
    return () => clearInterval(id);
  }, [reduce, words.length, interval]);

  if (reduce) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      {/* invisible widest word reserves width to avoid reflow jitter */}
      <span aria-hidden className={`${className} invisible`}>
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ y: "90%", opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-90%", opacity: 0, filter: "blur(10px)" }}
          transition={SPRING}
          className={`absolute inset-0 whitespace-nowrap will-change-transform ${className ?? ""}`}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

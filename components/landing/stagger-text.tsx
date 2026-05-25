"use client";

import { motion, useReducedMotion } from "framer-motion";
import { REVEAL_CHILD, STAGGER_CONTAINER } from "@/lib/motion";

type StaggerTextProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  once?: boolean;
};

export function StaggerText({
  text,
  className,
  as = "span",
  once = true
}: StaggerTextProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  const words = text.split(" ");

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      style={{ perspective: 800 }}
      variants={STAGGER_CONTAINER}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.4 }}
    >
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className="inline-block whitespace-nowrap"
        >
          {Array.from(word).map((char, charIndex) => (
            <motion.span
              key={`${char}-${charIndex}`}
              className="inline-block will-change-transform"
              variants={REVEAL_CHILD}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 ? " " : null}
        </span>
      ))}
    </MotionTag>
  );
}

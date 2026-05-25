"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { SPRING } from "@/lib/motion";
import { ScrollProgress } from "@/components/landing/scroll-progress";

const sections = [
  { id: "pipeline", label: "How it works" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" }
];

export function LandingNav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <ScrollProgress />
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={SPRING}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-[clamp(1.25rem,4vw,3rem)] py-4 transition-colors duration-300 ${
            scrolled
              ? "border-b border-offwhite/10 bg-charcoal-950/70 backdrop-blur-xl"
              : "border-b border-transparent"
          }`}
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight text-offwhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-violet" />
            SaaS-Factory.ai
          </Link>

          <nav className="hidden items-center gap-9 text-sm md:flex">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`relative py-1 transition-colors duration-200 ${
                  active === s.id
                    ? "text-offwhite"
                    : "text-offwhite-muted hover:text-offwhite"
                }`}
              >
                {s.label}
                {active === s.id ? (
                  <motion.span
                    layoutId="nav-underline"
                    transition={SPRING}
                    className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-violet to-aqua"
                  />
                ) : null}
              </a>
            ))}
          </nav>

          <Link
            href="/dashboard"
            className="rounded-full border border-offwhite/15 bg-offwhite/[0.04] px-5 py-2 text-sm font-medium text-offwhite transition-colors duration-200 hover:border-violet/50 hover:text-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60"
          >
            Open Dashboard
          </Link>
        </div>
      </motion.header>
    </>
  );
}

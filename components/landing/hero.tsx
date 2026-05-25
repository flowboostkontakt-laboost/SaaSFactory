"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FADE_UP, SPRING } from "@/lib/motion";
import { MagneticButton } from "@/components/landing/magnetic-button";
import { HeroConsole } from "@/components/landing/hero-console";
import { AuroraBackground } from "@/components/landing/aurora-background";
import { RotatingWord } from "@/components/landing/rotating-word";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden pb-20 pt-28"
      aria-label="SaaS-Factory.ai introduction"
    >
      <AuroraBackground />

      <div className="mx-auto grid w-full max-w-7xl gap-[clamp(2.5rem,6vw,5rem)] px-[clamp(1.25rem,4vw,3rem)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-violet"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aqua" />
            Autonomous micro-SaaS foundry
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 26, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ ...SPRING, delay: 0.15 }}
            className="mt-6 max-w-[15ch] text-[clamp(2.75rem,7vw,5.25rem)] font-semibold leading-[0.98] tracking-tighter text-offwhite"
          >
            Ship{" "}
            <RotatingWord
              words={["businesses", "SaaS apps", "revenue", "products"]}
              className="text-aqua"
            />
            <br />
            while you sleep.
          </motion.h1>

          <motion.p
            variants={FADE_UP}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.25 }}
            className="mt-7 max-w-[58ch] text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-offwhite-muted"
          >
            SaaS-Factory.ai turns a single prompt into a deployed, paid, and
            self-retiring product. Architect, Developer, and Treasurer agents
            run the full loop on Locus, then sunset what stops earning.
          </motion.p>

          <motion.div
            variants={FADE_UP}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.38 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="/dashboard">
              Enter the Foundry
            </MagneticButton>
            <a
              href="#pipeline"
              className="rounded-full border border-offwhite/15 px-7 py-3.5 text-sm font-medium text-offwhite transition-colors duration-200 hover:border-violet/50 hover:text-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60"
            >
              See the pipeline
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ ...SPRING, delay: 0.3 }}
          style={{ transformPerspective: 1300 }}
          className="relative h-[clamp(20rem,42vh,28rem)]"
        >
          {!reduce ? (
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 -z-10 rounded-[36px] opacity-50 blur-2xl"
              style={{
                background:
                  "conic-gradient(from 0deg, #7c5cff, #22d3c5, #7c5cff)"
              }}
            />
          ) : null}
          <motion.div
            animate={
              reduce
                ? undefined
                : {
                    y: [0, -14, 0],
                    rotateX: [0, -2.2, 0],
                    rotateY: [0, 2.2, 0]
                  }
            }
            transition={{
              duration: 7,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }}
            style={{ transformPerspective: 1300, transformStyle: "preserve-3d" }}
            className="relative h-full overflow-hidden rounded-[28px] will-change-transform"
          >
            <HeroConsole />
            {!reduce ? (
              <motion.div
                aria-hidden
                initial={{ x: "-150%" }}
                animate={{ x: "150%" }}
                transition={{
                  duration: 3.4,
                  repeat: Infinity,
                  repeatDelay: 3.5,
                  ease: "easeInOut"
                }}
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
            ) : null}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: reduce ? 0 : 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-offwhite-faint"
      >
        Scroll
      </motion.div>
    </section>
  );
}

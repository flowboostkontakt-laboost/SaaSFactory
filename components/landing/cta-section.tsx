"use client";

import { motion } from "framer-motion";
import { FADE_UP } from "@/lib/motion";
import { SpotlightCard } from "@/components/landing/spotlight-card";
import { StaggerText } from "@/components/landing/stagger-text";
import { MagneticButton } from "@/components/landing/magnetic-button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-[clamp(1.25rem,4vw,3rem)] pb-[clamp(5rem,12vh,9rem)]">
      <SpotlightCard className="overflow-hidden" maxTilt={3}>
        <div className="relative px-[clamp(2rem,6vw,6rem)] py-[clamp(3.5rem,10vh,7rem)] text-center">
          <div className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-violet/[0.12] blur-[120px]" />

          <motion.p
            variants={FADE_UP}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            className="text-xs font-semibold uppercase tracking-[0.32em] text-violet"
          >
            Start the foundry
          </motion.p>

          <StaggerText
            as="h2"
            text="Queue your first build."
            className="mx-auto mt-6 max-w-[18ch] text-[clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1] tracking-tighter text-offwhite"
          />

          <motion.p
            variants={FADE_UP}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-offwhite-muted"
          >
            One prompt in the Command Center starts the pipeline. The dashboard
            tracks revenue, treasury, and the sunset countdown for every
            instance.
          </motion.p>

          <motion.div
            variants={FADE_UP}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            className="mt-10"
          >
            <MagneticButton href="/dashboard" className="px-8 py-4">
              Enter the Foundry
            </MagneticButton>
          </motion.div>
        </div>
      </SpotlightCard>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { FADE_UP, SPRING, STAGGER_CONTAINER } from "@/lib/motion";
import { StaggerText } from "@/components/landing/stagger-text";

const steps = [
  { k: "01", title: "Idea", body: "A single prompt enters the Command Center." },
  { k: "02", title: "Code", body: "The Developer agent generates the product from a template." },
  { k: "03", title: "Deploy", body: "Pushed to GitHub, built and shipped on Vercel." },
  { k: "04", title: "Payments", body: "Locus checkout and a dedicated sub-wallet go live." },
  { k: "05", title: "Profit", body: "The Treasurer sweeps revenue, or sunsets the instance." }
];

export function PipelineSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.8", "end 0.4"]
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.5
  });
  const dotLeft = useTransform(fill, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="pipeline"
      className="relative scroll-mt-24 border-y border-offwhite/10 bg-charcoal-900/40"
    >
      <div className="mx-auto max-w-7xl px-[clamp(1.25rem,4vw,3rem)] py-[clamp(5rem,12vh,9rem)]">
        <div className="max-w-2xl">
          <motion.p
            variants={FADE_UP}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            className="text-xs font-semibold uppercase tracking-[0.32em] text-violet"
          >
            The loop
          </motion.p>
          <StaggerText
            as="h2"
            text="From prompt to profit, without you in the middle."
            className="mt-5 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.04] tracking-tighter text-offwhite"
          />
        </div>

        <div ref={railRef} className="mt-16">
          <div className="relative mb-7 hidden h-px w-full bg-offwhite/10 lg:block">
            <motion.div
              style={{ scaleX: fill }}
              className="absolute inset-0 origin-left bg-gradient-to-r from-violet to-aqua"
            />
            <motion.span
              style={{ left: dotLeft }}
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aqua shadow-[0_0_16px_4px_rgba(34,211,197,0.6)]"
            />
          </div>

          <motion.ol
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-offwhite/10 sm:grid-cols-2 lg:grid-cols-5"
          >
            {steps.map((step) => (
              <motion.li
                key={step.k}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: SPRING }
                }}
                className="group bg-charcoal-900/60 p-7 transition-colors duration-300 hover:bg-violet/[0.06] will-change-transform"
              >
                <span className="font-mono text-xs text-violet">{step.k}</span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-offwhite">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-offwhite-muted">
                  {step.body}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

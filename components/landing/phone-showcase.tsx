"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue
} from "framer-motion";
import { IphoneFrame } from "@/components/landing/iphone-frame";
import {
  BuildingScreen,
  PaywallScreen,
  PromptScreen,
  TreasuryScreen
} from "@/components/landing/phone-screens";
import { StaggerText } from "@/components/landing/stagger-text";
import { FADE_UP } from "@/lib/motion";

const stages = [
  {
    kicker: "01 / Prompt",
    title: "Describe the business",
    body: "One sentence in the Command Center. The Architect turns it into a build spec.",
    screen: <PromptScreen />,
    window: [0, 0.02, 0.18, 0.24]
  },
  {
    kicker: "02 / Build",
    title: "Agents ship it",
    body: "Code generated, payments injected, deployed to Vercel with no human in the loop.",
    screen: <BuildingScreen />,
    window: [0.24, 0.3, 0.44, 0.5]
  },
  {
    kicker: "03 / Paid",
    title: "It earns on its own",
    body: "Every generated product ships with Locus checkout routed to its own sub-wallet.",
    screen: <PaywallScreen />,
    window: [0.5, 0.56, 0.7, 0.76]
  },
  {
    kicker: "04 / Treasury",
    title: "Profit sweeps up",
    body: "The Treasurer pulls revenue to the master wallet and sunsets what stops earning.",
    screen: <TreasuryScreen />,
    window: [0.76, 0.82, 0.98, 1]
  }
] as const;

function Caption({
  progress,
  window,
  children,
  className
}: {
  progress: MotionValue<number>;
  window: readonly number[];
  children: ReactNode;
  className?: string;
}) {
  const opacity = useTransform(progress, [...window], [0, 1, 1, 0]);
  const y = useTransform(progress, [...window], [20, 0, 0, -20]);
  return (
    <motion.div style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

export function PhoneShowcase() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // The phone screen itself scrolls with the page: a 4-screen-tall column
  // translated up as progress advances.
  const screenY = useTransform(scrollYProgress, [0.03, 0.97], ["0%", "-75%"]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-9, 7]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.97]);
  const depthY = useTransform(scrollYProgress, [0, 1], [-40, 60]);
  const blobY = useTransform(scrollYProgress, [0, 1], [-60, 80]);

  const dotRange = [0.25, 1, 1, 0.25];
  const dot0 = useTransform(scrollYProgress, [...stages[0].window], dotRange);
  const dot1 = useTransform(scrollYProgress, [...stages[1].window], dotRange);
  const dot2 = useTransform(scrollYProgress, [...stages[2].window], dotRange);
  const dot3 = useTransform(scrollYProgress, [...stages[3].window], dotRange);
  const dots = [dot0, dot1, dot2, dot3];

  if (reduce) {
    return (
      <section className="mx-auto max-w-7xl px-[clamp(1.25rem,4vw,3rem)] py-[clamp(4rem,9vh,7rem)]">
        <StaggerText
          as="h2"
          text="From a sentence to a self-running business."
          className="max-w-2xl text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.04] tracking-tighter text-offwhite"
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_auto]">
          <ul className="space-y-7">
            {stages.map((s) => (
              <li key={s.kicker}>
                <p className="font-mono text-xs text-violet">{s.kicker}</p>
                <p className="mt-2 text-lg font-semibold text-offwhite">
                  {s.title}
                </p>
                <p className="mt-1 max-w-md text-sm text-offwhite-muted">
                  {s.body}
                </p>
              </li>
            ))}
          </ul>
          <div className="w-[clamp(15rem,70vw,17rem)] justify-self-center">
            <IphoneFrame>
              <PaywallScreen />
            </IphoneFrame>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden py-[clamp(4rem,11vh,8rem)]">
        <motion.div
          aria-hidden
          style={{ y: blobY }}
          className="absolute right-[8%] top-1/4 -z-10 h-[32rem] w-[32rem] rounded-full bg-violet/[0.08] blur-[150px]"
        />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-[clamp(2rem,6vw,5rem)] px-[clamp(1.25rem,4vw,3rem)] lg:grid-cols-[1fr_0.9fr]">
          <div>
            <motion.p
              variants={FADE_UP}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.6 }}
              className="text-xs font-semibold uppercase tracking-[0.32em] text-violet"
            >
              Watch one run
            </motion.p>
            <StaggerText
              as="h2"
              text="From a sentence to a self-running business."
              className="mt-5 max-w-xl text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.04] tracking-tighter text-offwhite"
            />

            <div className="relative mt-9 h-40">
              {stages.map((stage) => (
                <Caption
                  key={stage.kicker}
                  progress={scrollYProgress}
                  window={stage.window}
                  className="absolute inset-0"
                >
                  <p className="font-mono text-xs text-violet">{stage.kicker}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-offwhite">
                    {stage.title}
                  </p>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-offwhite-muted">
                    {stage.body}
                  </p>
                </Caption>
              ))}
            </div>

            <div className="mt-8 flex gap-2">
              {stages.map((stage, i) => (
                <motion.span
                  key={stage.kicker}
                  style={{ opacity: dots[i] }}
                  className="h-1.5 w-10 rounded-full bg-violet"
                />
              ))}
            </div>
          </div>

          <div
            className="relative flex justify-center"
            style={{ perspective: 1400 }}
          >
            <motion.div
              aria-hidden
              style={{ y: depthY }}
              className="absolute right-0 top-12 w-[clamp(10rem,20vw,13rem)] opacity-25 blur-[2px]"
            >
              <IphoneFrame>
                <TreasuryScreen />
              </IphoneFrame>
            </motion.div>

            <motion.div
              style={{ rotateY, scale, transformStyle: "preserve-3d" }}
              className="relative w-[clamp(15rem,29vw,18rem)] will-change-transform"
            >
              <IphoneFrame>
                <motion.div
                  style={{ y: screenY }}
                  className="absolute inset-x-0 top-0 h-[400%] will-change-transform"
                >
                  {stages.map((stage) => (
                    <div key={stage.kicker} className="h-1/4">
                      {stage.screen}
                    </div>
                  ))}
                </motion.div>
              </IphoneFrame>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

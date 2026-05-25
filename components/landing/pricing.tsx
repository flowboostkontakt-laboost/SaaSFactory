"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform
} from "framer-motion";
import { cn } from "@/lib/utils";
import { FADE_UP, SPRING } from "@/lib/motion";
import { StaggerText } from "@/components/landing/stagger-text";
import { MagneticButton } from "@/components/landing/magnetic-button";
import { CountUp } from "@/components/landing/count-up";

const tiers = [
  {
    name: "Solo",
    price: "$0",
    cadence: "forever",
    blurb: "Run a single business by hand.",
    features: [
      "1 active micro-SaaS",
      "Manual pipeline runs",
      "Bring your own keys",
      "Community support"
    ],
    cta: "Open dashboard",
    featured: false
  },
  {
    name: "Operator",
    price: "$49",
    cadence: "per month",
    blurb: "Let the agents run the portfolio.",
    features: [
      "Up to 10 active instances",
      "Automated pipeline and deploy",
      "Treasury sweep and reserve",
      "72h sunset automation",
      "Priority email support"
    ],
    cta: "Enter the Foundry",
    featured: true
  },
  {
    name: "Fund",
    price: "Custom",
    cadence: "annual",
    blurb: "Operate a micro-SaaS fund at scale.",
    features: [
      "Unlimited instances",
      "Dedicated sub-wallets",
      "Priority pipeline lane",
      "Audit logs and SLA"
    ],
    cta: "Talk to us",
    featured: false
  }
] as const;

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-4 w-4 shrink-0 text-violet"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function TierCard({
  tier,
  active
}: {
  tier: (typeof tiers)[number];
  active: boolean;
}) {
  return (
    <motion.div
      animate={{ scale: active ? 1.04 : 0.96, opacity: active ? 1 : 0.62 }}
      transition={SPRING}
      className={cn(
        "relative flex h-full w-full flex-col rounded-[28px] border p-8",
        tier.featured
          ? "border-violet/40 bg-violet/[0.07] shadow-ambient"
          : "border-offwhite/10 bg-charcoal-900/60"
      )}
    >
      {tier.featured ? (
        <span className="absolute right-8 top-8 rounded-full bg-violet px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
          Most popular
        </span>
      ) : null}

      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-offwhite-faint">
        {tier.name}
      </p>
      <div className="mt-6 flex items-end gap-2">
        <span className="text-5xl font-semibold tracking-tighter text-offwhite">
          {tier.name === "Operator" ? (
            <CountUp value={49} prefix="$" />
          ) : (
            tier.price
          )}
        </span>
        <span className="pb-1.5 text-sm text-offwhite-muted">
          {tier.cadence}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-offwhite-muted">
        {tier.blurb}
      </p>

      <ul className="mt-8 flex-1 space-y-3.5">
        {tier.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm text-offwhite/75">
            <Check />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-9">
        {tier.featured ? (
          <MagneticButton href="/dashboard" className="w-full px-7 py-3.5">
            {tier.cta}
          </MagneticButton>
        ) : (
          <Link
            href={"/dashboard" as Route}
            tabIndex={active ? 0 : -1}
            className="flex w-full items-center justify-center rounded-full border border-offwhite/15 px-7 py-3.5 text-sm font-semibold text-offwhite transition-colors duration-200 hover:border-offwhite/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60"
          >
            {tier.cta}
          </Link>
        )}
      </div>
    </motion.div>
  );
}

function Header() {
  return (
    <div className="mx-auto w-full max-w-7xl px-[clamp(1.25rem,4vw,3rem)]">
      <motion.p
        variants={FADE_UP}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        className="text-xs font-semibold uppercase tracking-[0.32em] text-violet"
      >
        Pricing
      </motion.p>
      <StaggerText
        as="h2"
        text="Pay for throughput, not seats."
        className="mt-5 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.04] tracking-tighter text-offwhite"
      />
    </div>
  );
}

export function Pricing() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const last = tiers.length - 1;
  // Subtle horizontal drift so the row reads as a carousel while all 3 stay visible.
  const rowX = useTransform(scrollYProgress, [0, 1], ["3.5%", "-3.5%"]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const clamped = Math.min(1, Math.max(0, (p - 0.06) / 0.88));
    setActive(Math.round(clamped * last));
  });

  function jumpTo(i: number) {
    const el = sectionRef.current;
    if (!el) return;
    const frac = 0.06 + (i / last) * 0.88;
    const top =
      el.offsetTop + frac * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: "smooth" });
  }

  if (reduce) {
    return (
      <section
        id="pricing"
        className="mx-auto max-w-7xl scroll-mt-24 px-[clamp(1.25rem,4vw,3rem)] py-[clamp(4rem,10vh,7.5rem)]"
      >
        <Header />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <TierCard key={tier.name} tier={tier} active />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative h-[200vh] scroll-mt-24"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-[clamp(2.5rem,6vh,4rem)] overflow-hidden py-[clamp(4rem,10vh,7rem)]">
        <Header />

        <motion.div
          style={{ x: rowX }}
          className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-5 px-[clamp(1.25rem,4vw,3rem)] lg:grid-cols-3"
        >
          {tiers.map((tier, i) => (
            <TierCard key={tier.name} tier={tier} active={i === active} />
          ))}
        </motion.div>

        <div className="flex items-center justify-center gap-3">
          {tiers.map((tier, i) => (
            <button
              key={tier.name}
              type="button"
              aria-label={`Go to ${tier.name} plan`}
              aria-current={i === active}
              onClick={() => jumpTo(i)}
              className="group p-1.5"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-10 bg-gradient-to-r from-violet to-aqua"
                    : "w-3 bg-offwhite/20 group-hover:bg-offwhite/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/landing/spotlight-card";
import { StaggerText } from "@/components/landing/stagger-text";
import { FADE_UP } from "@/lib/motion";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold tracking-tight text-offwhite">
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-offwhite-faint">
        {label}
      </p>
    </div>
  );
}

const agents = [
  { name: "Architect", role: "decomposes the prompt into a build spec" },
  { name: "Developer", role: "generates code and injects Locus payments" },
  { name: "Treasurer", role: "tracks revenue and sweeps profit" }
];

export function BentoGrid() {
  return (
    <section className="relative mx-auto max-w-7xl px-[clamp(1.25rem,4vw,3rem)] py-[clamp(5rem,12vh,9rem)]">
      <div className="max-w-2xl">
        <motion.p
          variants={FADE_UP}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className="text-xs font-semibold uppercase tracking-[0.32em] text-violet"
        >
          One system, end to end
        </motion.p>
        <StaggerText
          as="h2"
          text="Everything a micro-SaaS needs, run by agents."
          className="mt-5 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.04] tracking-tighter text-offwhite"
        />
      </div>

      <div className="mt-14 grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-6">
        <SpotlightCard className="p-8 sm:p-10 lg:col-span-4 lg:row-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-offwhite-faint">
            The pipeline
          </p>
          <h3 className="mt-4 max-w-md text-2xl font-semibold tracking-tight text-offwhite sm:text-3xl">
            The loop runs itself.
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-offwhite-muted">
            Idea, code, deployment, payments, profit. Three agents own the
            handoffs so you never touch the operational middle.
          </p>

          <div className="mt-9 space-y-px overflow-hidden rounded-2xl border border-offwhite/10">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="flex items-baseline gap-4 bg-offwhite/[0.02] px-5 py-4"
              >
                <span className="w-24 shrink-0 text-sm font-semibold text-violet">
                  {agent.name}
                </span>
                <span className="text-sm text-offwhite-muted">
                  {agent.role}
                </span>
              </div>
            ))}
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-8 lg:col-span-2 lg:row-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-offwhite-faint">
            Paygentic
          </p>
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-offwhite">
            Payments, pre-wired.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-offwhite-muted">
            Every generated product ships with a shared Locus checkout. Each
            instance gets its own sub-wallet. No keys ever reach the client.
          </p>
          <div className="mt-8 rounded-2xl border border-violet/25 bg-violet/[0.07] p-5">
            <p className="font-mono text-sm text-offwhite/80">
              1 generation = 1 USDC
            </p>
            <p className="mt-2 text-xs text-offwhite-faint">
              Routed straight to the project sub-wallet.
            </p>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-8 lg:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-offwhite-faint">
            Ephemeral by design
          </p>
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-offwhite">
            72 hours, or it sunsets.
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-offwhite-muted">
            No transaction for three days and the instance is archived
            automatically. Capital never sits on a dead product.
          </p>
        </SpotlightCard>

        <SpotlightCard className="flex flex-col justify-between gap-8 p-8 lg:col-span-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-offwhite-faint">
              Treasury
            </p>
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-offwhite">
              Profit sweeps upward.
            </h3>
          </div>
          <div className="flex items-end justify-between gap-6">
            <Stat value="Auto" label="profit sweep" />
            <Stat value="Reserve" label="kept for AI cost" />
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-8 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-offwhite-faint">
            Deploy
          </p>
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-offwhite">
            GitHub to Vercel.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-offwhite-muted">
            Repo created, code pushed, environment provisioned, live URL
            tracked. Idempotent on retry.
          </p>
        </SpotlightCard>

        <SpotlightCard className="lg:col-span-4">
          <Link
            href="/dashboard"
            className="flex h-full flex-col justify-between gap-8 p-8 sm:p-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-offwhite-faint">
              Founder dashboard
            </p>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h3 className="max-w-sm text-2xl font-semibold tracking-tight text-offwhite sm:text-3xl">
                Watch the portfolio run live.
              </h3>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-violet">
                Open dashboard
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </Link>
        </SpotlightCard>
      </div>
    </section>
  );
}

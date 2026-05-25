"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SPRING_SOFT } from "@/lib/motion";
import { StaggerText } from "@/components/landing/stagger-text";

const faqs = [
  {
    q: "What actually gets generated?",
    a: "A working micro-SaaS from a controlled template. The Architect writes the spec, the Developer fills the template and injects the shared Locus payment module."
  },
  {
    q: "How do payments work?",
    a: "Every generated product ships with one shared checkout. The backend creates a Locus session and routes funds to a sub-wallet dedicated to that instance. No secret keys ever reach the client."
  },
  {
    q: "What is the 72 hour sunset?",
    a: "If an instance takes no transaction for 72 hours it is flagged, then its deployment is removed and the repository archived. Capital never sits on a product that stopped earning."
  },
  {
    q: "Where does it deploy?",
    a: "Code is pushed to GitHub and built on Vercel. The live URL is tracked back on the project, and webhooks keep deployment status in sync."
  },
  {
    q: "Do I keep the revenue?",
    a: "Yes. The Treasurer sweeps profit to your master wallet on a schedule and keeps a reserve for AI and transaction costs."
  },
  {
    q: "Is it fully autonomous?",
    a: "The MVP is intentionally semi-autonomous: real orchestration, real payments, real sunset logic, on a controlled set of templates. Full hands-off autonomy is out of scope on purpose."
  }
];

function FaqRow({
  q,
  a,
  open,
  onToggle
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border-b transition-colors duration-300 ${
        open ? "border-aqua/30" : "border-offwhite/10"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60"
      >
        <span
          className={`text-lg font-semibold tracking-tight transition-colors duration-200 ${
            open ? "text-aqua" : "text-offwhite"
          }`}
        >
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={SPRING_SOFT}
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-200 ${
            open
              ? "border-aqua/50 text-aqua"
              : "border-offwhite/15 text-offwhite-muted"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING_SOFT}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 text-sm leading-relaxed text-offwhite-muted">
              {a}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="mx-auto max-w-7xl scroll-mt-24 px-[clamp(1.25rem,4vw,3rem)] py-[clamp(4rem,10vh,7.5rem)]"
    >
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-violet">
            FAQ
          </p>
          <StaggerText
            as="h2"
            text="The questions founders ask first."
            className="mt-5 max-w-sm text-[clamp(2rem,4.2vw,3rem)] font-semibold leading-[1.05] tracking-tighter text-offwhite"
          />
        </div>

        <div>
          {faqs.map((item, i) => (
            <FaqRow
              key={item.q}
              q={item.q}
              a={item.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import type { ReactNode } from "react";

type Brand = { name: string; mark: ReactNode };

const brands: Brand[] = [
  {
    name: "Vercel",
    mark: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path d="M12 3l10 18H2z" fill="currentColor" />
      </svg>
    )
  },
  {
    name: "GitHub",
    mark: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          fill="currentColor"
          d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0012 2z"
        />
      </svg>
    )
  },
  {
    name: "OpenAI",
    mark: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <circle
          cx="12"
          cy="12"
          r="8.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
      </svg>
    )
  },
  {
    name: "Next.js",
    mark: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <circle cx="12" cy="12" r="9.5" fill="currentColor" />
        <path d="M9 8v8M15 8l-5 8" stroke="#0a0a09" strokeWidth="1.6" />
      </svg>
    )
  },
  {
    name: "Stripe",
    mark: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <rect x="3" y="6" width="18" height="12" rx="3" fill="currentColor" />
      </svg>
    )
  },
  {
    name: "Locus",
    mark: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <circle
          cx="12"
          cy="12"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    )
  }
];

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-[clamp(2.5rem,6vw,5rem)] pr-[clamp(2.5rem,6vw,5rem)]"
      aria-hidden={ariaHidden}
    >
      {brands.map((brand) => (
        <div
          key={`${ariaHidden ? "dup" : "src"}-${brand.name}`}
          className="flex items-center gap-2.5 text-offwhite/45 transition-all duration-300 hover:-translate-y-0.5 hover:text-offwhite/80"
        >
          {brand.mark}
          <span className="text-base font-semibold tracking-tight">
            {brand.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function LogoCloud() {
  return (
    <section className="border-y border-offwhite/10 bg-charcoal-950/60">
      <div className="mx-auto max-w-7xl px-[clamp(1.25rem,4vw,3rem)] py-12">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-offwhite-faint">
          Runs on infrastructure you already trust
        </p>
        <div className="marquee group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="marquee-track flex w-max">
            <Row />
            <Row ariaHidden />
          </div>
        </div>
      </div>
    </section>
  );
}

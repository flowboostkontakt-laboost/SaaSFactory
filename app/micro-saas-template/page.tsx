import { AppShell } from "@/components/dashboard/app-shell";
import { Reveal } from "@/components/dashboard/reveal";

export default function MicroSaasTemplatePage() {
  return (
    <AppShell back={{ href: "/dashboard", label: "Back to dashboard" }}>
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-violet">
          Template preview
        </p>
        <h1 className="mt-4 max-w-3xl text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-tighter text-offwhite">
          The shared shell every generated tool ships with.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-offwhite-muted">
          Hero, tool interface, results and a Locus paywall in one reusable,
          payment-ready layout. Intentionally generic.
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-12 overflow-hidden rounded-[32px] border border-offwhite/10 bg-charcoal-900/50 p-3 backdrop-blur-xl">
          <div className="rounded-[24px] border border-offwhite/10 bg-charcoal-950/60 p-8 sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-aqua">
              Generated product
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tighter text-offwhite sm:text-4xl">
              Hero, tool, results and paywall.
            </h2>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
              <div className="rounded-[24px] border border-offwhite/10 bg-offwhite/[0.03] p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-offwhite-faint">
                  Tool interface
                </p>
                <label className="mt-5 block text-sm font-medium text-offwhite-muted">
                  Prompt
                  <textarea
                    className="mt-3 min-h-40 w-full resize-none rounded-[18px] border border-offwhite/10 bg-charcoal-950/60 px-4 py-3 text-offwhite outline-none placeholder:text-offwhite-faint"
                    placeholder="Describe the output the user wants to generate..."
                    readOnly
                  />
                </label>
              </div>

              <div className="space-y-6">
                <div className="rounded-[24px] border border-offwhite/10 bg-offwhite/[0.03] p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-offwhite-faint">
                    Results section
                  </p>
                  <div className="mt-4 rounded-[18px] border border-offwhite/10 bg-charcoal-950/60 p-5 text-sm leading-7 text-offwhite-muted">
                    Generated output placeholder. In MVP this renders the
                    product-specific result after the user completes the flow.
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[24px] border border-violet/30 bg-violet/10 p-7">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet/30 blur-3xl"
                  />
                  <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-violet">
                    Payment trigger
                  </p>
                  <p className="relative mt-3 text-3xl font-semibold tracking-tighter text-offwhite">
                    1 generation = 1 USDC
                  </p>
                  <p className="relative mt-3 text-sm leading-relaxed text-offwhite-muted">
                    Shared checkout entrypoint for Locus session creation.
                  </p>
                  <button
                    className="relative mt-6 rounded-full bg-violet px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-violet/90"
                    type="button"
                  >
                    Open Locus Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </AppShell>
  );
}

import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { NoiseOverlay } from "@/components/landing/noise-overlay";

type AppShellProps = {
  children: ReactNode;
  back?: { href: string; label: string };
};

export function AppShell({ children, back }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-charcoal-950 text-offwhite">
      <NoiseOverlay />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(ellipse_at_top,rgba(124,92,255,0.16),transparent_60%)]"
      />

      <header className="sticky top-0 z-40 border-b border-offwhite/10 bg-charcoal-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-[clamp(1.25rem,4vw,3rem)] py-4">
          <div className="flex items-center gap-5">
            <Link
              href={"/" as Route}
              className="flex items-center gap-2 text-sm font-semibold tracking-tight text-offwhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-violet" />
              SaaS-Factory.ai
            </Link>
            <span className="hidden text-xs uppercase tracking-[0.24em] text-offwhite-faint sm:inline">
              Founder Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            {back ? (
              <Link
                href={back.href as Route}
                className="rounded-full border border-offwhite/15 px-4 py-2 text-sm font-medium text-offwhite-muted transition-colors duration-200 hover:border-offwhite/40 hover:text-offwhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60"
              >
                {back.label}
              </Link>
            ) : null}
            <Link
              href={"/settings" as Route}
              className="rounded-full border border-offwhite/15 px-4 py-2 text-sm font-medium text-offwhite-muted transition-colors duration-200 hover:border-violet/50 hover:text-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60"
            >
              Settings
            </Link>
            <Link
              href={"/" as Route}
              className="hidden rounded-full border border-offwhite/15 px-4 py-2 text-sm font-medium text-offwhite-muted transition-colors duration-200 hover:border-violet/50 hover:text-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60 sm:inline-flex"
            >
              View site
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-[clamp(1.25rem,4vw,3rem)] py-[clamp(2.5rem,6vh,4.5rem)]">
        {children}
      </main>
    </div>
  );
}

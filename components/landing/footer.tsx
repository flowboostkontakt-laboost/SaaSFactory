import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-offwhite/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-[clamp(1.25rem,4vw,3rem)] py-10 text-sm text-offwhite-faint sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-violet" />
          <span className="font-semibold tracking-tight text-offwhite">
            SaaS-Factory.ai
          </span>
        </div>
        <p>Autonomous micro-SaaS foundry on Locus.</p>
        <Link
          href="/dashboard"
          className="text-offwhite-muted transition-colors duration-200 hover:text-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60"
        >
          Open dashboard
        </Link>
      </div>
    </footer>
  );
}

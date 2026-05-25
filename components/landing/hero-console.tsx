const lines = [
  { tag: "architect", text: "spec: privacy-policy generator for Web3 shops", tone: "violet" },
  { tag: "developer", text: "scaffolding template + LocusPayButton injected", tone: "off" },
  { tag: "deploy", text: "vercel build ready -> live in 41s", tone: "off" },
  { tag: "treasurer", text: "sub-wallet funded, sweep threshold armed", tone: "violet" }
];

export function HeroConsole() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-offwhite/10 bg-charcoal-900/80 shadow-ambient">
      <div className="flex items-center gap-2 border-b border-offwhite/10 px-5 py-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-offwhite/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-offwhite/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-violet/70" />
        <span className="ml-3 text-xs font-medium tracking-tight text-offwhite-muted">
          foundry / pipeline.live
        </span>
      </div>

      <div className="flex-1 space-y-3 p-5 font-mono text-[13px] leading-relaxed sm:p-6">
        {lines.map((line) => (
          <div key={line.tag} className="flex items-start gap-3">
            <span
              className={`mt-0.5 w-24 shrink-0 text-right text-[11px] uppercase tracking-[0.18em] ${
                line.tone === "violet" ? "text-violet" : "text-offwhite-faint"
              }`}
            >
              {line.tag}
            </span>
            <span className="text-offwhite/80">{line.text}</span>
          </div>
        ))}

        <div className="flex items-center gap-3 pt-1">
          <span className="w-24 shrink-0 text-right text-[11px] uppercase tracking-[0.18em] text-offwhite-faint">
            status
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-violet">
            <span className="h-1.5 w-1.5 rounded-full bg-violet" />
            active
          </span>
        </div>
      </div>
    </div>
  );
}

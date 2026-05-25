function StatusBar({ dark = false }: { dark?: boolean }) {
  const tone = dark ? "text-offwhite" : "text-ink";
  return (
    <div
      className={`flex items-center justify-between px-7 pt-3.5 text-[11px] font-semibold ${tone}`}
    >
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden>
          <rect x="0" y="7" width="3" height="4" rx="1" fill="currentColor" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" fill="currentColor" />
          <rect x="9" y="3" width="3" height="8" rx="1" fill="currentColor" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" fill="currentColor" />
        </svg>
        <svg width="22" height="11" viewBox="0 0 22 11" fill="none" aria-hidden>
          <rect
            x="0.5"
            y="0.5"
            width="18"
            height="10"
            rx="2.5"
            stroke="currentColor"
            opacity="0.4"
          />
          <rect x="2.5" y="2.5" width="12" height="6" rx="1" fill="currentColor" />
          <rect x="20" y="3.5" width="2" height="4" rx="1" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

export function PromptScreen() {
  return (
    <div className="flex h-full flex-col bg-paper text-ink">
      <StatusBar />
      <div className="flex items-center gap-2 px-7 pb-4 pt-6">
        <span className="h-2 w-2 rounded-full bg-violet" />
        <span className="text-[13px] font-semibold tracking-tight">
          Command Center
        </span>
      </div>
      <div className="flex-1 px-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">
          New build
        </p>
        <div className="mt-3 rounded-2xl border border-ink/10 bg-white p-4 text-[13px] leading-relaxed text-ink/75">
          Build a privacy policy generator for Web3 shops, charge 1 USDC per
          document.
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["tool", "1 USDC", "USDC"].map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-ink/[0.06] px-3 py-1 text-[11px] font-medium text-ink/60"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
      <div className="px-7 pb-10">
        <div className="rounded-full bg-violet py-3.5 text-center text-[13px] font-semibold text-white">
          Create Project
        </div>
      </div>
    </div>
  );
}

export function BuildingScreen() {
  const stages = [
    { name: "Architecting", state: "done" },
    { name: "Coding", state: "done" },
    { name: "Deploying", state: "active" },
    { name: "Integrating Payments", state: "idle" },
    { name: "Active", state: "idle" }
  ];
  return (
    <div className="flex h-full flex-col bg-paper text-ink">
      <StatusBar />
      <div className="px-7 pb-4 pt-6">
        <span className="text-[13px] font-semibold tracking-tight">
          Privacy Forge
        </span>
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-violet">
          Building
        </p>
      </div>
      <div className="flex-1 space-y-2 px-7">
        {stages.map((stage) => (
          <div
            key={stage.name}
            className="flex items-center gap-3 rounded-xl border border-ink/[0.07] bg-white px-4 py-3"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                stage.state === "done"
                  ? "bg-moss text-white"
                  : stage.state === "active"
                    ? "bg-violet text-white"
                    : "bg-ink/10 text-ink/40"
              }`}
            >
              {stage.state === "done" ? "✓" : ""}
            </span>
            <span
              className={`text-[13px] ${
                stage.state === "idle"
                  ? "text-ink/40"
                  : "font-medium text-ink/80"
              }`}
            >
              {stage.name}
            </span>
          </div>
        ))}
      </div>
      <div className="px-7 pb-10 pt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
          <div className="h-full w-3/5 rounded-full bg-violet" />
        </div>
      </div>
    </div>
  );
}

export function PaywallScreen() {
  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#fff8ef,#f8f7f4)] text-ink">
      <StatusBar />
      <div className="flex flex-1 flex-col px-7 pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ember">
          Privacy Forge
        </p>
        <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight">
          Your policy is ready.
        </h3>
        <p className="mt-3 text-[13px] leading-relaxed text-ink/60">
          Unlock the full document and download formats.
        </p>
        <div className="mt-auto mb-6 rounded-3xl bg-ember p-6 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
            Locus Checkout
          </p>
          <p className="mt-3 text-2xl font-semibold">1 generation = 1 USDC</p>
          <div className="mt-5 rounded-full bg-white py-3 text-center text-[13px] font-semibold text-ember">
            Pay with Locus
          </div>
        </div>
      </div>
    </div>
  );
}

export function TreasuryScreen() {
  const rows = [
    { label: "Privacy Forge", amount: "+ 128.00" },
    { label: "SEO Pulse", amount: "+ 41.50" },
    { label: "Sweep to master", amount: "- 150.00" }
  ];
  return (
    <div className="flex h-full flex-col bg-charcoal-950 text-offwhite">
      <StatusBar dark />
      <div className="px-7 pb-5 pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-offwhite-faint">
          Treasury
        </p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">
          $1,284.50
          <span className="ml-2 text-sm font-medium text-offwhite-muted">
            USDC
          </span>
        </p>
      </div>
      <div className="flex items-end gap-1.5 px-7 pb-5">
        {[34, 52, 41, 68, 59, 80, 72].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-violet/70"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
      <div className="flex-1 space-y-2 px-7 pb-10">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-xl border border-offwhite/10 bg-offwhite/[0.03] px-4 py-3"
          >
            <span className="text-[13px] text-offwhite-muted">{row.label}</span>
            <span
              className={`font-mono text-[13px] ${
                row.amount.startsWith("-") ? "text-offwhite-faint" : "text-violet"
              }`}
            >
              {row.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

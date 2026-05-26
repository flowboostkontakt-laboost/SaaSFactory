import { formatDateTime, formatUsdc } from "@/lib/formatters";
import type { TreasurySummary } from "@/types/domain";

const spark = [38, 52, 44, 67, 58, 79, 71];

export function TreasuryPanel({ summary }: { summary: TreasurySummary }) {
  const funding = Number(summary.globalTreasuryUsdc) >= Number(summary.reserveUsdc);
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-violet/25 bg-charcoal-900/70 p-7 backdrop-blur-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet/25 blur-3xl"
      />

      <p className="relative text-xs font-semibold uppercase tracking-[0.24em] text-offwhite-faint">
        Treasury
      </p>
      <p className="relative mt-4 text-4xl font-semibold tracking-tighter text-offwhite">
        {formatUsdc(summary.globalTreasuryUsdc)}
      </p>

      <div className="relative mt-5 flex items-end gap-1.5">
        {spark.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-gradient-to-t from-violet/40 to-aqua/70"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      <div className="relative mt-6 flex gap-6 text-sm text-offwhite-muted">
        <span>
          <span className="font-semibold text-offwhite">
            {summary.activeProjects}
          </span>{" "}
          active
        </span>
        <span>
          <span className="font-semibold text-offwhite">
            {summary.sunsetPendingProjects}
          </span>{" "}
          sunset pending
        </span>
      </div>

      {/* Reserve guard: the foundry only builds what it can afford. */}
      <div
        className={`relative mt-6 flex items-center justify-between gap-4 rounded-[20px] border p-4 ${
          funding
            ? "border-aqua/30 bg-aqua/[0.06]"
            : "border-rose-500/30 bg-rose-500/[0.06]"
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                funding ? "animate-pulse bg-aqua" : "bg-rose-400"
              }`}
            />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-offwhite">
              Reserve guard
            </p>
          </div>
          <p className="mt-1.5 text-xs text-offwhite-muted">
            {funding
              ? "Funding new builds"
              : "Builds paused — protecting reserve"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-offwhite-faint">Reserve floor</p>
          <p className="text-sm font-semibold text-offwhite">
            {formatUsdc(summary.reserveUsdc)}
          </p>
        </div>
      </div>

      <div className="relative mt-6 space-y-3">
        {summary.wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="rounded-[20px] border border-offwhite/10 bg-offwhite/[0.03] p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-offwhite">
                {wallet.walletType.replaceAll("_", " ")}
              </p>
              <p className="text-sm text-offwhite-muted">
                {formatUsdc(wallet.balance)}
              </p>
            </div>
            <p className="mt-2 text-xs text-offwhite-faint">
              Synced {formatDateTime(wallet.lastSyncedAt)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

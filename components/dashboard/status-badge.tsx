import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/domain";

const statusStyles: Record<ProjectStatus, { wrap: string; dot: string }> = {
  draft: { wrap: "bg-offwhite/10 text-offwhite-muted", dot: "bg-offwhite-muted" },
  architecting: { wrap: "bg-violet/15 text-violet", dot: "bg-violet" },
  coding: { wrap: "bg-sky-400/15 text-sky-300", dot: "bg-sky-400" },
  deploying: { wrap: "bg-indigo-400/15 text-indigo-300", dot: "bg-indigo-400" },
  integrating_payments: {
    wrap: "bg-amber-400/15 text-amber-300",
    dot: "bg-amber-400"
  },
  active: { wrap: "bg-aqua/15 text-aqua", dot: "bg-aqua" },
  under_evaluation: {
    wrap: "bg-orange-400/15 text-orange-300",
    dot: "bg-orange-400"
  },
  sunset_pending: { wrap: "bg-rose-500/15 text-rose-300", dot: "bg-rose-400" },
  archived: { wrap: "bg-offwhite/10 text-offwhite-faint", dot: "bg-offwhite-faint" },
  failed: { wrap: "bg-red-500/20 text-red-300", dot: "bg-red-400" }
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const style = statusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        style.wrap
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {status.replaceAll("_", " ")}
    </span>
  );
}

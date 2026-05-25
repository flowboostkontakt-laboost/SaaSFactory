import { SpotlightCard } from "@/components/landing/spotlight-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatDateTime, formatUsdc } from "@/lib/formatters";
import type { Project } from "@/types/domain";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <SpotlightCard className="h-full p-6" maxTilt={5}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-offwhite-faint">
            {project.slug}
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-offwhite">
            {project.name}
          </h3>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <p className="mt-4 line-clamp-2 max-w-xl text-sm leading-6 text-offwhite-muted">
        {project.prompt}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-offwhite/10 bg-offwhite/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-offwhite-faint">
            Revenue
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-aqua">
            {formatUsdc(project.revenueUsdc)}
          </p>
        </div>
        <div className="rounded-2xl border border-offwhite/10 bg-offwhite/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-offwhite-faint">
            Live URL
          </p>
          <p className="mt-2 truncate text-sm font-medium text-offwhite">
            {project.liveUrl || "Pending deployment"}
          </p>
        </div>
        <div className="rounded-2xl border border-offwhite/10 bg-offwhite/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-offwhite-faint">
            Last Transaction
          </p>
          <p className="mt-2 text-sm font-medium text-offwhite">
            {formatDateTime(project.lastTransactionAt)}
          </p>
        </div>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-rose-300/80">
            Sunset Threshold
          </p>
          <p className="mt-2 text-sm font-semibold text-rose-200">
            {formatDateTime(project.sunsetAt)}
          </p>
        </div>
      </div>
    </SpotlightCard>
  );
}

import type { ProjectRun, RunStatus } from "@/types/domain";

const statusTone: Record<RunStatus, string> = {
  queued: "bg-offwhite/15 text-offwhite-muted",
  in_progress: "bg-violet/15 text-violet",
  completed: "bg-aqua/15 text-aqua",
  failed: "bg-red-500/20 text-red-300"
};

const dotTone: Record<RunStatus, string> = {
  queued: "bg-offwhite-faint",
  in_progress: "bg-violet",
  completed: "bg-aqua",
  failed: "bg-red-400"
};

export function RunTimeline({ runs }: { runs: ProjectRun[] }) {
  return (
    <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-[1.15rem] before:top-2 before:w-px before:bg-offwhite/10 before:content-['']">
      {runs.map((run) => (
        <li key={run.id} className="relative pl-12">
          <span
            className={`absolute left-3 top-6 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-charcoal-950 ${dotTone[run.stageStatus]}`}
          />
          <article className="rounded-[24px] border border-offwhite/10 bg-charcoal-900/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-offwhite-faint">
                  {run.triggerType} run
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-offwhite">
                  {run.currentStage.replaceAll("_", " ")}
                </h3>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusTone[run.stageStatus]}`}
              >
                {run.stageStatus.replaceAll("_", " ")}
              </span>
            </div>
            <div className="mt-4 grid gap-2 text-sm leading-7 text-offwhite-muted">
              <p>{run.architectOutput}</p>
              {run.developerOutput ? <p>{run.developerOutput}</p> : null}
              {run.deploymentOutput ? <p>{run.deploymentOutput}</p> : null}
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}

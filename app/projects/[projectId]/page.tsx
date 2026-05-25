import { notFound } from "next/navigation";
import { AppShell } from "@/components/dashboard/app-shell";
import { Reveal } from "@/components/dashboard/reveal";
import { RunTimeline } from "@/components/dashboard/run-timeline";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatDateTime, formatUsdc } from "@/lib/formatters";
import { getProject, listProjectRuns } from "@/server/services/project-service";
import { listTransactions } from "@/server/services/treasury-service";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  const [runs, transactions, artifact] = await Promise.all([
    listProjectRuns(projectId),
    listTransactions(projectId),
    prisma.projectArtifact.findUnique({ where: { projectId } })
  ]);

  const facts = [
    { label: "Revenue", value: formatUsdc(project.revenueUsdc), accent: true },
    { label: "Last Transaction", value: formatDateTime(project.lastTransactionAt) },
    { label: "Sunset At", value: formatDateTime(project.sunsetAt), warn: true },
    { label: "Live URL", value: project.liveUrl || "Pending deployment" }
  ];

  return (
    <AppShell back={{ href: "/dashboard", label: "Back to dashboard" }}>
      <Reveal>
        <section className="relative overflow-hidden rounded-[32px] border border-offwhite/10 bg-charcoal-900/60 p-8 backdrop-blur-xl sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet/20 blur-3xl"
          />
          <div className="relative flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-offwhite-faint">
                {project.slug}
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3rem)] font-semibold tracking-tighter text-offwhite">
                {project.name}
              </h1>
            </div>
            <StatusBadge status={project.status} />
          </div>

          <p className="relative mt-5 max-w-3xl text-base leading-relaxed text-offwhite-muted">
            {project.prompt}
          </p>

          <div className="relative mt-8 grid gap-4 md:grid-cols-4">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className={`rounded-[20px] border p-5 ${
                  fact.warn
                    ? "border-rose-500/20 bg-rose-500/[0.06]"
                    : "border-offwhite/10 bg-offwhite/[0.03]"
                }`}
              >
                <p
                  className={`text-xs uppercase tracking-[0.2em] ${
                    fact.warn ? "text-rose-300/80" : "text-offwhite-faint"
                  }`}
                >
                  {fact.label}
                </p>
                <p
                  className={`mt-2 truncate text-sm font-semibold ${
                    fact.accent
                      ? "text-aqua"
                      : fact.warn
                        ? "text-rose-200"
                        : "text-offwhite"
                  }`}
                >
                  {fact.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {artifact ? (
        <Reveal delay={0.05}>
          <section className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-offwhite-faint">
                Live preview
              </p>
              <a
                href={`/preview/${project.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-aqua hover:underline"
              >
                Open in new tab ↗
              </a>
            </div>
            <div className="mt-5 overflow-hidden rounded-[24px] border border-offwhite/10 bg-charcoal-900/60">
              <iframe
                title={`${project.name} preview`}
                src={`/preview/${project.id}`}
                className="h-[640px] w-full border-0 bg-charcoal-950"
              />
            </div>
          </section>
        </Reveal>
      ) : null}

      <section className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal delay={0.05}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-offwhite-faint">
            Pipeline timeline
          </p>
          <div className="mt-5">
            <RunTimeline runs={runs} />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-offwhite-faint">
            Transactions
          </p>
          <div className="mt-5 space-y-3">
            {transactions.map((transaction) => (
              <article
                key={transaction.id}
                className="rounded-[20px] border border-offwhite/10 bg-charcoal-900/60 p-5 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-offwhite-muted">
                    {transaction.transactionType}
                  </p>
                  <p className="text-lg font-semibold text-aqua">
                    {formatUsdc(transaction.amount)}
                  </p>
                </div>
                <p className="mt-2 text-sm text-offwhite-faint">
                  {formatDateTime(transaction.occurredAt)}
                </p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>
    </AppShell>
  );
}

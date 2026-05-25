import Link from "next/link";
import type { Route } from "next";
import { AppShell } from "@/components/dashboard/app-shell";
import { Reveal } from "@/components/dashboard/reveal";
import { CommandCenter } from "@/components/dashboard/command-center";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ProjectCard } from "@/components/dashboard/project-card";
import { TreasuryPanel } from "@/components/dashboard/treasury-panel";
import { getTreasurySummary } from "@/server/services/treasury-service";
import { listProjects } from "@/server/services/project-service";

const pipeline = [
  "Architecting",
  "Coding",
  "Deploying",
  "Integrating Payments",
  "Active"
];

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [projects, summary] = await Promise.all([
    listProjects(),
    getTreasurySummary()
  ]);

  const metrics = [
    {
      label: "Global Treasury",
      value: `${summary.globalTreasuryUsdc} USDC`,
      hint: "Suma sald aktywnych projektów i sub-walletów demo.",
      accent: "aqua" as const
    },
    {
      label: "Active Projects",
      value: `${summary.activeProjects}`,
      hint: "Projekty z działającym deploymentem i aktywnym checkoutem.",
      accent: "violet" as const
    },
    {
      label: "Sunset Pending",
      value: `${summary.sunsetPendingProjects}`,
      hint: "Instancje zbliżające się do progu 72h bez transakcji.",
      accent: "violet" as const
    }
  ];

  return (
    <AppShell>
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-violet">
          Founder console
        </p>
        <h1 className="mt-4 max-w-3xl text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-tighter text-offwhite">
          Orchestrate the foundry.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-offwhite-muted">
          Queue builds, monitor revenue and treasury, and track the sunset
          countdown for every micro-SaaS instance on Locus.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Reveal delay={0.05}>
          <CommandCenter />
          <div className="mt-5 flex flex-wrap gap-2.5">
            {pipeline.map((stage, index) => (
              <div
                key={stage}
                className="rounded-full border border-offwhite/10 bg-offwhite/[0.03] px-4 py-2 text-sm font-medium text-offwhite-muted"
              >
                <span className="text-offwhite-faint">{index + 1}.</span>{" "}
                {stage}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <TreasuryPanel summary={summary} />
        </Reveal>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {metrics.map((metric, i) => (
          <Reveal key={metric.label} delay={0.05 * i}>
            <MetricCard {...metric} />
          </Reveal>
        ))}
      </div>

      <section className="mt-14">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-offwhite-faint">
                Portfolio
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tighter text-offwhite">
                Active and expiring businesses
              </h2>
            </div>
            <Link
              className="rounded-full border border-offwhite/15 px-4 py-2 text-sm font-semibold text-offwhite-muted transition-colors duration-200 hover:border-violet/50 hover:text-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60"
              href={"/micro-saas-template" as Route}
            >
              Open template preview
            </Link>
          </div>
        </Reveal>

        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={0.05 * i}>
              <Link
                href={`/projects/${project.id}` as Route}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60 focus-visible:ring-offset-4 focus-visible:ring-offset-charcoal-950"
              >
                <ProjectCard project={project} />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

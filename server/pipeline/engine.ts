import { randomBytes } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  adapterDrivers,
  getAiAdapter,
  getDeployAdapter,
  getGitAdapter,
  getPaymentsAdapter
} from "@/server/adapters";
import { ensureSettingsLoaded } from "@/server/settings";

// Treasurer guard: don't burn AI credits when real treasury is below the
// operating reserve (architektura.md §6).
async function assertReserve() {
  if (adapterDrivers().payments !== "real") return;
  const reserve = Number(process.env.TREASURY_RESERVE_USDC ?? "1.00");
  const { balance } = await getPaymentsAdapter().getBalance({
    externalWalletId: ""
  });
  if (Number(balance) < reserve) {
    throw new Error(
      `Insufficient treasury reserve (${balance} USDC < ${reserve} USDC). Skipping AI to protect operating funds.`
    );
  }
}

// Stages where the pipeline still has work to do. Anything else is terminal.
const WORKING = [
  "architecting",
  "coding",
  "deploying",
  "integrating_payments"
] as const;

type ProjectRow = Awaited<
  ReturnType<typeof prisma.project.findUniqueOrThrow>
>;
type RunRow = Awaited<ReturnType<typeof prisma.projectRun.findFirstOrThrow>>;

function now() {
  return new Date().toISOString();
}

// Guarded status transition: only succeeds if the project is still in `from`.
// Returns true if THIS worker claimed the transition (concurrency-safe enough
// for mock adapters; real adapters get idempotency keys in Phase 7).
async function transition(
  projectId: string,
  from: string,
  to: string,
  data: Record<string, string> = {}
) {
  const res = await prisma.project.updateMany({
    where: { id: projectId, status: from },
    data: {
      status: to,
      updatedAt: now(),
      ...data
    } as Prisma.ProjectUpdateManyMutationInput
  });
  return res.count === 1;
}

async function executeStage(project: ProjectRow, run: RunRow) {
  const ai = getAiAdapter();
  const git = getGitAdapter();
  const deploy = getDeployAdapter();
  const payments = getPaymentsAdapter();

  switch (project.status) {
    case "architecting": {
      await assertReserve();
      const { projectName, spec, architectSummary } = await ai.draftSpec({
        prompt: project.prompt,
        templateType: project.templateType
      });
      const claimed = await transition(
        project.id,
        "architecting",
        "coding",
        { name: projectName }
      );
      if (claimed) {
        await prisma.projectRun.update({
          where: { id: run.id },
          data: {
            currentStage: "coding",
            architectOutput: `${architectSummary}\n\n${spec}`
          }
        });
      }
      return;
    }

    case "coding": {
      await assertReserve();
      const run2 = await prisma.projectRun.findUniqueOrThrow({
        where: { id: run.id }
      });
      const { html, developerSummary } = await ai.composeMicroSaas({
        projectId: project.id,
        projectName: project.name,
        prompt: project.prompt,
        spec: run2.architectOutput,
        templateType: project.templateType,
        baseUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        amount: "1.00",
        currency: "USDC"
      });
      const repo = await git.createRepository({
        slug: project.slug,
        name: project.name
      });
      await git.pushFiles({
        externalRepoId: repo.externalRepoId,
        files: [
          { path: "index.html", contents: html },
          { path: "SPEC.md", contents: run2.architectOutput }
        ]
      });
      // Persist the runnable artifact so it can be previewed in-app.
      await prisma.projectArtifact.upsert({
        where: { projectId: project.id },
        create: { projectId: project.id, html, createdAt: now() },
        update: { html, createdAt: now() }
      });
      const claimed = await transition(project.id, "coding", "deploying", {
        repoUrl: repo.repoUrl
      });
      if (claimed) {
        await prisma.projectRun.update({
          where: { id: run.id },
          data: { currentStage: "deploying", developerOutput: developerSummary }
        });
      }
      return;
    }

    case "deploying": {
      const created = await deploy.createProject({
        slug: project.slug,
        repoUrl: project.repoUrl
      });
      const deployment = await deploy.triggerDeployment({
        vercelProjectId: created.vercelProjectId,
        env: {
          PROJECT_ID: project.id,
          NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? ""
        }
      });
      const claimed = await transition(
        project.id,
        "deploying",
        "integrating_payments",
        {
          vercelProjectId: created.vercelProjectId,
          liveUrl: deployment.deploymentUrl
        }
      );
      if (claimed) {
        await prisma.$transaction([
          prisma.deployment.create({
            data: {
              id: `dep_${randomBytes(8).toString("hex")}`,
              projectId: project.id,
              provider: "vercel",
              environment: "production",
              externalDeploymentId: deployment.externalDeploymentId,
              deploymentUrl: deployment.deploymentUrl,
              status: deployment.status,
              createdAt: now()
            }
          }),
          prisma.projectRun.update({
            where: { id: run.id },
            data: {
              currentStage: "integrating_payments",
              deploymentOutput: `Production deployment ready at ${deployment.deploymentUrl}.`
            }
          })
        ]);
      }
      return;
    }

    case "integrating_payments": {
      const wallet = await payments.provisionSubWallet({
        projectId: project.id
      });
      const claimed = await transition(
        project.id,
        "integrating_payments",
        "active",
        { subWalletId: wallet.subWalletId }
      );
      if (claimed) {
        await prisma.$transaction([
          prisma.wallet.upsert({
            where: { id: wallet.subWalletId },
            create: {
              id: wallet.subWalletId,
              walletType: "sub_wallet",
              projectId: project.id,
              externalWalletId: wallet.externalWalletId,
              address: wallet.address,
              balance: "0.00",
              currency: "USDC",
              lastSyncedAt: now()
            },
            update: {}
          }),
          prisma.projectRun.update({
            where: { id: run.id },
            data: { stageStatus: "completed", finishedAt: now() }
          })
        ]);
      }
      return;
    }

    default:
      return;
  }
}

export async function runProjectPipeline(projectId: string): Promise<void> {
  await ensureSettingsLoaded();
  // At most 6 iterations covers the 4 working stages plus slack.
  for (let i = 0; i < 6; i += 1) {
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    if (!project || !WORKING.includes(project.status as never)) return;

    const run = await prisma.projectRun.findFirst({
      where: { projectId },
      orderBy: { startedAt: "desc" }
    });
    if (!run || run.stageStatus === "failed") return;

    try {
      await executeStage(project, run);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Pipeline step failed.";
      await prisma.$transaction([
        prisma.projectRun.update({
          where: { id: run.id },
          data: {
            stageStatus: "failed",
            errorMessage: message,
            finishedAt: now()
          }
        }),
        prisma.project.update({
          where: { id: projectId },
          data: { status: "failed", updatedAt: now() }
        })
      ]);
      return;
    }
  }
}

export async function tickPipeline(): Promise<{ advanced: string[] }> {
  await ensureSettingsLoaded();
  const candidates = await prisma.project.findMany({
    where: { status: { in: WORKING as unknown as string[] } },
    orderBy: { updatedAt: "asc" },
    take: 10
  });

  for (const project of candidates) {
    await runProjectPipeline(project.id);
  }

  return { advanced: candidates.map((p) => p.id) };
}

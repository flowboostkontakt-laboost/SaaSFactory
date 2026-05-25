import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import type { Project, ProjectRun } from "@/types/domain";

function token(prefix: string) {
  return `${prefix}_${randomBytes(6).toString("hex")}`;
}

export class ProjectRepository {
  async listProjects(): Promise<Project[]> {
    const rows = await prisma.project.findMany({
      orderBy: { createdAt: "desc" }
    });
    return rows as unknown as Project[];
  }

  async getProject(projectId: string): Promise<Project | null> {
    const row = await prisma.project.findUnique({ where: { id: projectId } });
    return (row as unknown as Project) ?? null;
  }

  async listRuns(projectId: string): Promise<ProjectRun[]> {
    const rows = await prisma.projectRun.findMany({
      where: { projectId },
      orderBy: { startedAt: "desc" }
    });
    return rows as unknown as ProjectRun[];
  }

  async createProject(input: {
    prompt: string;
    templateType: string;
    amount: string;
    currency: string;
    unitLabel: string;
  }): Promise<{ project: Project; run: ProjectRun }> {
    const timestamp = new Date().toISOString();
    const slugBase = input.prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 36);
    const id = token("proj");
    const slug = slugBase || `project-${id.slice(-6)}`;
    const name = slug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    const projectData: Project = {
      id,
      name,
      slug,
      prompt: input.prompt,
      status: "architecting",
      templateType: input.templateType,
      liveUrl: "",
      repoUrl: "",
      vercelProjectId: "",
      subWalletId: "",
      revenueUsdc: "0.00",
      lastTransactionAt: timestamp,
      sunsetAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const runData: ProjectRun = {
      id: token("run"),
      projectId: id,
      triggerType: "manual",
      currentStage: "architecting",
      stageStatus: "in_progress",
      architectOutput: `Queued prompt for template ${input.templateType} with ${input.amount} ${input.currency} pricing.`,
      developerOutput: "",
      deploymentOutput: "",
      errorMessage: null,
      startedAt: timestamp,
      finishedAt: null
    };

    const [project, run] = await prisma.$transaction([
      prisma.project.create({ data: projectData }),
      prisma.projectRun.create({ data: runData })
    ]);

    return {
      project: project as unknown as Project,
      run: run as unknown as ProjectRun
    };
  }
}

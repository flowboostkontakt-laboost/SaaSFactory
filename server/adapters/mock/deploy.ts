import { randomBytes } from "node:crypto";
import type { DeployAdapter } from "@/server/adapters/types";

export class MockDeployAdapter implements DeployAdapter {
  async createProject(input: { slug: string; repoUrl: string }) {
    void input.repoUrl;
    return { vercelProjectId: `vercel_${input.slug}_${randomBytes(3).toString("hex")}` };
  }

  async triggerDeployment(input: {
    vercelProjectId: string;
    env: Record<string, string>;
  }) {
    void input.env;
    const slug = input.vercelProjectId.replace(/^vercel_/, "").replace(/_[0-9a-f]+$/, "");
    return {
      externalDeploymentId: `dpl_${randomBytes(8).toString("hex")}`,
      deploymentUrl: `https://${slug}.vercel.app`,
      status: "ready"
    };
  }

  async teardown(input: { vercelProjectId: string }) {
    void input;
  }
}

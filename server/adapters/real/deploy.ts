import type { DeployAdapter } from "@/server/adapters/types";
import { fetchRetry } from "@/server/adapters/http";

const VERCEL = "https://api.vercel.com";

function env(name: string): string {
  const value = process.env[name];
  if (!value)
    throw new Error(`Missing ${name} (required for DEPLOY_DRIVER=real).`);
  return value;
}

function teamQuery() {
  const team = process.env.VERCEL_TEAM_ID;
  return team ? `?teamId=${team}` : "";
}

function authHeaders() {
  return {
    Authorization: `Bearer ${env("VERCEL_API_TOKEN")}`,
    "Content-Type": "application/json"
  };
}

function landingHtml(slug: string, projectId: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${slug}</title><style>body{margin:0;font-family:system-ui,sans-serif;background:#060608;color:#f3f4f8;display:grid;place-items:center;min-height:100vh}main{max-width:42rem;padding:2rem;text-align:center}h1{font-size:2.5rem;letter-spacing:-.03em;margin:0 0 1rem}p{color:#a5a6bd;line-height:1.6}.b{display:inline-block;margin-top:2rem;padding:.8rem 1.6rem;border-radius:999px;background:#7c5cff;color:#fff;text-decoration:none;font-weight:600}</style></head><body><main><h1>${slug.replace(/-/g, " ")}</h1><p>Generated and deployed by SaaS-Factory.ai. Project ${projectId}.</p><a class="b" href="#">1 generation = 1 USDC</a></main></body></html>`;
}

export class RealDeployAdapter implements DeployAdapter {
  async createProject(input: { slug: string; repoUrl: string }) {
    void input.repoUrl;
    const name = input.slug.replace(/[^a-z0-9-]/g, "-").slice(0, 90) || "tool";
    // Vercel auto-creates the project from the deployment `name`.
    return { vercelProjectId: name };
  }

  async triggerDeployment(input: {
    vercelProjectId: string;
    env: Record<string, string>;
  }) {
    const name = input.vercelProjectId;
    const res = await fetchRetry(`${VERCEL}/v13/deployments${teamQuery()}`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        name,
        target: "production",
        projectSettings: { framework: null },
        files: [
          {
            file: "index.html",
            data: landingHtml(name, input.env.PROJECT_ID ?? "unknown")
          }
        ]
      })
    });

    if (!res.ok) {
      throw new Error(
        `Vercel deploy ${res.status}: ${(await res.text()).slice(0, 250)}`
      );
    }

    const data = (await res.json()) as {
      id: string;
      url: string;
      readyState?: string;
      status?: string;
    };

    return {
      externalDeploymentId: data.id,
      deploymentUrl: `https://${data.url}`,
      status: (data.readyState ?? data.status ?? "QUEUED").toLowerCase()
    };
  }

  async teardown(input: { vercelProjectId: string }) {
    const res = await fetchRetry(
      `${VERCEL}/v9/projects/${input.vercelProjectId}${teamQuery()}`,
      { method: "DELETE", headers: authHeaders() }
    );
    if (!res.ok && res.status !== 404) {
      throw new Error(`Vercel teardown ${res.status}`);
    }
  }
}

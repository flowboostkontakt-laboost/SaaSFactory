import { NextRequest, NextResponse } from "next/server";
import {
  adapterDrivers,
  getAiAdapter,
  getDeployAdapter,
  getGitAdapter,
  getPaymentsAdapter
} from "@/server/adapters";

// Guarded smoke test for the adapter layer. Not part of the product surface;
// used to verify Phase 2 wiring. Protected by CRON_SECRET.
export async function GET(request: NextRequest) {
  const secret =
    request.headers.get("x-cron-secret") ??
    request.nextUrl.searchParams.get("secret");

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ai = getAiAdapter();
  const git = getGitAdapter();
  const deploy = getDeployAdapter();
  const payments = getPaymentsAdapter();

  const spec = await ai.draftSpec({
    prompt: "Build a meme coin audit tool",
    templateType: "tool"
  });
  const app = await ai.composeMicroSaas({
    projectId: "proj_demo",
    projectName: spec.projectName,
    prompt: "Build a meme coin audit tool",
    spec: spec.spec,
    templateType: "tool",
    baseUrl: "http://localhost:3000",
    amount: "1.00",
    currency: "USDC"
  });
  const repo = await git.createRepository({
    slug: "meme-coin-audit",
    name: spec.projectName
  });
  const push = await git.pushFiles({
    externalRepoId: repo.externalRepoId,
    files: [{ path: "index.html", contents: app.html }]
  });
  const project = await deploy.createProject({
    slug: "meme-coin-audit",
    repoUrl: repo.repoUrl
  });
  const deployment = await deploy.triggerDeployment({
    vercelProjectId: project.vercelProjectId,
    env: { PROJECT_ID: "proj_demo" }
  });
  const wallet = await payments.provisionSubWallet({ projectId: "proj_demo" });
  const session = await payments.createCheckoutSession({
    projectId: "proj_demo",
    pricingKey: "default_generation",
    amount: "1.00",
    currency: "USDC",
    successUrl: "https://x/s",
    cancelUrl: "https://x/c"
  });
  const balance = await payments.getBalance({
    externalWalletId: wallet.externalWalletId
  });

  return NextResponse.json({
    drivers: adapterDrivers(),
    ai: { spec, appBytes: app.html.length, developerSummary: app.developerSummary },
    git: { repo, push },
    deploy: { project, deployment },
    payments: { wallet, session, balance }
  });
}

// Adapter contracts for external systems. The pipeline (Phase 3) depends on
// these interfaces only, never on concrete implementations, so mock and real
// drivers stay swappable behind env flags.

export type TemplateFile = {
  path: string;
  contents: string;
};

export interface AiAdapter {
  /** Architect agent: turn a prompt into a build spec. */
  draftSpec(input: {
    prompt: string;
    templateType: string;
  }): Promise<{ projectName: string; spec: string; architectSummary: string }>;

  /** Developer agent: produce the full runnable micro-SaaS from the spec. */
  composeMicroSaas(input: {
    projectId: string;
    projectName: string;
    prompt: string;
    spec: string;
    templateType: string;
    baseUrl: string;
    amount: string;
    currency: string;
  }): Promise<{ html: string; developerSummary: string }>;
}

export interface GitAdapter {
  createRepository(input: {
    slug: string;
    name: string;
  }): Promise<{ repoUrl: string; externalRepoId: string }>;

  pushFiles(input: {
    externalRepoId: string;
    files: TemplateFile[];
  }): Promise<{ commitSha: string }>;

  archiveRepository(input: { externalRepoId: string }): Promise<void>;
}

export interface DeployAdapter {
  createProject(input: {
    slug: string;
    repoUrl: string;
  }): Promise<{ vercelProjectId: string }>;

  triggerDeployment(input: {
    vercelProjectId: string;
    env: Record<string, string>;
  }): Promise<{
    externalDeploymentId: string;
    deploymentUrl: string;
    status: string;
  }>;

  teardown(input: { vercelProjectId: string }): Promise<void>;
}

export interface PaymentsAdapter {
  provisionSubWallet(input: {
    projectId: string;
  }): Promise<{
    subWalletId: string;
    externalWalletId: string;
    address: string;
  }>;

  createCheckoutSession(input: {
    projectId: string;
    pricingKey: string;
    amount: string;
    currency: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{
    externalSessionId: string;
    checkoutUrl: string;
    status: string;
    payToAddress: string;
  }>;

  getBalance(input: {
    externalWalletId: string;
  }): Promise<{ balance: string; currency: string }>;

  /** Recent wallet transactions, newest first, for reconciliation. */
  listTransactions(): Promise<
    {
      id: string;
      amount: string;
      memo: string;
      status: string;
      occurredAt: string;
    }[]
  >;
}

export type AdapterDriver = "mock" | "real";

import type {
  Deployment,
  PaymentSession,
  Project,
  ProjectRun,
  Transaction,
  Wallet
} from "@/types/domain";

export const demoProjects: Project[] = [
  {
    id: "proj_privacy_web3",
    name: "Privacy Forge",
    slug: "privacy-forge",
    prompt: "Zbuduj generator polityki prywatności dla sklepów Web3",
    status: "active",
    templateType: "tool",
    liveUrl: "https://privacy-forge.example",
    repoUrl: "https://github.com/example/privacy-forge",
    vercelProjectId: "vercel_proj_privacy_forge",
    subWalletId: "wallet_sub_privacy_forge",
    revenueUsdc: "182.50",
    lastTransactionAt: "2026-05-07T10:20:00.000Z",
    sunsetAt: "2026-05-10T10:20:00.000Z",
    createdAt: "2026-05-05T09:00:00.000Z",
    updatedAt: "2026-05-07T10:20:00.000Z"
  },
  {
    id: "proj_seo_audit",
    name: "SEO Pulse",
    slug: "seo-pulse",
    prompt: "Zbuduj audytor SEO dla landing page AI tools",
    status: "sunset_pending",
    templateType: "tool",
    liveUrl: "https://seo-pulse.example",
    repoUrl: "https://github.com/example/seo-pulse",
    vercelProjectId: "vercel_proj_seo_pulse",
    subWalletId: "wallet_sub_seo_pulse",
    revenueUsdc: "24.00",
    lastTransactionAt: "2026-05-04T07:00:00.000Z",
    sunsetAt: "2026-05-07T07:00:00.000Z",
    createdAt: "2026-05-03T14:00:00.000Z",
    updatedAt: "2026-05-07T07:00:00.000Z"
  }
];

export const demoProjectRuns: ProjectRun[] = [
  {
    id: "run_privacy_001",
    projectId: "proj_privacy_web3",
    triggerType: "manual",
    currentStage: "integrating_payments",
    stageStatus: "completed",
    architectOutput: "Tool template selected. Checkout monetization required.",
    developerOutput: "Generated dashboard, template shell and shared pay module placeholders.",
    deploymentOutput: "Production deployment ready on Vercel.",
    errorMessage: null,
    startedAt: "2026-05-05T09:02:00.000Z",
    finishedAt: "2026-05-05T09:20:00.000Z"
  },
  {
    id: "run_seo_001",
    projectId: "proj_seo_audit",
    triggerType: "manual",
    currentStage: "deploying",
    stageStatus: "completed",
    architectOutput: "SEO audit template selected with gated export flow.",
    developerOutput: "Generated end-user flow with premium report trigger.",
    deploymentOutput: "Project deployed. Awaiting transaction activity.",
    errorMessage: null,
    startedAt: "2026-05-03T14:05:00.000Z",
    finishedAt: "2026-05-03T14:22:00.000Z"
  }
];

export const demoPaymentSessions: PaymentSession[] = [
  {
    id: "pay_privacy_001",
    projectId: "proj_privacy_web3",
    externalSessionId: "locus_sess_privacy_001",
    pricingKey: "default_generation",
    amount: "1.00",
    currency: "USDC",
    status: "paid",
    checkoutUrl: "https://checkout.locus.example/session/locus_sess_privacy_001",
    createdAt: "2026-05-07T10:18:00.000Z",
    updatedAt: "2026-05-07T10:20:00.000Z"
  }
];

export const demoWallets: Wallet[] = [
  {
    id: "wallet_master_001",
    walletType: "master",
    projectId: null,
    externalWalletId: "locus_master_001",
    address: "0xMASTER001",
    balance: "206.50",
    currency: "USDC",
    lastSyncedAt: "2026-05-07T10:25:00.000Z"
  },
  {
    id: "wallet_sub_privacy_forge",
    walletType: "sub_wallet",
    projectId: "proj_privacy_web3",
    externalWalletId: "locus_sub_privacy_forge",
    address: "0xSUBPRIVACY",
    balance: "182.50",
    currency: "USDC",
    lastSyncedAt: "2026-05-07T10:25:00.000Z"
  },
  {
    id: "wallet_sub_seo_pulse",
    walletType: "sub_wallet",
    projectId: "proj_seo_audit",
    externalWalletId: "locus_sub_seo_pulse",
    address: "0xSUBSEO",
    balance: "24.00",
    currency: "USDC",
    lastSyncedAt: "2026-05-07T10:25:00.000Z"
  }
];

export const demoTransactions: Transaction[] = [
  {
    id: "txn_privacy_001",
    projectId: "proj_privacy_web3",
    walletId: "wallet_sub_privacy_forge",
    paymentSessionId: "pay_privacy_001",
    externalTransactionId: "locus_txn_privacy_001",
    transactionType: "payment",
    amount: "1.00",
    currency: "USDC",
    status: "recorded",
    occurredAt: "2026-05-07T10:20:00.000Z",
    metadata: {
      source: "checkout"
    }
  }
];

export const demoDeployments: Deployment[] = [
  {
    id: "dep_privacy_001",
    projectId: "proj_privacy_web3",
    provider: "vercel",
    environment: "production",
    externalDeploymentId: "vercel_dep_privacy_001",
    deploymentUrl: "https://privacy-forge.example",
    status: "ready",
    createdAt: "2026-05-05T09:18:00.000Z"
  },
  {
    id: "dep_seo_001",
    projectId: "proj_seo_audit",
    provider: "vercel",
    environment: "production",
    externalDeploymentId: "vercel_dep_seo_001",
    deploymentUrl: "https://seo-pulse.example",
    status: "ready",
    createdAt: "2026-05-03T14:18:00.000Z"
  }
];

export type ProjectStatus =
  | "draft"
  | "architecting"
  | "coding"
  | "deploying"
  | "integrating_payments"
  | "active"
  | "under_evaluation"
  | "sunset_pending"
  | "archived"
  | "failed";

export type RunStage =
  | "architecting"
  | "coding"
  | "deploying"
  | "integrating_payments";

export type RunStatus = "queued" | "in_progress" | "completed" | "failed";

export type DeploymentStatus =
  | "queued"
  | "building"
  | "ready"
  | "failed"
  | "archived";

export type PaymentStatus =
  | "created"
  | "pending"
  | "paid"
  | "failed"
  | "expired";

export type WalletType = "master" | "sub_wallet";

export type TransactionType = "payment" | "refund" | "sweep" | "payout" | "fee";

export interface Project {
  id: string;
  name: string;
  slug: string;
  prompt: string;
  status: ProjectStatus;
  templateType: string;
  liveUrl: string;
  repoUrl: string;
  vercelProjectId: string;
  subWalletId: string;
  revenueUsdc: string;
  lastTransactionAt: string;
  sunsetAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRun {
  id: string;
  projectId: string;
  triggerType: "manual" | "auto" | "retry";
  currentStage: RunStage;
  stageStatus: RunStatus;
  architectOutput: string;
  developerOutput: string;
  deploymentOutput: string;
  errorMessage: string | null;
  startedAt: string;
  finishedAt: string | null;
}

export interface PaymentSession {
  id: string;
  projectId: string;
  externalSessionId: string;
  pricingKey: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  checkoutUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  walletType: WalletType;
  projectId: string | null;
  externalWalletId: string;
  address: string;
  balance: string;
  currency: string;
  lastSyncedAt: string;
}

export interface Transaction {
  id: string;
  projectId: string;
  walletId: string;
  paymentSessionId: string | null;
  externalTransactionId: string;
  transactionType: TransactionType;
  amount: string;
  currency: string;
  status: "recorded" | "pending" | "failed";
  occurredAt: string;
  metadata: Record<string, string>;
}

export interface Deployment {
  id: string;
  projectId: string;
  provider: "vercel";
  environment: "preview" | "production";
  externalDeploymentId: string;
  deploymentUrl: string;
  status: DeploymentStatus;
  createdAt: string;
}

export interface TreasurySummary {
  globalTreasuryUsdc: string;
  activeProjects: number;
  sunsetPendingProjects: number;
  wallets: Wallet[];
}

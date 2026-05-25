-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "templateType" TEXT NOT NULL,
    "liveUrl" TEXT NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "vercelProjectId" TEXT NOT NULL,
    "subWalletId" TEXT NOT NULL,
    "revenueUsdc" TEXT NOT NULL,
    "lastTransactionAt" TEXT NOT NULL,
    "sunsetAt" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRun" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "triggerType" TEXT NOT NULL,
    "currentStage" TEXT NOT NULL,
    "stageStatus" TEXT NOT NULL,
    "architectOutput" TEXT NOT NULL,
    "developerOutput" TEXT NOT NULL,
    "deploymentOutput" TEXT NOT NULL,
    "errorMessage" TEXT,
    "startedAt" TEXT NOT NULL,
    "finishedAt" TEXT,

    CONSTRAINT "ProjectRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentSession" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "externalSessionId" TEXT NOT NULL,
    "pricingKey" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "checkoutUrl" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,

    CONSTRAINT "PaymentSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "walletType" TEXT NOT NULL,
    "projectId" TEXT,
    "externalWalletId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "balance" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "lastSyncedAt" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "paymentSessionId" TEXT,
    "externalTransactionId" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "occurredAt" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "externalDeploymentId" TEXT NOT NULL,
    "deploymentUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectRun_projectId_idx" ON "ProjectRun"("projectId");

-- CreateIndex
CREATE INDEX "PaymentSession_projectId_idx" ON "PaymentSession"("projectId");

-- CreateIndex
CREATE INDEX "Wallet_projectId_idx" ON "Wallet"("projectId");

-- CreateIndex
CREATE INDEX "Transaction_projectId_idx" ON "Transaction"("projectId");

-- CreateIndex
CREATE INDEX "Deployment_projectId_idx" ON "Deployment"("projectId");

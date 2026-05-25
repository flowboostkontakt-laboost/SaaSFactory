-- CreateTable
CREATE TABLE "ProjectArtifact" (
    "projectId" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "ProjectArtifact_pkey" PRIMARY KEY ("projectId")
);

import { PrismaClient } from "@prisma/client";
import {
  demoProjects,
  demoProjectRuns,
  demoPaymentSessions,
  demoWallets,
  demoTransactions,
  demoDeployments
} from "../lib/demo-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.transaction.deleteMany(),
    prisma.deployment.deleteMany(),
    prisma.paymentSession.deleteMany(),
    prisma.wallet.deleteMany(),
    prisma.projectRun.deleteMany(),
    prisma.project.deleteMany()
  ]);

  await prisma.project.createMany({ data: demoProjects });
  await prisma.projectRun.createMany({ data: demoProjectRuns });
  await prisma.paymentSession.createMany({ data: demoPaymentSessions });
  await prisma.wallet.createMany({ data: demoWallets });
  await prisma.transaction.createMany({ data: demoTransactions });
  await prisma.deployment.createMany({ data: demoDeployments });

  console.log(
    `Seeded ${demoProjects.length} projects, ${demoProjectRuns.length} runs, ${demoWallets.length} wallets, ${demoTransactions.length} transactions.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

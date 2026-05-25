import { prisma } from "@/lib/db";
import type { Transaction, TreasurySummary, Wallet } from "@/types/domain";

export class TreasuryRepository {
  async getSummary(): Promise<TreasurySummary> {
    const [wallets, activeProjects, sunsetPendingProjects] = await Promise.all([
      prisma.wallet.findMany(),
      prisma.project.count({ where: { status: "active" } }),
      prisma.project.count({ where: { status: "sunset_pending" } })
    ]);

    const total = wallets
      .filter((wallet) => wallet.walletType === "sub_wallet")
      .reduce((sum, wallet) => sum + Number(wallet.balance), 0);

    return {
      globalTreasuryUsdc: total.toFixed(2),
      activeProjects,
      sunsetPendingProjects,
      wallets: wallets as unknown as Wallet[]
    };
  }

  async listWallets(): Promise<Wallet[]> {
    const rows = await prisma.wallet.findMany();
    return rows as unknown as Wallet[];
  }

  async listTransactions(projectId?: string): Promise<Transaction[]> {
    const rows = await prisma.transaction.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { occurredAt: "desc" }
    });
    return rows as unknown as Transaction[];
  }
}

import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import {
  getDeployAdapter,
  getGitAdapter,
  getPaymentsAdapter
} from "@/server/adapters";
import { ensureSettingsLoaded } from "@/server/settings";

function now() {
  return new Date().toISOString();
}

// Pull the real on-chain agent balance into the master wallet, then sweep
// accrued per-project (logical) sub-wallet balances up to the master.
export async function syncTreasury(): Promise<{
  masterBalance: string;
  swept: string;
  subWalletsSwept: number;
}> {
  await ensureSettingsLoaded();
  const live = await getPaymentsAdapter().getBalance({ externalWalletId: "" });

  let master = await prisma.wallet.findFirst({
    where: { walletType: "master" }
  });
  if (!master) {
    master = await prisma.wallet.create({
      data: {
        id: "wallet_master",
        walletType: "master",
        projectId: null,
        externalWalletId: "",
        address: "",
        balance: live.balance,
        currency: live.currency,
        lastSyncedAt: now()
      }
    });
  }

  const subs = await prisma.wallet.findMany({
    where: { walletType: "sub_wallet" }
  });

  let sweptTotal = 0;
  let count = 0;
  for (const sub of subs) {
    const amt = Number(sub.balance);
    if (amt <= 0) continue;
    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          id: `txn_${randomBytes(8).toString("hex")}`,
          projectId: sub.projectId ?? "",
          walletId: sub.id,
          paymentSessionId: null,
          externalTransactionId: "",
          transactionType: "sweep",
          amount: amt.toFixed(2),
          currency: sub.currency,
          status: "recorded",
          occurredAt: now(),
          metadata: { to: "master" }
        }
      }),
      prisma.wallet.update({
        where: { id: sub.id },
        data: { balance: "0.00", lastSyncedAt: now() }
      })
    ]);
    sweptTotal += amt;
    count += 1;
  }

  // Master reflects the real agent balance; logical sweeps are recorded for
  // per-project accounting (single on-chain wallet in Locus beta).
  await prisma.wallet.update({
    where: { id: master.id },
    data: {
      balance: live.balance,
      currency: live.currency,
      lastSyncedAt: now()
    }
  });

  return {
    masterBalance: live.balance,
    swept: sweptTotal.toFixed(2),
    subWalletsSwept: count
  };
}

function repoIdFromUrl(repoUrl: string): string | null {
  const m = repoUrl.match(/github\.com\/(.+?)\/?$/i);
  return m ? m[1].replace(/\/$/, "") : null;
}

// 72h with no transaction -> sunset_pending; past the grace window ->
// teardown deploy, archive repo, status archived.
export async function runSunset(opts: {
  hours?: number;
  grace?: number;
}): Promise<{ pending: number; archived: number }> {
  await ensureSettingsLoaded();
  const hours =
    opts.hours ?? Number(process.env.SUNSET_HOURS ?? "72");
  const grace =
    opts.grace ?? Number(process.env.SUNSET_GRACE_HOURS ?? "24");
  const nowMs = Date.now();
  const noTxBefore = new Date(nowMs - hours * 3_600_000).toISOString();

  const stale = await prisma.project.findMany({
    where: {
      status: { in: ["active", "under_evaluation"] },
      lastTransactionAt: { lt: noTxBefore }
    }
  });

  let pending = 0;
  for (const p of stale) {
    const res = await prisma.project.updateMany({
      where: { id: p.id, status: { in: ["active", "under_evaluation"] } },
      data: {
        status: "sunset_pending",
        sunsetAt: new Date(nowMs + grace * 3_600_000).toISOString(),
        updatedAt: now()
      }
    });
    pending += res.count;
  }

  const pendingProjects = await prisma.project.findMany({
    where: { status: "sunset_pending" }
  });

  let archived = 0;
  for (const p of pendingProjects) {
    if (new Date(p.sunsetAt).getTime() > nowMs) continue;

    try {
      if (p.vercelProjectId) {
        await getDeployAdapter().teardown({
          vercelProjectId: p.vercelProjectId
        });
      }
      const repoId = repoIdFromUrl(p.repoUrl);
      if (repoId) {
        await getGitAdapter().archiveRepository({ externalRepoId: repoId });
      }
    } catch {
      // Teardown is best-effort; still archive the record.
    }

    const res = await prisma.project.updateMany({
      where: { id: p.id, status: "sunset_pending" },
      data: { status: "archived", updatedAt: now() }
    });
    archived += res.count;
  }

  return { pending, archived };
}

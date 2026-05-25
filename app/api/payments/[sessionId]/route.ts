import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adapterDrivers, getPaymentsAdapter } from "@/server/adapters";
import { ensureSettingsLoaded } from "@/server/settings";

export const dynamic = "force-dynamic";

async function settle(sessionId: string) {
  await ensureSettingsLoaded();
  const session = await prisma.paymentSession.findUnique({
    where: { id: sessionId }
  });
  if (!session) return { status: "not_found" as const, code: 404 };
  if (session.status === "paid") return { status: "paid" as const, code: 200 };

  const driver = adapterDrivers().payments;
  let matchedTxId = "";

  if (driver === "mock") {
    // No chain in mock: treat verify as the confirmation signal.
    matchedTxId = `mock_${randomBytes(6).toString("hex")}`;
  } else {
    const txs = await getPaymentsAdapter().listTransactions();
    const candidates = txs.filter(
      (t) =>
        (t.memo?.includes(sessionId) ||
          Number(t.amount) === Number(session.amount)) &&
        /confirmed|success|recorded/i.test(t.status)
    );
    // Dedupe: never consume an on-chain tx already linked to a transaction.
    let hit: (typeof candidates)[number] | undefined;
    for (const c of candidates) {
      const used = await prisma.transaction.findFirst({
        where: { externalTransactionId: c.id }
      });
      if (!used) {
        hit = c;
        break;
      }
    }
    if (!hit) return { status: "pending" as const, code: 200 };
    matchedTxId = hit.id;
  }

  const ts = new Date().toISOString();

  // Atomic claim: exactly one verify call may move created/pending -> paid.
  const claim = await prisma.paymentSession.updateMany({
    where: { id: sessionId, status: { in: ["created", "pending"] } },
    data: { status: "paid", updatedAt: ts }
  });
  if (claim.count !== 1) {
    return { status: "paid" as const, code: 200 };
  }

  const project = await prisma.project.findUnique({
    where: { id: session.projectId }
  });

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        id: `txn_${randomBytes(8).toString("hex")}`,
        projectId: session.projectId,
        walletId: project?.subWalletId || "wallet_unknown",
        paymentSessionId: sessionId,
        externalTransactionId: matchedTxId,
        transactionType: "payment",
        amount: session.amount,
        currency: session.currency,
        status: "recorded",
        occurredAt: ts,
        metadata: { source: "locus", driver }
      }
    }),
    prisma.project.update({
      where: { id: session.projectId },
      data: {
        revenueUsdc: (
          Number(project?.revenueUsdc ?? 0) + Number(session.amount)
        ).toFixed(2),
        lastTransactionAt: ts,
        updatedAt: ts
      }
    })
  ]);

  if (project?.subWalletId) {
    const wallet = await prisma.wallet.findUnique({
      where: { id: project.subWalletId }
    });
    if (wallet) {
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: (
            Number(wallet.balance) + Number(session.amount)
          ).toFixed(2),
          lastSyncedAt: ts
        }
      });
    }
  }

  return { status: "paid" as const, code: 200 };
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await context.params;
  const result = await settle(sessionId);
  return NextResponse.json({ status: result.status }, { status: result.code });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await context.params;
  const session = await prisma.paymentSession.findUnique({
    where: { id: sessionId }
  });
  if (!session) {
    return NextResponse.json({ status: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ status: session.status });
}

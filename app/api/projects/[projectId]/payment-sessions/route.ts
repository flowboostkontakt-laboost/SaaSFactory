import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPaymentsAdapter } from "@/server/adapters";
import { ensureSettingsLoaded } from "@/server/settings";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  await ensureSettingsLoaded();
  const { projectId } = await context.params;
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    pricingKey?: string;
    amount?: string;
    currency?: string;
  };
  const pricingKey = body.pricingKey ?? "default_generation";
  const amount = body.amount ?? "1.00";
  const currency = body.currency ?? "USDC";
  const sessionId = `pay_${randomBytes(8).toString("hex")}`;
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await getPaymentsAdapter().createCheckoutSession({
    projectId,
    pricingKey,
    amount,
    currency,
    successUrl: `${base}/preview/${projectId}`,
    cancelUrl: `${base}/preview/${projectId}`
  });

  const ts = new Date().toISOString();
  await prisma.paymentSession.create({
    data: {
      id: sessionId,
      projectId,
      externalSessionId: session.externalSessionId,
      pricingKey,
      amount,
      currency,
      status: "created",
      checkoutUrl: session.checkoutUrl,
      createdAt: ts,
      updatedAt: ts
    }
  });

  return NextResponse.json(
    {
      sessionId,
      amount,
      currency,
      payToAddress: session.payToAddress,
      memo: sessionId,
      checkoutUrl: session.checkoutUrl
    },
    { status: 201 }
  );
}

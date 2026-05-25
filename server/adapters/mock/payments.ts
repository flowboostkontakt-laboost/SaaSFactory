import { randomBytes } from "node:crypto";
import type { PaymentsAdapter } from "@/server/adapters/types";

export class MockPaymentsAdapter implements PaymentsAdapter {
  async provisionSubWallet(input: { projectId: string }) {
    const ref = randomBytes(5).toString("hex");
    return {
      subWalletId: `wallet_sub_${ref}`,
      externalWalletId: `locus_sub_${ref}`,
      address: `0x${randomBytes(20).toString("hex")}`
    };
  }

  async createCheckoutSession(input: {
    projectId: string;
    pricingKey: string;
    amount: string;
    currency: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    void input.successUrl;
    void input.cancelUrl;
    const externalSessionId = `locus_sess_${randomBytes(8).toString("hex")}`;
    return {
      externalSessionId,
      checkoutUrl: `https://checkout.locus.mock/session/${externalSessionId}`,
      status: "created",
      payToAddress: `0x${randomBytes(20).toString("hex")}`
    };
  }

  async getBalance(input: { externalWalletId: string }) {
    // Deterministic pseudo-balance from the wallet id so syncs are stable.
    const seed = input.externalWalletId
      .split("")
      .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const balance = ((seed % 400) + 25).toFixed(2);
    return { balance, currency: "USDC" };
  }

  // Mock reconciliation: no real chain. The verify endpoint treats mock as
  // an instant confirmation, so this can stay empty.
  async listTransactions() {
    return [] as {
      id: string;
      amount: string;
      memo: string;
      status: string;
      occurredAt: string;
    }[];
  }
}

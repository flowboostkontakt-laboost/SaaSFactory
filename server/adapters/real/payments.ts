import type { PaymentsAdapter } from "@/server/adapters/types";
import { fetchRetry } from "@/server/adapters/http";

function env(name: string): string {
  const value = process.env[name];
  if (!value)
    throw new Error(`Missing ${name} (required for PAYMENTS_DRIVER=real).`);
  return value;
}

function base() {
  return env("LOCUS_API_URL").replace(/\/$/, "");
}

function authHeaders() {
  return {
    Authorization: `Bearer ${env("LOCUS_API_KEY")}`,
    "Content-Type": "application/json"
  };
}

// Real Locus integration over the verified beta agent API.
// Note: the Locus agent API exposes the agent as a PAYER (wallet, send,
// balance, transactions, checkout pay) but does not document a merchant
// "create checkout session" endpoint. provisionSubWallet maps to the single
// agent wallet; createCheckoutSession is intentionally unsupported until the
// monetization model is decided (see Phase 4 note).
export class RealPaymentsAdapter implements PaymentsAdapter {
  async getBalance(input: { externalWalletId: string }) {
    void input;
    const res = await fetchRetry(`${base()}/pay/balance`, {
      headers: authHeaders()
    });
    if (!res.ok) {
      throw new Error(`Locus balance ${res.status}`);
    }
    const json = (await res.json()) as {
      data?: { usdc_balance?: string };
    };
    return {
      balance: json.data?.usdc_balance ?? "0.00",
      currency: "USDC"
    };
  }

  async provisionSubWallet(input: { projectId: string }) {
    const res = await fetchRetry(`${base()}/pay/balance`, {
      headers: authHeaders()
    });
    if (!res.ok) {
      throw new Error(`Locus wallet lookup ${res.status}`);
    }
    const json = (await res.json()) as {
      data?: { wallet_address?: string };
    };
    const address = json.data?.wallet_address ?? "";
    // The agent has one wallet; per-project sub-wallets are logical.
    return {
      subWalletId: `locus_${input.projectId}`,
      externalWalletId: address,
      address
    };
  }

  // Model (a): no Locus merchant session endpoint exists for agents, so the
  // buyer pays by USDC transfer to the agent wallet with the session id as
  // memo; we reconcile from /pay/transactions.
  async createCheckoutSession(input: {
    projectId: string;
    pricingKey: string;
    amount: string;
    currency: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    void input.pricingKey;
    void input.cancelUrl;
    const res = await fetchRetry(`${base()}/pay/balance`, {
      headers: authHeaders()
    });
    if (!res.ok) {
      throw new Error(`Locus wallet lookup ${res.status}`);
    }
    const json = (await res.json()) as {
      data?: { wallet_address?: string };
    };
    const payToAddress = json.data?.wallet_address ?? "";
    return {
      externalSessionId: "",
      checkoutUrl: input.successUrl,
      status: "created",
      payToAddress
    };
  }

  async listTransactions() {
    const res = await fetchRetry(`${base()}/pay/transactions?limit=50`, {
      headers: authHeaders()
    });
    if (!res.ok) {
      throw new Error(`Locus transactions ${res.status}`);
    }
    const json = (await res.json()) as {
      data?: {
        transactions?: {
          id?: string;
          amount_usdc?: string;
          memo?: string;
          status?: string;
          created_at?: string;
        }[];
      };
    };
    return (json.data?.transactions ?? []).map((t) => ({
      id: t.id ?? "",
      amount: t.amount_usdc ?? "0",
      memo: t.memo ?? "",
      status: t.status ?? "",
      occurredAt: t.created_at ?? ""
    }));
  }
}

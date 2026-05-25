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
// Monetization model: Locus Checkout (Stripe-style hosted sessions). The
// micro-SaaS acts as the MERCHANT: it mints a real checkout session
// (`POST /checkout/sessions`) that returns a hosted pay page; settlement is
// reconciled by polling the session status (`GET /checkout/sessions/:id`).
// provisionSubWallet maps to the single agent wallet (per-project balances
// are tracked logically and swept by the treasury).
export class RealPaymentsAdapter implements PaymentsAdapter {
  private async walletAddress(): Promise<string> {
    const res = await fetchRetry(`${base()}/pay/balance`, {
      headers: authHeaders()
    });
    if (!res.ok) {
      throw new Error(`Locus wallet lookup ${res.status}`);
    }
    const json = (await res.json()) as {
      data?: { wallet_address?: string };
    };
    return json.data?.wallet_address ?? "";
  }

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
    const address = await this.walletAddress();
    // The agent has one wallet; per-project sub-wallets are logical.
    return {
      subWalletId: `locus_${input.projectId}`,
      externalWalletId: address,
      address
    };
  }

  // Locus Checkout: create a real hosted checkout session. The buyer pays at
  // the returned `checkoutUrl` (human wallet) or an agent settles it via
  // `POST /checkout/agent/pay/:id`. Reconciled by getCheckoutSessionStatus.
  async createCheckoutSession(input: {
    projectId: string;
    pricingKey: string;
    amount: string;
    currency: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    const payload = {
      amount: input.amount,
      currency: input.currency || "USDC",
      description: `SaaS-Factory micro-SaaS access (${input.pricingKey})`,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      metadata: { projectId: input.projectId, pricingKey: input.pricingKey }
    };
    const res = await fetchRetry(`${base()}/checkout/sessions`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Locus checkout create ${res.status}`);
    }
    const json = (await res.json()) as {
      data?: { id?: string; checkoutUrl?: string; status?: string };
    };
    const data = json.data ?? {};
    let payToAddress = "";
    try {
      payToAddress = await this.walletAddress();
    } catch {
      payToAddress = "";
    }
    return {
      externalSessionId: data.id ?? "",
      checkoutUrl: data.checkoutUrl ?? input.successUrl,
      status: (data.status ?? "PENDING").toLowerCase(),
      payToAddress
    };
  }

  async getCheckoutSessionStatus(input: { externalSessionId: string }) {
    if (!input.externalSessionId) {
      return { status: "not_found", externalTransactionId: "" };
    }
    const res = await fetchRetry(
      `${base()}/checkout/sessions/${encodeURIComponent(input.externalSessionId)}`,
      { headers: authHeaders() }
    );
    if (res.status === 404) {
      return { status: "not_found", externalTransactionId: "" };
    }
    if (!res.ok) {
      throw new Error(`Locus session status ${res.status}`);
    }
    const json = (await res.json()) as {
      data?: { id?: string; status?: string };
    };
    const raw = (json.data?.status ?? "").toUpperCase();
    const status =
      raw === "PAID"
        ? "paid"
        : raw === "EXPIRED"
          ? "expired"
          : raw === "CANCELLED"
            ? "cancelled"
            : "pending";
    return {
      status,
      externalTransactionId: `locus_sess_${json.data?.id ?? input.externalSessionId}`
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

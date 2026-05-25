# SaaS-Factory.ai

> **Ship businesses while you sleep.**
> An autonomous micro-SaaS foundry built on the **Locus** agentic-payments ecosystem.

SaaS-Factory.ai turns a **single prompt** into a **deployed, paid, and self-retiring**
product. A pipeline of agents — Architect, Developer, Treasurer — runs the full
build-ship-monetize-sunset loop on autopilot, then quietly retires whatever stops
earning. No human in the loop after the prompt.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-Postgres-2D3748?logo=prisma&logoColor=white" />
  <img alt="Locus" src="https://img.shields.io/badge/Payments-Locus-7c5cff" />
  <img alt="status" src="https://img.shields.io/badge/demo-live%20locally-22d3c5" />
</p>

---

## The problem

Spinning up a micro-SaaS is mostly undifferentiated grunt work: scaffold a product,
write the copy, host it, wire up payments, watch the metrics, and — the part nobody
does — **shut it down** when it stops making money. Most side projects die as
abandoned tabs and a recurring hosting bill.

## The solution

Describe the product in one sentence. SaaS-Factory.ai does the rest:

```
"A tool that estimates Ethereum gas fees for a given transaction."
        │
        ▼
   architecting ─▶ coding ─▶ deploying ─▶ integrating_payments ─▶ active
        │                                                            │
        └──────────────  (no revenue for 72h)  ──▶ sunset_pending ──▶ archived
```

Every project is born, monetized, watched, and retired by agents. The **treasury**
sweeps each project's earnings to a master wallet and refuses to spend on new AI
work when the balance dips below a reserve — the factory only builds what it can
afford to build.

---

## How it works

`POST /api/projects` creates a project + a run. The pipeline
(`server/pipeline/engine.ts`) advances it through guarded, idempotent stages:

| Stage | Agent | What happens |
| --- | --- | --- |
| **architecting** | Architect (OpenAI) | Drafts the product spec from the prompt. |
| **coding** | Developer (OpenAI) | Writes the product copy; the shared template (`server/template/tool.ts`) renders a full single-file micro-SaaS with a Locus paywall, then pushes it to a **real GitHub repo**. |
| **deploying** | — | Provisions + deploys the artifact (Vercel). |
| **integrating_payments** | Treasurer | Provisions a Locus **sub-wallet** for the project. |
| **active** | — | Live, taking payments, accruing revenue. |
| **sunset_pending → archived** | Treasurer | No transaction for `SUNSET_HOURS` (72) → flagged; after a grace window → torn down + repo archived. |

The pipeline kicks off immediately via Next's `after()` and is resumed by
**Vercel Cron** (`/api/internal/pipeline/tick`), so it survives serverless cold
boundaries. Generated apps are previewable in-app at `/preview/{projectId}`.

### Payments (USDC transfer + reconciliation)

Locus's agent API has no merchant "create-session" endpoint, so the buyer pays by
**USDC transfer to the agent wallet** with the session id as the memo:

- `POST /api/projects/:id/payment-sessions` → creates a session.
- `POST /api/payments/:sessionId` → reconciles against the real `/pay/transactions`
  feed, **atomically** (single-winner, on-chain tx deduped), and records the
  transaction, revenue, and sub-wallet balance.

### Treasury & sunset

- `POST /api/internal/treasury/sync` — pulls the real wallet balance and sweeps
  per-project balances to the master wallet.
- `POST /api/internal/sunset/run` — moves idle projects to `sunset_pending`, then
  archives (teardown + repo archive) after the grace period.

Internal routes require `CRON_SECRET` (header `x-cron-secret`, `Authorization:
Bearer`, or `?secret=`). Crons are declared in `vercel.json`.

---

## Architecture

```
 Next.js App Router (UI + API)
 ├─ Landing / Dashboard / Project pages   (React 19 + Tailwind + Framer Motion)
 ├─ /api/*  REST surface
 │
 ├─ server/pipeline/engine.ts             state machine (guarded, idempotent)
 ├─ server/treasury/engine.ts             sweep + sunset logic
 ├─ server/services|repositories          domain logic over Prisma
 │
 └─ server/adapters/                       ◀── the key abstraction
    ├─ ai        (OpenAI)        mock | real
    ├─ git       (GitHub)        mock | real
    ├─ deploy    (Vercel)        mock | real
    └─ payments  (Locus)         mock | real
                              │
                       PostgreSQL + Prisma
```

The **adapter layer** is the heart of the design: every external integration is
either `mock` (deterministic, no keys, runs fully offline) or `real`, chosen per
env var. The same pipeline code runs in a demo on a laptop and against live
OpenAI / GitHub / Vercel / Locus.

```
AI_DRIVER · GIT_DRIVER · DEPLOY_DRIVER · PAYMENTS_DRIVER  =  mock | real
```

---

## Tech stack

- **Next.js 15** (App Router) + **React 19**, **Tailwind**, **Framer Motion**
- **PostgreSQL + Prisma**
- **OpenAI** (Architect + Developer agents)
- **GitHub** (real repo creation + push of the generated artifact)
- **Vercel** (deploy + Cron for the autonomous loop)
- **Locus** (agentic USDC payments — sub-wallets, reconciliation, treasury)

## Hardening

- All external calls go through `fetchRetry` (timeout + exponential backoff on 429/5xx).
- Payment settlement is **atomic and deduped** — no double-credit.
- OpenAI usage is capped (`OPENAI_MAX_TOKENS`); the pipeline **refuses AI work**
  when the real treasury is below `TREASURY_RESERVE_USDC`.

---

## Quickstart

```bash
cp .env.example .env          # fill secrets; keep *_DRIVER=mock to run fully offline
docker compose up -d db       # local Postgres
npm install
npm run db:migrate            # apply schema
npm run db:seed               # demo data
npm run dev                   # http://localhost:3000
```

`npm run db:reset` recreates the DB · `npm run build` · `npm test` · `npm run typecheck`.

> **Windows note:** stop the dev server before `npm run build` — Next's dev server
> locks the Prisma query-engine DLL.

### Drivers / env

Each integration is selected by `AI_DRIVER`, `GIT_DRIVER`, `DEPLOY_DRIVER`,
`PAYMENTS_DRIVER`. Real adapters read `OPENAI_API_KEY`, `GITHUB_TOKEN` / `GITHUB_OWNER`,
`VERCEL_API_TOKEN`, and `LOCUS_API_KEY` / `LOCUS_API_URL`. See `.env.example` — the
defaults are all `mock`, so a clean clone runs end-to-end with **no keys at all**.

---

## Demo status

Honest snapshot of what's wired to live services vs. mocked for the demo:

| Integration | Status |
| --- | --- |
| **OpenAI** | ✅ Real & verified — Architect + Developer produce live specs/copy. |
| **GitHub** | ✅ Real & verified — creates private repos and pushes the artifact (classic `repo`-scoped token). |
| **Locus** | ✅ Real read/reconcile — agent registered, transactions reconciled against `/pay/transactions`. |
| **Vercel** | 🟡 `mock` until a project-create-capable token is provisioned. |
| **Payments** | 🟡 `mock` until the Locus wallet is funded — flip `PAYMENTS_DRIVER=real` to settle on-chain. |

---

## API surface

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/projects` | Create a project + kick off the pipeline. |
| `GET` | `/api/projects/:id` | Project detail (+ runs). |
| `POST` | `/api/projects/:id/payment-sessions` | Open a payment session. |
| `POST` | `/api/payments/:sessionId` | Reconcile / settle a payment. |
| `GET` | `/api/treasury/summary` | Global treasury + per-wallet balances. |
| `GET` | `/api/health` | Liveness. |
| `POST` | `/api/internal/pipeline/tick` | Cron: advance in-flight runs. |
| `POST` | `/api/internal/treasury/sync` | Cron: sync + sweep balances. |
| `POST` | `/api/internal/sunset/run` | Cron: flag & archive idle projects. |

---

Built for the **Locus / Paygentic** hackathon — agents that don't just build, but
**earn, and know when to quit**.

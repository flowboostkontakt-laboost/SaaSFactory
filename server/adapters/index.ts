import type {
  AdapterDriver,
  AiAdapter,
  DeployAdapter,
  GitAdapter,
  PaymentsAdapter
} from "@/server/adapters/types";
import { MockAiAdapter } from "@/server/adapters/mock/ai";
import { MockGitAdapter } from "@/server/adapters/mock/git";
import { MockDeployAdapter } from "@/server/adapters/mock/deploy";
import { MockPaymentsAdapter } from "@/server/adapters/mock/payments";
import { RealAiAdapter } from "@/server/adapters/real/ai";
import { RealGitAdapter } from "@/server/adapters/real/git";
import { RealDeployAdapter } from "@/server/adapters/real/deploy";
import { RealPaymentsAdapter } from "@/server/adapters/real/payments";

function driver(name: string): AdapterDriver {
  return process.env[name] === "real" ? "real" : "mock";
}

// Not cached: drivers can change at runtime via the settings page, so each
// call resolves the current driver. Adapters are stateless and cheap.
export function getAiAdapter(): AiAdapter {
  return driver("AI_DRIVER") === "real"
    ? new RealAiAdapter()
    : new MockAiAdapter();
}

export function getGitAdapter(): GitAdapter {
  return driver("GIT_DRIVER") === "real"
    ? new RealGitAdapter()
    : new MockGitAdapter();
}

export function getDeployAdapter(): DeployAdapter {
  return driver("DEPLOY_DRIVER") === "real"
    ? new RealDeployAdapter()
    : new MockDeployAdapter();
}

export function getPaymentsAdapter(): PaymentsAdapter {
  return driver("PAYMENTS_DRIVER") === "real"
    ? new RealPaymentsAdapter()
    : new MockPaymentsAdapter();
}

export function adapterDrivers() {
  return {
    ai: driver("AI_DRIVER"),
    git: driver("GIT_DRIVER"),
    deploy: driver("DEPLOY_DRIVER"),
    payments: driver("PAYMENTS_DRIVER")
  };
}

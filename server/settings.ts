import { prisma } from "@/lib/db";

// Operator-configurable settings. Stored in the DB and hydrated into
// process.env so the existing adapters/factory keep reading env. DB values
// override .env when present.

export const SECRET_KEYS = [
  "OPENAI_API_KEY",
  "GITHUB_TOKEN",
  "VERCEL_API_TOKEN",
  "LOCUS_API_KEY"
] as const;

export const PLAIN_KEYS = [
  "OPENAI_MODEL",
  "GITHUB_OWNER",
  "GITHUB_OWNER_TYPE",
  "GITHUB_REPO_PRIVATE",
  "VERCEL_TEAM_ID",
  "LOCUS_API_URL",
  "AI_DRIVER",
  "GIT_DRIVER",
  "DEPLOY_DRIVER",
  "PAYMENTS_DRIVER"
] as const;

export const ALL_KEYS = [...SECRET_KEYS, ...PLAIN_KEYS] as const;
export type SettingKey = (typeof ALL_KEYS)[number];

function applyToEnv(rows: { key: string; value: string }[]) {
  for (const row of rows) {
    if (row.value !== "") process.env[row.key] = row.value;
  }
}

// Load DB settings over process.env. Cheap enough to call before each flow;
// always re-applies so a fresh save takes effect immediately.
export async function ensureSettingsLoaded(): Promise<void> {
  try {
    const rows = await prisma.setting.findMany();
    applyToEnv(rows);
  } catch {
    // DB not ready: fall back to .env only.
  }
}

export async function saveSettings(
  input: Partial<Record<SettingKey, string>>
): Promise<void> {
  const entries = Object.entries(input).filter(
    ([key, value]) =>
      (ALL_KEYS as readonly string[]).includes(key) &&
      typeof value === "string" &&
      value.trim() !== ""
  ) as [SettingKey, string][];

  for (const [key, value] of entries) {
    await prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value }
    });
    process.env[key] = value;
  }
}

function mask(value: string): string {
  if (!value) return "";
  if (value.length <= 6) return "••••";
  return `${value.slice(0, 3)}••••${value.slice(-4)}`;
}

// Effective config (DB over env), secrets masked, for the settings UI.
export async function getEffectiveSettings(): Promise<
  Record<SettingKey, string>
> {
  await ensureSettingsLoaded();
  const out = {} as Record<SettingKey, string>;
  for (const key of PLAIN_KEYS) out[key] = process.env[key] ?? "";
  for (const key of SECRET_KEYS) out[key] = mask(process.env[key] ?? "");
  return out;
}

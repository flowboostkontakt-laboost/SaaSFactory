"use client";

import { useEffect, useState } from "react";

type Settings = Record<string, string>;

const DRIVERS = [
  "AI_DRIVER",
  "GIT_DRIVER",
  "DEPLOY_DRIVER",
  "PAYMENTS_DRIVER"
] as const;
const SECRETS = [
  "OPENAI_API_KEY",
  "GITHUB_TOKEN",
  "VERCEL_API_TOKEN",
  "LOCUS_API_KEY"
] as const;
const PLAIN = [
  "OPENAI_MODEL",
  "GITHUB_OWNER",
  "GITHUB_OWNER_TYPE",
  "GITHUB_REPO_PRIVATE",
  "VERCEL_TEAM_ID",
  "LOCUS_API_URL"
] as const;

const fieldClass =
  "mt-2 w-full rounded-xl border border-offwhite/10 bg-charcoal-950/60 px-4 py-2.5 text-sm text-offwhite outline-none focus:border-violet/50";
const labelClass =
  "text-xs font-semibold uppercase tracking-[0.16em] text-offwhite-faint";

export function SettingsForm() {
  const [current, setCurrent] = useState<Settings>({});
  const [form, setForm] = useState<Settings>({});
  const [status, setStatus] = useState("Loading…");

  async function load() {
    const res = await fetch("/api/settings");
    const data = (await res.json()) as { settings: Settings };
    setCurrent(data.settings);
    const plain: Settings = {};
    [...DRIVERS, ...PLAIN].forEach((k) => (plain[k] = data.settings[k] ?? ""));
    setForm(plain);
    setStatus("");
  }

  useEffect(() => {
    load();
  }, []);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setStatus("Saving…");
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (!res.ok) {
      setStatus("Save failed.");
      return;
    }
    const data = (await res.json()) as { settings: Settings };
    setCurrent(data.settings);
    SECRETS.forEach((k) => set(k, ""));
    setStatus("Saved. Drivers and keys take effect on the next pipeline run.");
  }

  return (
    <form onSubmit={save} className="mt-10 max-w-2xl space-y-8">
      <section className="rounded-[24px] border border-offwhite/10 bg-charcoal-900/60 p-6">
        <p className="text-sm font-semibold text-offwhite">Drivers</p>
        <p className="mt-1 text-sm text-offwhite-muted">
          mock = runs offline with fake data. real = uses your keys below.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {DRIVERS.map((k) => (
            <label key={k} className="block">
              <span className={labelClass}>{k.replace("_DRIVER", "")}</span>
              <select
                className={fieldClass}
                value={form[k] ?? "mock"}
                onChange={(e) => set(k, e.target.value)}
              >
                <option value="mock">mock</option>
                <option value="real">real</option>
              </select>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-offwhite/10 bg-charcoal-900/60 p-6">
        <p className="text-sm font-semibold text-offwhite">API keys</p>
        <p className="mt-1 text-sm text-offwhite-muted">
          Stored in your local database. Leave blank to keep the current value.
        </p>
        <div className="mt-5 space-y-4">
          {SECRETS.map((k) => (
            <label key={k} className="block">
              <span className={labelClass}>{k}</span>
              <input
                type="password"
                autoComplete="off"
                className={fieldClass}
                placeholder={current[k] ? `current: ${current[k]}` : "not set"}
                value={form[k] ?? ""}
                onChange={(e) => set(k, e.target.value)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-offwhite/10 bg-charcoal-900/60 p-6">
        <p className="text-sm font-semibold text-offwhite">Configuration</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {PLAIN.map((k) => (
            <label key={k} className="block">
              <span className={labelClass}>{k}</span>
              <input
                className={fieldClass}
                value={form[k] ?? ""}
                onChange={(e) => set(k, e.target.value)}
              />
            </label>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="rounded-full bg-violet px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-violet/90"
        >
          Save settings
        </button>
        <span className="text-sm text-offwhite-muted">{status}</span>
      </div>
    </form>
  );
}

import { AppShell } from "@/components/dashboard/app-shell";
import { SettingsForm } from "@/components/dashboard/settings-form";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <AppShell back={{ href: "/dashboard", label: "Back to dashboard" }}>
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-violet">
        Settings
      </p>
      <h1 className="mt-4 text-[clamp(2rem,4.5vw,3rem)] font-semibold tracking-tighter text-offwhite">
        Integrations
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-offwhite-muted">
        Plug in your own GitHub / OpenAI / Vercel / Locus keys and flip each
        integration between mock and real, then run the factory.
      </p>
      <SettingsForm />
    </AppShell>
  );
}

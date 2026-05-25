import { NextRequest, NextResponse } from "next/server";
import {
  getEffectiveSettings,
  saveSettings,
  type SettingKey
} from "@/server/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ settings: await getEffectiveSettings() });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Partial<
    Record<SettingKey, string>
  >;
  await saveSettings(body);
  return NextResponse.json({ settings: await getEffectiveSettings() });
}

import { NextRequest, NextResponse } from "next/server";
import { cronAuthorized } from "@/server/cron-auth";
import { syncTreasury } from "@/server/treasury/engine";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function handle(request: NextRequest) {
  if (!cronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await syncTreasury());
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}

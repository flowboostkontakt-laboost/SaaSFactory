import { NextRequest, NextResponse } from "next/server";
import { cronAuthorized } from "@/server/cron-auth";
import { runSunset } from "@/server/treasury/engine";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function handle(request: NextRequest) {
  if (!cronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const hoursParam = request.nextUrl.searchParams.get("hours");
  const graceParam = request.nextUrl.searchParams.get("grace");
  const result = await runSunset({
    hours: hoursParam !== null ? Number(hoursParam) : undefined,
    grace: graceParam !== null ? Number(graceParam) : undefined
  });
  return NextResponse.json(result);
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}

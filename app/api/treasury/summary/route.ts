import { NextResponse } from "next/server";
import { getTreasurySummary } from "@/server/services/treasury-service";

export async function GET() {
  return NextResponse.json({
    summary: await getTreasurySummary()
  });
}

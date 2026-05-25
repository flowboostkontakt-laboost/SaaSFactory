import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "saas-factory-ai",
    timestamp: new Date().toISOString()
  });
}

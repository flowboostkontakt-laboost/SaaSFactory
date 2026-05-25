import { NextRequest, NextResponse, after } from "next/server";
import { createProject, listProjects } from "@/server/services/project-service";
import { runProjectPipeline } from "@/server/pipeline/engine";

export async function GET() {
  return NextResponse.json({ projects: await listProjects() });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    prompt?: string;
    templateType?: string;
    pricing?: {
      amount?: string;
      currency?: string;
      unitLabel?: string;
    };
  };

  if (!body.prompt?.trim()) {
    return NextResponse.json(
      { error: "Prompt is required." },
      { status: 400 }
    );
  }

  const result = await createProject({
    prompt: body.prompt.trim(),
    templateType: body.templateType ?? "tool",
    amount: body.pricing?.amount ?? "1.00",
    currency: body.pricing?.currency ?? "USDC",
    unitLabel: body.pricing?.unitLabel ?? "1 generation"
  });

  // Drive the pipeline after the response is sent. Vercel Cron
  // (/api/internal/pipeline/tick) is the reliable backstop / resumer.
  after(async () => {
    await runProjectPipeline(result.project.id);
  });

  return NextResponse.json(result, { status: 201 });
}

import { NextResponse } from "next/server";
import { getProject, listProjectRuns } from "@/server/services/project-service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;
  const project = await getProject(projectId);

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({
    runs: await listProjectRuns(projectId)
  });
}

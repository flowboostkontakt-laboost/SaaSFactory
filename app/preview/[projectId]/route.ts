import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;
  const artifact = await prisma.projectArtifact.findUnique({
    where: { projectId }
  });

  if (!artifact) {
    return new Response("No preview available yet for this project.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }

  return new Response(artifact.html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

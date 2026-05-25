import type { NextRequest } from "next/server";

// Shared guard for internal cron endpoints. Accepts x-cron-secret header,
// Authorization: Bearer <secret> (Vercel Cron), or ?secret= query.
export function cronAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header =
    request.headers.get("x-cron-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    request.nextUrl.searchParams.get("secret");
  return header === secret;
}

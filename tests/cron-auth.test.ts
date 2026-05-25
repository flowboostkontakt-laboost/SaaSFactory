import { describe, it, expect, beforeEach } from "vitest";
import type { NextRequest } from "next/server";
import { cronAuthorized } from "@/server/cron-auth";

function req(headers: Record<string, string>, query: Record<string, string> = {}) {
  return {
    headers: { get: (k: string) => headers[k.toLowerCase()] ?? null },
    nextUrl: { searchParams: { get: (k: string) => query[k] ?? null } }
  } as unknown as NextRequest;
}

describe("cronAuthorized", () => {
  beforeEach(() => {
    process.env.CRON_SECRET = "s3cret";
  });

  it("accepts x-cron-secret header", () => {
    expect(cronAuthorized(req({ "x-cron-secret": "s3cret" }))).toBe(true);
  });

  it("accepts Authorization Bearer", () => {
    expect(cronAuthorized(req({ authorization: "Bearer s3cret" }))).toBe(true);
  });

  it("accepts ?secret query", () => {
    expect(cronAuthorized(req({}, { secret: "s3cret" }))).toBe(true);
  });

  it("rejects wrong secret", () => {
    expect(cronAuthorized(req({ "x-cron-secret": "nope" }))).toBe(false);
  });

  it("rejects when CRON_SECRET unset", () => {
    delete process.env.CRON_SECRET;
    expect(cronAuthorized(req({ "x-cron-secret": "s3cret" }))).toBe(false);
  });
});

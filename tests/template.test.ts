import { describe, it, expect } from "vitest";
import { renderTool } from "@/server/template/tool";

describe("renderTool", () => {
  const html = renderTool({
    projectId: "proj_test",
    projectName: "Gas Tool <x>",
    tagline: "Estimate gas",
    inputLabel: "Wallet",
    placeholder: "0x...",
    ctaLabel: "Run",
    resultText: "Result body",
    baseUrl: "http://localhost:3000/",
    amount: "1.00",
    currency: "USDC"
  });

  it("renders a full HTML document", () => {
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain("</html>");
  });

  it("escapes HTML in copy (no raw tags injected)", () => {
    expect(html).not.toContain("Gas Tool <x>");
    expect(html).toContain("Gas Tool &lt;x&gt;");
  });

  it("wires the Locus paywall to the backend", () => {
    expect(html).toContain("/api/projects/");
    expect(html).toContain("/api/payments/");
    expect(html).toContain('"projectId":"proj_test"');
    expect(html).toContain("1.00 USDC");
  });
});

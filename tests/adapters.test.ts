import { describe, it, expect } from "vitest";
import { adapterDrivers } from "@/server/adapters";

describe("adapterDrivers", () => {
  it("defaults every driver to mock when env is unset", () => {
    delete process.env.AI_DRIVER;
    delete process.env.GIT_DRIVER;
    delete process.env.DEPLOY_DRIVER;
    delete process.env.PAYMENTS_DRIVER;
    expect(adapterDrivers()).toEqual({
      ai: "mock",
      git: "mock",
      deploy: "mock",
      payments: "mock"
    });
  });

  it("reports real only when explicitly set to real", () => {
    process.env.AI_DRIVER = "real";
    process.env.GIT_DRIVER = "anything-else";
    expect(adapterDrivers().ai).toBe("real");
    expect(adapterDrivers().git).toBe("mock");
  });
});

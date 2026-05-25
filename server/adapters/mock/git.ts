import { randomBytes } from "node:crypto";
import type { GitAdapter } from "@/server/adapters/types";

export class MockGitAdapter implements GitAdapter {
  async createRepository(input: { slug: string; name: string }) {
    const externalRepoId = `gh_${randomBytes(6).toString("hex")}`;
    return {
      repoUrl: `https://github.com/saas-factory/${input.slug}`,
      externalRepoId
    };
  }

  async pushFiles(input: {
    externalRepoId: string;
    files: { path: string; contents: string }[];
  }) {
    void input;
    return { commitSha: randomBytes(20).toString("hex") };
  }

  async archiveRepository(input: { externalRepoId: string }) {
    void input;
  }
}

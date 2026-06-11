import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateProfile } from "../src/commands/profile.js";

let root: string | undefined;

afterEach(async () => {
  if (root) await rm(root, { recursive: true, force: true });
  root = undefined;
});

describe("validateProfile", () => {
  it("returns success for structurally valid profile files", async () => {
    root = await mkdtemp(path.join(tmpdir(), "project-butler-"));
    await mkdir(path.join(root, ".claude"), { recursive: true });
    await mkdir(path.join(root, "docs/prd"), { recursive: true });
    await writeFile(path.join(root, "docs/prd/main.md"), "# PRD\n");
    await writeFile(path.join(root, ".claude/project-profile.json"), JSON.stringify({
      schema_version: "1.0",
      doc_policies: {
        "docs/prd/main.md": { status: "draft" }
      }
    }));
    await writeFile(path.join(root, ".claude/profile-pending.json"), JSON.stringify({
      schema_version: "1.0",
      items: [{ id: "pending-1", status: "pending", doc: "docs/prd/main.md" }]
    }));

    assert.equal(await validateProfile({ root }), 0);
  });
});

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { nextVersion } from "../src/lib/changelog.js";

const date = new Date("2026-06-10T00:00:00Z");

describe("nextVersion", () => {
  it("bumps semantic versions", () => {
    assert.equal(nextVersion("v0.1.0", "semantic", "minor", date), "v0.2.0");
    assert.equal(nextVersion("v0.1.0", "semantic", "patch", date), "v0.1.1");
    assert.equal(nextVersion("v0.1.0", "semantic", "major", date), "v1.0.0");
  });

  it("skips patch-level codename entries", () => {
    assert.equal(nextVersion("Atlas 0.1", "codename", "patch", date, "Atlas"), null);
    assert.equal(nextVersion("Atlas 0.1", "codename", "minor", date, "Atlas"), "Atlas 0.2");
  });

  it("increments date versions within the current month", () => {
    assert.equal(nextVersion("2026.06.1", "date", "minor", date), "2026.06.2");
    assert.equal(nextVersion("2026.05.3", "date", "minor", date), "2026.06.1");
  });
});

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseArgs } from "../src/lib/args.js";

describe("parseArgs", () => {
  it("parses commands, scalar flags, boolean flags, and repeated bullets", () => {
    const parsed = parseArgs(["changelog", "bump", "--level", "minor", "--title", "Add CLI", "--bullet", "One", "--bullet", "Two", "--write"]);

    assert.deepEqual(parsed.positionals, ["changelog", "bump"]);
    assert.equal(parsed.flags.level, "minor");
    assert.equal(parsed.flags.title, "Add CLI");
    assert.equal(parsed.flags.write, true);
    assert.deepEqual(parsed.listFlags.bullet, ["One", "Two"]);
  });
});

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { markdownLinks } from "../src/lib/markdown.js";

describe("markdownLinks", () => {
  it("ignores code examples, inline code, and template placeholders", () => {
    const links = markdownLinks(`
[real](docs/real.md)
\`[inline](missing.md)\`

\`\`\`markdown
[code](missing.md)
\`\`\`

[template](docs/{type}/{filename})
`);

    assert.deepEqual(links, ["docs/real.md"]);
  });
});

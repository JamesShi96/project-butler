import path from "node:path";
import { nextVersion, VersionLevel } from "../lib/changelog.js";
import { readTextIfExists, writeText } from "../lib/fs.js";

const allowedLevels = new Set(["major", "minor", "patch"]);

export async function bumpChangelog(options: { root: string; level: string; title: string; bullets: string[]; write?: boolean }): Promise<number> {
  if (!allowedLevels.has(options.level)) {
    console.error(`Invalid --level ${options.level}. Use major, minor, or patch.`);
    return 2;
  }
  if (!options.title.trim()) {
    console.error("--title is required.");
    return 2;
  }

  const changelogPath = path.join(options.root, "UPDATE_LOG.md");
  const existing = (await readTextIfExists(changelogPath)) ?? "# Update Log\n\n<!-- version-style: semantic -->\n";
  const style = existing.match(/<!--\s*version-style:\s*([a-z]+)\s*-->/)?.[1] ?? "semantic";
  const codename = existing.match(/<!--\s*version-codename:\s*(.+?)\s*-->/)?.[1];
  const current = existing.match(/^##\s+(.+?)\s+\(\d{4}-\d{2}-\d{2}\)/m)?.[1] ?? initialVersion(style, codename);
  const version = nextVersion(current, style, options.level as VersionLevel, new Date(), codename);

  if (version === null) {
    console.log(`No changelog entry for ${options.level} level under ${style} style.`);
    return 0;
  }

  const entry = formatEntry(version, options.level as VersionLevel, options.title, options.bullets);
  const next = insertEntry(existing, entry);

  console.log(entry.trim());
  if (options.write) {
    await writeText(changelogPath, next);
    console.log("Wrote UPDATE_LOG.md");
  } else {
    console.log("Dry run. Pass --write to update UPDATE_LOG.md.");
  }
  return 0;
}

function initialVersion(style: string, codename?: string): string {
  if (style === "codename") return `${codename ?? "Project"} 0.1`;
  if (style === "patch") return "Patch 1";
  if (style === "date") {
    const date = new Date();
    return `${date.getFullYear()}.${`${date.getMonth() + 1}`.padStart(2, "0")}.1`;
  }
  return "v0.1.0";
}

function formatEntry(version: string, level: VersionLevel, title: string, bullets: string[]): string {
  const body = bullets.length > 0 ? bullets.map((bullet) => `- ${bullet}`).join("\n") : "- Update recorded.";
  return `## ${version} (${new Date().toISOString().slice(0, 10)})

### ${capitalize(level)}: ${title}

${body}

---

`;
}

function insertEntry(existing: string, entry: string): string {
  const lines = existing.split("\n");
  const firstHeadingIndex = lines.findIndex((line, index) => index > 0 && line.startsWith("## "));
  if (firstHeadingIndex === -1) {
    return `${existing.trim()}\n\n${entry}`;
  }
  return `${lines.slice(0, firstHeadingIndex).join("\n").trim()}\n\n${entry}${lines.slice(firstHeadingIndex).join("\n")}`;
}

function capitalize(value: string): string {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

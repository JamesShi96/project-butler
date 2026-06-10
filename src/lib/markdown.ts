import path from "node:path";
import { pathExists, readTextIfExists, toPosix } from "./fs.js";

const markdownLinkPattern = /\[[^\]]+\]\((?!https?:\/\/|mailto:|#)([^)]+)\)/g;

export function firstHeading(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? "Untitled";
}

export function markdownLinks(markdown: string): string[] {
  const withoutCode = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]+`/g, "");
  const links: string[] = [];
  for (const match of withoutCode.matchAll(markdownLinkPattern)) {
    const raw = match[1].split("#")[0].trim();
    if (raw && !raw.includes("{") && !raw.includes("}")) links.push(raw);
  }
  return links;
}

export async function brokenLinks(root: string, markdownPath: string): Promise<string[]> {
  const text = await readTextIfExists(path.join(root, markdownPath));
  if (text === null) return [];

  const baseDir = path.dirname(markdownPath);
  const broken: string[] = [];
  for (const link of markdownLinks(text)) {
    const target = toPosix(path.normalize(path.join(baseDir, link)));
    const rootTarget = toPosix(path.normalize(link));
    if (!(await pathExists(path.join(root, target))) && !(await pathExists(path.join(root, rootTarget)))) {
      broken.push(link);
    }
  }
  return broken;
}

import { promises as fs } from "node:fs";
import path from "node:path";

const excludedDirs = new Set([".git", "node_modules", "dist", ".DS_Store"]);

export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readTextIfExists(filePath: string): Promise<string | null> {
  if (!(await pathExists(filePath))) return null;
  return fs.readFile(filePath, "utf8");
}

export async function readJsonIfExists<T>(filePath: string): Promise<{ value?: T; error?: string }> {
  const text = await readTextIfExists(filePath);
  if (text === null) return {};
  try {
    return { value: JSON.parse(text) as T };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

export async function listFiles(root: string): Promise<string[]> {
  const output: string[] = [];

  async function visit(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (excludedDirs.has(entry.name)) continue;
      const absolute = path.join(dir, entry.name);
      const relative = toPosix(path.relative(root, absolute));
      if (entry.isDirectory()) {
        await visit(absolute);
      } else if (entry.isFile()) {
        output.push(relative);
      }
    }
  }

  await visit(root);
  return output.sort();
}

export async function listMarkdownFiles(root: string, base = "."): Promise<string[]> {
  const files = await listFiles(path.join(root, base));
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => toPosix(path.join(base, file)))
    .sort();
}

export function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

export async function writeJson(filePath: string, value: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export async function writeText(filePath: string, value: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, value);
}

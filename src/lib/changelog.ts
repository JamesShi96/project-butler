export type VersionLevel = "major" | "minor" | "patch";

export function nextVersion(current: string, style: string, level: VersionLevel, date: Date, codename?: string): string | null {
  if (style === "semantic") {
    const match = current.match(/^v(\d+)\.(\d+)\.(\d+)$/);
    const major = Number(match?.[1] ?? 0);
    const minor = Number(match?.[2] ?? 1);
    const patch = Number(match?.[3] ?? 0);
    if (level === "major") return `v${major + 1}.0.0`;
    if (level === "minor") return `v${major}.${minor + 1}.0`;
    return `v${major}.${minor}.${patch + 1}`;
  }

  if (style === "codename") {
    if (level === "patch") return null;
    const prefix = codename ?? (current.replace(/\s+\d+\.\d+$/, "") || "Project");
    const match = current.match(/(\d+)\.(\d+)$/);
    const major = Number(match?.[1] ?? 0);
    const minor = Number(match?.[2] ?? 1);
    return level === "major" ? `${prefix} ${major + 1}.0` : `${prefix} ${major}.${minor + 1}`;
  }

  if (style === "patch") {
    if (level === "patch") return null;
    const currentPatch = Number(current.match(/Patch\s+(\d+)/)?.[1] ?? 0);
    return `Patch ${currentPatch + 1}`;
  }

  if (style === "date") {
    if (level === "patch") return null;
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const prefix = `${year}.${month}`;
    const match = current.match(/^(\d{4}\.\d{2})\.(\d+)$/);
    const count = match?.[1] === prefix ? Number(match[2]) + 1 : 1;
    return `${prefix}.${count}`;
  }

  return null;
}

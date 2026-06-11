import path from "node:path";
import { pathExists, readJsonIfExists } from "../lib/fs.js";
import { error, exitCode, Finding, ok, printFindings, warn } from "../lib/report.js";

const statuses = new Set(["pending", "repeated", "profile_debt", "review_queue", "resolved", "dismissed", "converted_to_todo"]);

export async function validateProfile(options: { root: string }): Promise<number> {
  const findings: Finding[] = [];
  const profilePath = path.join(options.root, ".claude/project-profile.json");
  const pendingPath = path.join(options.root, ".claude/profile-pending.json");

  const profile = await readJsonIfExists<Record<string, unknown>>(profilePath);
  if (profile.error) findings.push(error("profile.json", profile.error));
  if (!profile.value) findings.push(warn("profile.missing", ".claude/project-profile.json is missing"));
  if (profile.value) {
    findings.push(profile.value.schema_version ? ok("profile.schema", "project-profile.json has schema_version") : error("profile.schema", "project-profile.json is missing schema_version"));
    const policies = profile.value.doc_policies;
    if (policies && typeof policies === "object" && !Array.isArray(policies)) {
      for (const docPath of Object.keys(policies)) {
        if (!(await pathExists(path.join(options.root, docPath)))) {
          findings.push(error("profile.doc", `doc_policies references missing file ${docPath}`));
        }
      }
    } else {
      findings.push(warn("profile.doc_policies", "project-profile.json has no doc_policies object"));
    }
  }

  const pending = await readJsonIfExists<{ items?: Array<{ id?: string; status?: string; doc?: string }> }>(pendingPath);
  if (pending.error) findings.push(error("pending.json", pending.error));
  if (!pending.value) findings.push(warn("pending.missing", ".claude/profile-pending.json is missing"));
  for (const item of pending.value?.items ?? []) {
    if (!item.id) findings.push(error("pending.id", "pending item is missing id"));
    if (!item.status || !statuses.has(item.status)) findings.push(error("pending.status", `${item.id ?? "pending item"} has invalid status ${item.status ?? "(missing)"}`));
    if (item.doc && !(await pathExists(path.join(options.root, item.doc)))) findings.push(warn("pending.doc", `${item.id ?? "pending item"} references missing doc ${item.doc}`));
  }

  if (!findings.some((finding) => finding.severity === "error")) findings.push(ok("profile.validate", "Profile files are structurally valid"));
  printFindings(findings);
  return exitCode(findings);
}

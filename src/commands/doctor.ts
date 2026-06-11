import path from "node:path";
import { brokenLinks } from "../lib/markdown.js";
import { error, exitCode, Finding, ok, printFindings, warn } from "../lib/report.js";
import { listMarkdownFiles, pathExists, readJsonIfExists, readTextIfExists } from "../lib/fs.js";

const requiredFiles = ["PROJECT.md", "session-handoff.md", "TODO.md", "STRUCTURE.md", "UPDATE_LOG.md", "DOCS.md"];

export async function runDoctor(options: { root: string; json?: boolean }): Promise<number> {
  const findings: Finding[] = [];

  for (const file of requiredFiles) {
    findings.push((await pathExists(path.join(options.root, file))) ? ok("file.exists", `${file} exists`) : warn("file.missing", `${file} is missing`));
  }

  await checkJson(options.root, ".claude/project-profile.json", findings);
  await checkJson(options.root, ".claude/profile-pending.json", findings);
  await checkJson(options.root, ".claude/.file-snapshot.json", findings);

  await checkUpdateLog(options.root, findings);
  await checkTodos(options.root, findings);
  await checkDocsLinks(options.root, findings);

  if (options.json) {
    console.log(JSON.stringify(findings, null, 2));
  } else {
    printFindings(findings);
  }

  return exitCode(findings);
}

async function checkJson(root: string, relative: string, findings: Finding[]) {
  const absolute = path.join(root, relative);
  if (!(await pathExists(absolute))) return;
  const parsed = await readJsonIfExists(absolute);
  findings.push(parsed.error ? error("json.invalid", `${relative}: ${parsed.error}`) : ok("json.valid", `${relative} is valid JSON`));
}

async function checkUpdateLog(root: string, findings: Finding[]) {
  const text = await readTextIfExists(path.join(root, "UPDATE_LOG.md"));
  if (text === null) return;
  findings.push(/<!--\s*version-style:\s*(semantic|codename|patch|date)\s*-->/.test(text) ? ok("update-log.metadata", "UPDATE_LOG.md has version-style metadata") : warn("update-log.metadata", "UPDATE_LOG.md is missing version-style metadata"));
}

async function checkTodos(root: string, findings: Finding[]) {
  const text = await readTextIfExists(path.join(root, "TODO.md"));
  if (text === null) return;
  const tasks = text.split("\n").map((line, index) => ({ line, index })).filter(({ line }) => /^- \[[ xX]\]/.test(line));
  for (const task of tasks) {
    const next = text.split("\n")[task.index + 1] ?? "";
    if (!/Owner:\s*.+\|\s*Deadline:\s*.+\|\s*Dependencies:\s*.+/.test(next)) {
      findings.push(warn("todo.metadata", `TODO.md task on line ${task.index + 1} is missing Owner/Deadline/Dependencies metadata`));
    }
  }
  if (tasks.length > 0 && !findings.some((finding) => finding.code === "todo.metadata")) {
    findings.push(ok("todo.metadata", "TODO.md tasks include required metadata"));
  }
}

async function checkDocsLinks(root: string, findings: Finding[]) {
  const markdownFiles = await listMarkdownFiles(root);
  for (const file of markdownFiles) {
    const broken = await brokenLinks(root, file);
    for (const link of broken) {
      findings.push(error("markdown.link", `${file} links to missing target ${link}`));
    }
  }
  if (!findings.some((finding) => finding.code === "markdown.link")) {
    findings.push(ok("markdown.link", "Markdown links resolve"));
  }
}

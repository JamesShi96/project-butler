import path from "node:path";
import { firstHeading } from "../lib/markdown.js";
import { listMarkdownFiles, readTextIfExists, writeText } from "../lib/fs.js";

export async function checkDocs(options: { root: string; write?: boolean }): Promise<number> {
  const docsRoot = path.join(options.root, "docs");
  const docsFiles = (await listMarkdownFiles(options.root, "docs")).filter((file) => file !== "DOCS.md");
  const indexPath = path.join(options.root, "DOCS.md");
  const existing = await readTextIfExists(indexPath);
  const missingFromIndex: string[] = [];

  for (const file of docsFiles) {
    if (!existing?.includes(file)) missingFromIndex.push(file);
  }

  console.log(`Docs scan: ${docsFiles.length} markdown files under ${path.relative(options.root, docsRoot)}`);
  console.log(`Missing from DOCS.md: ${missingFromIndex.length}`);
  for (const file of missingFromIndex) console.log(`+ ${file}`);

  if (!options.write) {
    console.log("Dry run. Pass --write to rewrite DOCS.md with the scanned index.");
    return 0;
  }

  const rows: string[] = [];
  for (const file of docsFiles) {
    const text = await readTextIfExists(path.join(options.root, file));
    rows.push(`| [${file}](${file}) | ${firstHeading(text ?? "")} | 草稿 | ${today()} | - |`);
  }

  await writeText(indexPath, `# 文档索引

> 最后更新：${today()}

## Documents
| 文档 | 标题 | 状态 | 最后更新 | Sub 文档 |
|------|------|------|----------|----------|
${rows.length > 0 ? rows.join("\n") : "| （暂无） | | | | |"}

## 整理历史
| 日期 | 操作 | 文档数 |
|------|------|--------|
| ${today()} | docs sync | ${docsFiles.length} |
`);

  console.log("Wrote DOCS.md");
  return 0;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

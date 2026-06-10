import path from "node:path";
import { listFiles, readJsonIfExists, writeJson } from "../lib/fs.js";

interface Snapshot {
  lastScan: string;
  files: Record<string, { size?: number } | string | null>;
}

export async function updateSnapshot(options: { root: string; write?: boolean }): Promise<number> {
  const snapshotPath = path.join(options.root, ".claude/.file-snapshot.json");
  const previous = await readJsonIfExists<Snapshot>(snapshotPath);
  const previousFiles = previous.value?.files ?? {};
  const files = (await listFiles(options.root)).filter((file) => file !== ".claude/.file-snapshot.json");
  const nextFiles = Object.fromEntries(files.map((file) => [file, null]));

  const added = files.filter((file) => !(file in previousFiles));
  const removed = Object.keys(previousFiles).filter((file) => !files.includes(file));

  console.log(`Snapshot scan: ${files.length} files`);
  console.log(`Added: ${added.length}`);
  for (const file of added.slice(0, 20)) console.log(`+ ${file}`);
  console.log(`Removed: ${removed.length}`);
  for (const file of removed.slice(0, 20)) console.log(`- ${file}`);

  if (options.write) {
    await writeJson(snapshotPath, { lastScan: new Date().toISOString(), files: nextFiles });
    console.log(`Wrote ${path.relative(options.root, snapshotPath)}`);
  } else {
    console.log("Dry run. Pass --write to update the snapshot.");
  }

  return 0;
}

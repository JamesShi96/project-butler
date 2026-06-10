#!/usr/bin/env node
import { bumpChangelog } from "./commands/changelog.js";
import { checkDocs } from "./commands/docs.js";
import { runDoctor } from "./commands/doctor.js";
import { validateProfile } from "./commands/profile.js";
import { updateSnapshot } from "./commands/snapshot.js";
import { parseArgs } from "./lib/args.js";

async function main(argv: string[]) {
  const args = parseArgs(argv);
  const [command, subcommand] = args.positionals;
  const root = String(args.flags.root ?? process.cwd());

  if (!command || args.flags.help) {
    printHelp();
    return;
  }

  if (command === "doctor") {
    process.exitCode = await runDoctor({ root, json: Boolean(args.flags.json) });
    return;
  }

  if (command === "snapshot") {
    process.exitCode = await updateSnapshot({ root, write: Boolean(args.flags.write) });
    return;
  }

  if (command === "docs" && subcommand === "sync") {
    process.exitCode = await checkDocs({ root, write: Boolean(args.flags.write) });
    return;
  }

  if (command === "profile" && subcommand === "validate") {
    process.exitCode = await validateProfile({ root });
    return;
  }

  if (command === "changelog" && subcommand === "bump") {
    process.exitCode = await bumpChangelog({
      root,
      level: String(args.flags.level ?? "minor"),
      title: String(args.flags.title ?? ""),
      bullets: args.listFlags.bullet ?? [],
      write: Boolean(args.flags.write)
    });
    return;
  }

  console.error(`Unknown command: ${args.positionals.join(" ")}`);
  printHelp();
  process.exitCode = 2;
}

function printHelp() {
  console.log(`project-butler

Usage:
  project-butler doctor [--root <path>] [--json]
  project-butler snapshot [--root <path>] [--write]
  project-butler docs sync [--root <path>] [--write]
  project-butler profile validate [--root <path>]
  project-butler changelog bump --level <major|minor|patch> --title <text> --bullet <text> [--write]

Commands default to read-only checks unless --write is passed.`);
}

main(process.argv.slice(2)).catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

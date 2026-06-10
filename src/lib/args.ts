export interface ParsedArgs {
  positionals: string[];
  flags: Record<string, string | boolean>;
  listFlags: Record<string, string[]>;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const positionals: string[] = [];
  const flags: Record<string, string | boolean> = {};
  const listFlags: Record<string, string[]> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }

    const key = arg.slice(2);
    const next = argv[index + 1];
    const value = next && !next.startsWith("--") ? next : true;
    if (value !== true) index += 1;

    if (key === "bullet") {
      listFlags.bullet = listFlags.bullet ?? [];
      listFlags.bullet.push(String(value));
    } else {
      flags[key] = value;
    }
  }

  return { positionals, flags, listFlags };
}

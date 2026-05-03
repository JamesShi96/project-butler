# Language Change Protocol

> Loaded during: "切换语言" / "change language" triggers.

Triggered when user expresses intent to change language (any expression: 切换语言, change language, switch to English, 换成中文, etc.).

## Flow

```
1. Determine target language:
   - If user specifies a language: use that (en / zh / bilingual)
   - If ambiguous: ask using AskUserQuestion

2. Update CLAUDE.md:
   - Change the Language section: - **Language:** {new language}
   - Update all headers and content in CLAUDE.md to the new language
   (Use the Key Terms Glossary from references/language-adaptation.md for translations)

3. Rewrite all system management files in the new language:
   - PROJECT.md — translate all headers, descriptions, table column names
   - session-handoff.md — translate all headers and content
   - TODO.md — translate meta instructions and headers
   - .claude/candidates.md — translate section headers
   - STRUCTURE.md — translate all headers and table column names;
     update 命名规范 column to reflect new language's naming conventions
   - .cursor/rules/project-system.mdc — translate all content (if exists)

4. Ask user about user file renaming:
   "是否要按新语言的命名规范重命名用户文件？(Rename user files to match new language naming conventions?)"
   → Use AskUserQuestion with yes/no options

5. If user chose yes:
   a. Read STRUCTURE.md naming conventions for the new language
   b. Scan all user files (respecting exclusion rules)
   c. For each file whose name doesn't match the new language convention:
      - Determine the correct new name
      - Safety checks (cross-reference, name collision, system file)
      - Rename using `git mv` if in git repo
      - Update all references in other files
   d. Update STRUCTURE.md 整理历史 with the rename operation
   e. Update .claude/.file-snapshot.json

6. Report:
   - Language changed from {old} to {new}
   - System files rewritten: {count}
   - User files renamed: {count} (or "skipped")
   - References updated: {count}
```

## Safety

- Same constraints as File Reorganization Protocol (no overwrites, preserve git history, update references)
- Never rename system management files (CLAUDE.md, PROJECT.md, etc.)
- Never rename files in exclusion list

## Common Mistakes

| Mistake | Correct Behavior |
|---------|-----------------|
| Changing system file names (CLAUDE.md, PROJECT.md) when switching language | System management file names always stay English. Only user files can be renamed. |

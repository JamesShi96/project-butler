# i18n Language Support — Design Spec

> Date: 2026-04-25
> Status: Approved
> Affects: project-init skill (SKILL.md, README.md, README_zh.md)

## Background

The project-init skill currently writes all management file content in Chinese (with some English). Users may prefer English-only or full Chinese. There is no language setting, no way to switch, and trigger words are hardcoded fixed phrases rather than semantic intent matching.

## Goal

Add configurable language support:

1. **Language options**: English (`en`), Chinese (`zh`), or bilingual (`bilingual`)
2. **Language setting** stored in CLAUDE.md
3. **All content** adapts to the selected language (headers, descriptions, summaries, log formats)
4. **System file names** (CLAUDE.md, PROJECT.md, etc.) stay English regardless
5. **User file names** adapt to language via STRUCTURE.md naming conventions
6. **Semantic trigger matching** — match intent, not fixed words
7. **Language switching** — user can change language at any time, with option to rename user files

## Design

### Language Storage

In CLAUDE.md, add a language metadata section:

```markdown
## Language / 语言
- **Language:** en | zh | bilingual
```

### Trigger System Change

Replace fixed trigger word tables with semantic intent descriptions. The AI matches intent, not exact words.

### Content Adaptation

A "Language Adaptation" section in SKILL.md provides:
- Adaptation rules per language mode
- Key terms glossary (Chinese ↔ English) for all headers, labels, section names
- The AI generates file content in the configured language using the glossary

### Language Change Protocol

New protocol for switching language:
1. Update CLAUDE.md language setting
2. Rewrite all system management files in new language
3. Ask user whether to rename user files
4. If yes: batch rename using STRUCTURE.md conventions (language-appropriate naming)

### System vs User Files

| Type | Examples | Name changes? |
|------|----------|---------------|
| System | CLAUDE.md, PROJECT.md, TODO.md, session-handoff.md, STRUCTURE.md, log/, .claude/candidates.md | No — always English |
| User | Everything else | Yes — follows language naming conventions in STRUCTURE.md |

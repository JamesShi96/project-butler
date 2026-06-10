# Project Profile System Simulation Report

Date: 2026-06-10
Status: Temporary validation checkpoint

## Scope

This report validates the current Profile System runtime wiring through text-level simulation.

It does not claim a formal release. The goal is to find whether the current `SKILL.md` and reference files are executable enough for three realistic project states:

1. Fresh project initialization.
2. Existing baseline project with early feature changes.
3. Large project with many docs, owners, and accumulated drift.

## Files Reviewed

- `SKILL.md`
- `references/project-profile-system.md`
- `references/file-templates.md`
- `references/continue.md`
- `references/continue-full-context.md`
- `references/upgrade-mode.md`
- `docs/examples.md`
- `README.md`
- `README_zh.md`
- `docs/compatibility.md`

## Scenario 1: Fresh Project Initialization

### Simulated Situation

The user runs `/project-butler` in an empty project and describes:

```text
I am building an AI agent SaaS MVP that helps users analyze competitor webpages and generate campaign recommendations.
```

### Expected Flow

1. `SKILL.md` detects Fresh mode.
2. Fresh mode loads `references/project-profile-system.md`.
3. Foundation Setup asks for natural project description and setup basics.
4. Project Butler infers a project shape, asks up to 3 targeted follow-up questions, then proposes Required / Recommended / Optional docs.
5. User confirms or edits the proposed structure.
6. Project Butler creates normal memory files plus:
   - `.claude/project-profile.json`
   - `.claude/profile-pending.json`
   - confirmed Required baseline docs.

### Result

Pass with one fix applied.

The runtime path exists and the generated templates now mention profile files. The simulation found that `project-profile.json` creation rules were underspecified: the minimum schema showed empty `directories` and `doc_policies`, which could lead an assistant to create placeholder state instead of real profile state.

### Fix Applied

`references/project-profile-system.md` now states:

- populate `directories` from the approved document tiers,
- create `doc_policies` for every created profile baseline doc,
- use conservative default policies for created `main.md` docs and sub-doc drafts.

## Scenario 2: Existing Baseline Project

### Simulated Situation

The project already has:

```text
docs/prd/main.md
docs/architecture/main.md
docs/evals/main.md
docs/roadmap/main.md
.claude/project-profile.json
.claude/profile-pending.json
```

The user adds a billing feature and changes one AI-agent behavior.

### Expected Normal Close

1. `end session` or `normal close` triggers the End Session Flow.
2. Profile impact scan detects PRD and eval impact.
3. Normal Close updates normal memory files.
4. Profile-impacting changes are recorded in `.claude/profile-pending.json`.
5. PRD/eval docs are not patched.

### Expected Full Close

1. `full close` triggers Profile-Aware End Session.
2. Project Butler produces a Scope Plan.
3. User approves the Scope Plan once.
4. Safe index/changelog/active-section updates can apply inside the approved boundary.
5. Stable Baseline changes and policy changes require explicit confirmation.

### Result

Pass with one fix applied.

Normal Close and Full Close are distinguishable. The Scope Plan and auto-apply rules are present. The simulation found that existing affected docs without `doc_policies` were not clearly handled.

### Fix Applied

`references/project-profile-system.md` now says an existing affected document without `doc_policies` is conservative by default:

- no automatic body patch,
- no protected-section change,
- no inferred policy write,
- record a pending/review item or propose a policy change for confirmation.

## Scenario 3: Large Project

### Simulated Situation

The project has many modules, many profile docs, multiple contributors, document owners, and accumulated pending profile updates.

### Expected Flow

1. Full Close requires a Scope Plan before profile docs are changed.
2. Scope Plan lists:
   - Will read,
   - May change,
   - Auto-apply,
   - Requires confirmation,
   - Will not touch.
3. Project Butler does not deep-read every document during impact scan.
4. Owner-protected docs and policy changes require confirmation.
5. Repeated or decision-heavy profile debt escalates to review queue.
6. Foundation Repair is bounded and does not become whole-project cleanup.

### Result

Pass.

The current reference covers:

- multiple contributors,
- docs with owners or update policies,
- more than 3 affected core docs,
- large existing document trees,
- protected sections,
- review queue escalation,
- stale-document evidence rules,
- bounded Foundation Repair behavior.

## Remaining Risks

The current wiring is strong enough for a temporary checkpoint but still needs hands-on validation before formal release.

1. **No executable fixture yet.**
   The simulation is text-level. A future pass should run the skill against disposable sample projects.

2. **Prompt ergonomics still need real-user testing.**
   Foundation Setup may still ask too many questions if the assistant is not disciplined.

3. **Profile JSON examples are minimal.**
   The reference now has creation rules, but fixture examples would make behavior more repeatable.

4. **Full Close can still be expensive on large projects.**
   Scope Plan rules reduce risk, but token-budget behavior should be tested on a large synthetic doc tree.

5. **Document policy migration needs careful review.**
   Existing projects with docs but no profile policies are now conservative by default. This is safer, but may require a smooth user-facing policy proposal flow.

## Conclusion

The current implementation passes text-level simulation for the three target project stages after two fixes:

- profile file creation now requires populated directories and document policies,
- affected docs without policies now default to conservative no-auto-patch behavior.

Next validation should use disposable sample projects and run manual end-to-end setup, Normal Close, Full Close, status, continue, and upgrade flows.

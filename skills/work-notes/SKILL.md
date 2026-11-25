---
name: work-notes
description: "Create or resume a dedicated work-notes folder for one piece of work (a STRY/DEF/CS item or a named task) under a base folder (suggested: ~/Workspace/REPORTS/Work notes/), and keep its PLAN, DECISIONS, FLOW, WALKTHROUGH and HANDOFF notes there through to a walkthrough review and quiz. Use when the user types /work-notes, optionally followed by a work id or description. If the user mentions a STRY/DEF/CS id or asks for a plan without invoking it, offer once, in one line, to create a work-notes folder; never create one silently."
argument-hint: "Work id (STRY/DEF/CS number) and/or a short description"
---

# Work notes

Keep the planning and documentation for one piece of work in its own folder, outside every git repository.

## Where things live

- **Base folder:** the suggested default is `~/Workspace/REPORTS/Work notes/`, or a folder the user chooses. Settle it under **Base folder setup** first.
- **Areas** (sub-folders of the base; pick the one that fits): `Defects`, `Visual Automation`, `Platform — SSR`, `Security defects`, `Skills For Work`. Run `ls` on the base folder each time, because more areas may exist. Copy area names byte for byte; several use an em dash (`—`), not a hyphen.
- **Work folder name:** the work's id (STRY/DEF/CS number, if there is one) plus a short slug, for example `STRY0000000 - Example feature`.
- **Layout precedent:** `Visual Automation/STRY0000000 - Example feature/Approach 2/` (plan, DECISIONS.md, FLOW.md, walkthrough, HANDOFF.md).
- **Index:** `Readme — Work Notes Index.md` in the base folder.

The skill's only state is the base-path config file (see **Base folder setup**). Do not use Claude project memory for it. The folders are the state.

## Base folder setup

Run this before searching. Find the base in this order:

1. **Config file:** `${XDG_CONFIG_HOME:-$HOME/.config}/work-notes/base`, one line holding an absolute path. If the file exists and that path is a folder, use it.
2. **Suggested default:** otherwise, if `~/Workspace/REPORTS/Work notes/` exists, use it.
3. **Ask:** otherwise, ask once, in one message, with two options: a base folder of the user's own choice (they give the path), or create the suggested `~/Workspace/REPORTS/Work notes/`. Create nothing until they answer. Then create the chosen folder.

When step 3 settles the base, write its absolute path to the config file, creating the `work-notes` folder if needed and overwriting any old value. Do not write the config file when the base came from step 1 or 2.

- **A new base folder** has no areas or index yet. Create the area the work fits (from the list above) under it.

## On invocation

1. **Search before creating.** Look in the base folder (the one settled above) for the id or name, matching files as well as folders, case-insensitively and recursively:
   `find "<base>" -iname "*<id or keyword>*"`
   Some items exist only as a loose file (for example `Defects/DEF0000000.md`), and one id can appear in more than one area.
   - **One match:** resume it. Do not create a duplicate. Read its plan, HANDOFF, DECISIONS and FLOW if present. Search the folder recursively, since they may be nested or named differently (`PLAN.md`, `* - Plan.md`, `HANDOFF.md`).
   - **Several matches:** list them and ask the user which to resume.
   - **A loose file only:** ask whether to make a folder around it or start fresh.
   - **No match:** go to step 2.
2. **Create.** Make `<base>/<area>/<id> - <slug>/`, then write PLAN.md (below) before any execution.
3. **Index the new folder.** Read `Readme — Work Notes Index.md` first and follow its existing format. That means an Obsidian `[[wikilink]]` bullet under the matching area in the Index section, plus a row in the "Status at a glance" table. If the index file is missing (a new base folder), skip this step and say so.

## Files in each work folder

### PLAN.md (written before any execution)
- Frontmatter with `status:`, one of `planning`, `in-progress`, `awaiting-walkthrough-review`, `quiz-ready`, `done`.
- A header listing the repos, branches and PRs involved. Keep it current.
- The plan itself, and these rules stated in the file:
  - Log decisions in DECISIONS.md as they are made.
  - Keep FLOW.md in step with code and process changes.
  - Write WALKTHROUGH.md when the changes are done.
  - Do NOT write or run the quiz until the user says they are ready, after reviewing the walkthrough.

### DECISIONS.md
Record every meaningful decision and skip trivial ones. Each entry is dated and has:
- **Chosen:** what was decided.
- **Why:** with an evidence label: `[you]` (the user instructed it), `[read]` (from reading code or docs), `[spike]` (tested it), `[judgement]` (Claude's call).
- **Rejected:** the alternatives, and why not.
- **Cost:** what this choice gives up or risks.

### FLOW.md
How the work or system behaves end to end. Update it in the same turn as any code or process change it describes. Before declaring the work done, check FLOW.md against the actual code and fix any drift.

### WALKTHROUGH.md
Write it when the changes are done. It has a plain-language explanation, then a file-by-file review guide so the user can review the change. Then set PLAN.md `status: awaiting-walkthrough-review`.

### Quiz (no standing file)
- Do not write a quiz ahead of time, and keep no QUIZ file.
- After the walkthrough, ask once: "Are you ready to quiz?" Then wait. Do not ask again.
- Only after the user says they have reviewed and are ready: set `status: quiz-ready`, write the quiz from the final state of the files and code, then run it.
- Make every answer option in a question the same length, so length gives nothing away.

### HANDOFF.md (optional)
For resuming in a new session. Say where things stand, what is next, and which files to read first.

## Rules

- Never commit, stage, or copy these work folders into any git repository. They are notes, not code.
- Update DECISIONS.md and FLOW.md in the same turn as the change they describe.
- A new session must search for an existing folder before creating one.
- Keep the suggested base path and area list here. The only state is the base-path config file at `${XDG_CONFIG_HOME:-$HOME/.config}/work-notes/base`. Work folders are found by search, never recorded there. No Claude project memory.
- Never create a work-notes folder unless the user asks. Outside `/work-notes`, offer at most once, in one line.

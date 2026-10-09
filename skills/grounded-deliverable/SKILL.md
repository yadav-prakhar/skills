---
name: grounded-deliverable
description: Quality protocol for any substantial deliverable that makes claims about real code, systems, data or documents (an explainer, report, analysis, review, walkthrough, migration plan, teaching material, design doc), so every claim is traced to a source, contradictions surface as findings, and the artifact is checked the way its reader will experience it. Use for multi-step deliverables where being wrong is costly or the reader will act on the result, especially when asked to "explain", "walk me through", "analyse", "audit", "write up", or "document" something real.
---

# Grounded deliverable

A method, not a format. Whatever you are producing, the reader will trust it and act on it,
so it has to be **grounded** (every claim traces to a source), **fresh** (checked against the
current state, not a stale copy), and **looked at** (verified as the reader will meet it).
Writing it is also the closest reading the material will ever get: the contradictions you
find on the way are part of the deliverable, recorded as **open findings**.

## Steps

### 1. Frame

Name the reader, what they will do with the result, the format and where it goes, and any
standing rules (organisation instructions, user preferences, read-only repos). Ask only the
questions whose answer changes the output; choose defaults for the rest and say which.

*Done when* you can state reader, purpose, format, location and constraints in one sentence
each.

### 2. Gather from primary sources, fresh

- Refresh before reading: `git fetch` repos (`git ls-remote` when you must not write even to
  `.git/`), re-open live pages, re-query data. Record the revision, SHA or timestamp of every
  source.
- Where reading cannot settle a question, run an experiment on a throwaway copy, never the
  original: break one thing, run the real check, record what happened.
- Read primary material in full: the code, the diff, the config, the pipeline definition, the
  raw data. Summaries, READMEs, PR descriptions, tickets, bot reviews and your own earlier notes
  are **leads**: worth reading, never enough to state as fact.
- Pull large material through the cheapest faithful channel: a local `git diff` beats a web
  API that returns a 90 KB blob; `grep`/`sed -n` beats reading a whole file twice.

*Done when* every artifact the deliverable will describe has been read at a recorded revision.

### 3. Keep a ledger

In a scratch file, one row per claim you intend to make: claim → source (`path:line`, SHA,
URL, query) → status: **verified** (you read or ran it), **reported** (someone says so),
**inferred** (your reasoning), **unverified**. Only verified claims are written as plain facts;
the others carry their status in the text ("the PR description says", "I read this, I did not
run it").

*Done when* every factual sentence in your draft maps to a ledger row.

### 4. Cross-examine the sources

Work through [references/verification-playbook.md](references/verification-playbook.md). In
short: check each lead against the code; trace every hard-coded identifier, flag and path to
where it is defined or read; compare dates (what landed after the branch point, which
artifacts are older than what they verify); follow conditional and feature-gated paths; look
up library behaviour in official docs. Each mismatch becomes an **open finding**: what,
evidence, consequence, confidence.

*Done when* every playbook item that applies has been run, and each mismatch is a finding with
evidence.

### 5. Build the artifact durably

Write to files early and in pieces (one section or chapter per write), so progress survives
interruptions and a fix is a small edit. Explain in layers when the reader is learning: the
simple picture first, then the real terms, then the real evidence. Keep specifics honest:
every number, size, duration, count and name, in prose **and in diagrams**, comes from a
ledger row or is left out.

*Done when* the artifact exists on disk, complete, with no placeholder text.

### 6. Look at it as the reader will

Render documents and look at the pages. Open images before captioning them. Run interactive
pieces headless and read what they display after you interact, not only whether they throw.
Run the commands you tell the reader to run, when it is safe to. Check edge cases your own
demo could hit (random choices that repeat, text that wraps, empty states, phone widths).

*Done when* you have seen every figure, page type and interactive state with your own tools,
and fixed what you saw.

### 7. Review and re-verify

Get an independent pass: a reviewer subagent or advisor that sees the files, not your summary.
Then refresh the sources again. If anything moved, re-run the checks behind every finding and
every "clean", "not wired" or "unchanged" claim. Stamp the revisions you verified against into
the deliverable.

*Done when* review points are fixed or answered and every finding holds at the latest refs.

### 8. Report

Short and scannable: what you made and where, how to use it, what you deliberately skipped
and why, the open findings that matter for the reader's own work (one line each, worst first),
and what remains unverified. Follow the user's and organisation's length and format rules.

## Leading words

- **Grounded**: traced to a source you read.
- **Fresh**: checked against the current state, with the revision recorded.
- **Lead**: a secondary claim (doc, comment, description, note, bot) to be checked, not repeated.
- **Open finding**: a verified mismatch or risk, with evidence, consequence and confidence.
- **Looked at**: seen rendered or run with your own tools, not assumed from a clean build.

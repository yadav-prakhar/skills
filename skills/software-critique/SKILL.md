---
name: software-critique
description: Use when asked to review/critique a product or codebase.
---

# Software Critique

Critique real software the way a panel of staff engineer + PM + UX lead would. Non-negotiable rules:

1. **Evidence before judgment.** Read the source, run the tool, exercise the flows. A finding without `file:line`, command output, or a reproduced interaction is an opinion — label it or drop it.
2. **Verdict up front.** Open the report with a one-paragraph grade and one-line summary. Never bury it.
3. **Critique the system, not the author.** Judge decisions against the constraints the team likely faced; say when a choice was reasonable.
4. **Severity = user/operational impact**, not aesthetic preference or personal style.
5. **Trace consequences, don't list defects.** Every Critical/High finding must answer "and then what happens?" — the future cost, not the present ugliness (e.g. not "hardcoded secret" but "rotating it requires a coordinated release across N repos and every user's machine"). A finding without a projected consequence is a lint warning.
6. **End with the compression.** Close the report with one sentence that carries its whole shape: strength acknowledged + systemic cost named + root cause indicted. A review that can't survive as one sentence is a filing cabinet, not an argument.

## Workflow

1. **Frame** — from the request, decide: what is this artifact *for* (job-to-be-done)? Who uses it? What does the requester want out of the review (adopt/rebuild/fix/hire-signal)? If ambiguous, one clarify call, max.
2. **Gather evidence** (read-only, batch tool calls):
   - Read all source end-to-end; note sizes and structure.
   - Run it if runnable: happy path, one failure path, `--help`/exit codes.
   - Check the ecosystem: deps, releases, docs, tests, CI, duplicates of the same logic.
   - Prefer multiple medium tool batches over one giant call; append extractions to workspace files if large.
3. **Apply the lenses** (see references/lenses.md for per-lens checklists):
   - **Product** — does it deliver the outcome, not the capability? Time-to-value, lifetime verbs (doctor/status/repair), onboarding, failure-to-support ratio.
   - **Architecture** — boundaries, duplication, coupling, one-implementation-per-behavior, blast radius of change, release engineering.
   - **Engineering quality** — correctness, error handling, data-loss paths, atomicity, secrets, dead code, tests, exit codes, composability.
   - **UX** — expectation-setting, defaults that steer honestly, silent behavior, what the user's *last* experience is (final output often the worst screen), error evidence shown to users.
   - **Consistency & operations** — drift between parallel implementations, config/state handling, upgrade/uninstall story, documentation truthfulness.
4. **Synthesize** — rank by severity (below). Separate systemic patterns (appear 3+ places → process/architecture root cause) from one-offs. List what's working — redesigns that ignore strengths cause regressions.
5. **Report** in the format below. End with a prioritized fix plan (Now / Next / Later) and offer the cheapest highest-leverage first move.

## Severity scale

- **Critical** — data loss, security hole, secret exposure, silent corruption, or the tool's core promise broken.
- **High** — will bite real users soon; support-ticket generator; structural debt compounding at release cadence.
- **Medium** — friction, inconsistency, amnesia (re-asking for info the tool owns), missing feedback loops.
- **Low** — polish, dead code, style, exit codes, naming.

## Report format

```
# Verdict (grade + one-line summary)
## 1. Critical (should never have shipped)
## 2. Engineering  (findings w/ file:line evidence)
## 3. Product & management
## 4. UX
## 5. What's working (keep these)
## How it should have been built (target design, not a rewrite fantasy)
## Fix plan: Now / Next / Later
## The compression (one closing sentence: strength + systemic cost + root cause)
```

Calibrate length to the ask: a one-line question gets a one-line answer; a full review earns the full report.

## Anti-patterns

- Aesthetic or style opinions dressed as findings.
- Critiquing code you never read or a flow you never ran.
- "Rewrite it in X" as the conclusion — target designs must be reachable from where the code is.
- Listing flaws without a prioritized, effort-aware fix path.
- Defect lists that never project forward ("and then what happens?") — present-tense ugliness without a future cost is a lint warning, not a finding.
- Reports with no closing one-liner — if it can't be compressed to one sentence, the argument isn't formed yet.
- Omitting strengths — a critique with no 'what's working' is not credible.

## Deeper checklists
Per-lens detailed checklists and the evidence-gathering playbook: see [references/lenses.md](references/lenses.md).

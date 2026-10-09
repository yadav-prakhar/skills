---
name: study-book
description: Build a printable A4 self-study book (PDF) plus an interactive HTML companion that teaches a learner from zero, grounded in real repositories, pull requests, documents or systems. Use when someone asks to be taught or walked through a codebase, PR, change, tool or technology with printable explainers, lessons, a workbook, quizzes, "a book I can print and annotate", or study material they can learn from on paper, even when they do not say "book".
---

# Study book

Produce three things in one output folder: `book.pdf` (A4, printable), `book.html` (same book,
for screens), and `companion.html` (interactive diagrams and a self-marking quiz). The book
teaches a reader who knows nothing about the area, from foundations to a file-by-file
walkthrough of the real material, and every claim in it is checked against a source.

Two qualities make this work, and they are worth more than length or polish:

- **Grounded**: every fact traces to a file, commit, document or official doc page; anything
  you could not verify says so. Reading closely while writing surfaces real problems in the
  material: record them as **open findings**. They are often the most valuable pages.
- **Looked at**: you render the pages and the companion and look at them before you call
  them done. A build that succeeds can still print overlapping labels or a demo that shows
  nothing.

If `grounded-deliverable` is installed, its evidence rules apply to every step here.

## Steps

### 1. Frame the brief

Pin down: the reader and what they already know (default: nothing), the material to teach
(repos, PRs, folders, docs), the output folder, the paper size (default A4), and any
organisation rules (for example "keep artifacts local"). Ask the user only about things that
would change the output; take sensible defaults for the rest and state them.

*Done when* you can name the reader, the material list, the output folder, and the parts of
the book.

### 2. Gather evidence into a ledger

- **Refresh first**: `git fetch` every repo you will cite (for a repo you must not write to,
  even `.git/`, use `git ls-remote origin <branch>` and compare with `git rev-parse`). Read PR
  diffs from a local `git diff base...head` rather than a web API when they are large. Record
  the SHA of every ref you read.
- **Run experiments where reading is not enough**: on a throwaway copy (`git archive HEAD |
  tar -x -C /tmp/lab`), never the original, break one thing at a time and run the real check.
  For a test suite, a small mutation table ("edit X → which tests go red?") produces findings
  no reading will, and makes excellent "predict" exercises.
- Read every changed file in full, the PR descriptions, every review comment, and the
  reader's own notes in the workspace (notes often contain the history and the reasons).
- Read the code around the change that the change depends on: config, page objects, the
  scripts the CI runs, the pipeline definitions.
- Keep a **ledger** (scratch file): claim → source (`path:line`, SHA, URL) → status
  (verified / reported / unverified). Add a row whenever a doc, comment or PR description
  says something; check it against the code before it enters the book.

*Done when* every file the walkthrough chapters will show has been read in full, and every
ref has a recorded SHA.

### 3. Outline

Follow [references/chapter-anatomy.md](references/chapter-anatomy.md): foundations chosen from
what the walkthrough needs, then the subject from general to specific, then the walkthrough,
then answers and reference. Write the chapter list with one line each.

*Done when* every concept used in the walkthrough chapters is taught in an earlier chapter or
at first use, and the outline fits the page budget (see "Page budget" in the anatomy file;
use `--compact` for books under ~20 pages).

### 4. Check external facts

For each framework, library or platform behaviour the book will state as fact, look it up in
official docs (a docs tool such as context7, or the vendor site) and quote the line you rely on
in your ledger. Behaviour of waits, retries, workers, defaults and edge cases is where memory is
most often wrong.

*Done when* every external-behaviour claim in the outline has a doc citation in the ledger.

### 5. Write the chapters as fragments

Create a source folder (scratch space is fine) with one file per chapter, named `NN-name.html`
in reading order (`01-front.html`, `10-ch01.html`, …). Copy the patterns from
[assets/chapter-example.html](assets/chapter-example.html). Follow the chapter rhythm: ELI5
box → real concept → real code with paths → watch-out / key / finding boxes → Check yourself.
Write figures and screenshots per [references/print-and-figures.md](references/print-and-figures.md).
Write the answer key as you finish each chapter.

Large chapters: write one fragment per tool call; never hold the whole book in one file.

*Done when* every chapter in the outline exists as a fragment, ends with exercises, and has its
answers in the answer-key fragment.

### 6. Build and look

```bash
node scripts/build_book.mjs --src <fragments> --out <output folder> --title "<Title>" \
  --resolve-from <a project with playwright installed>
python3 scripts/render_pages.py <out>/book.pdf --out <qa folder> --figures \
  --find "Contents" --section <answer-key data-id> --section <cheat-sheet data-id>
```

The build does two passes for real page numbers in the contents and fails on broken images.
Open the rendered PNGs and fix what you see: overlapping labels, wrapped code, a chapter
missing from the contents, near-empty pages. Rebuild after each round.

*Done when* the build exits 0 and you have looked at every figure page, the contents, one code
page, one exercise page and the cheat sheet.

### 7. Build the companion

Follow [references/companion.md](references/companion.md): copy
[assets/companion-starter.html](assets/companion-starter.html), fill its `PANELS` data from the
chapters, then:

```bash
node scripts/test_companion.mjs --file <out>/companion.html --out <qa folder> \
  --click "<selector>" --repeat 3 --resolve-from <playwright project>
```

*Done when* the test passes and you have read what each panel says after interaction.

### 8. Re-verify and review

Re-fetch the repos (or `git ls-remote` for read-only ones). If any ref moved, re-run the checks behind each open finding and every
"merges cleanly" or "not wired" claim, and fix what changed. Put the verified SHAs on the cover.
Then get an independent review (a reviewer subagent or advisor) of the finished files before
you report.

*Done when* every open finding has been checked against the latest refs and the review's
points are fixed or answered.

### 9. Report

Reply briefly: where the files are, how to print (A4 at 100% / "Actual size", not "fit to
page"), which pages hold the answer key, what you deliberately left out and why, and the open
findings that matter for the reader's own work, one line each.

## Scripts and assets

Paths are relative to this skill's folder. Call the scripts by absolute path, and copy assets
into your own folders rather than editing them in place.

| File | Purpose |
|---|---|
| `scripts/build_book.mjs` | fragments → `book.html` → `book.pdf`, two-pass page numbers, broken-image check |
| `scripts/locate_pages.py` | finds each chapter's page via invisible `@@id@@` markers (needs PyMuPDF) |
| `scripts/render_pages.py` | renders chosen pages to PNG for visual QA; reports near-empty pages |
| `scripts/test_companion.mjs` | headless smoke test: errors, clicks, phone-width overflow, screenshots |
| `assets/head.html` | the print stylesheet and component styles |
| `assets/chapter-example.html` | every book component, ready to copy |
| `assets/companion-starter.html` | data-driven companion: stepper, simulator, DAG, quiz |

Dependencies: Node 18+, Playwright with Chromium (`--resolve-from` any project that has it, or
`npm i playwright && npx playwright install chromium` in a scratch folder), Python 3 with
`pymupdf` for page numbers and QA renders.

# Chapter anatomy

How the book is shaped, chapter by chapter. Read before writing the outline; re-read the
"Exercises" section before writing each chapter's questions.

## Book skeleton

1. **Cover**: title, one-line promise, who it is for, the sources with commit SHAs or dates.
2. **How to use this book**: the chapter rhythm, the box vocabulary, a reading plan by session,
   the companion file, then the contents (`<!--TOC-->`).
3. **Part I · Foundations**: everything the reader lacks to follow Part II onward. See
   "Choosing foundations".
4. **Middle parts**: the subject itself, general to specific. Usually: the tool or framework →
   how this team uses it → the system it runs in.
5. **Walkthrough part**: the specific changes, PRs or documents the reader asked about,
   one chapter each, file by file.
6. **Answers and reference**: answer key on its own pages, a one-page cheat sheet, a glossary,
   a page of note lines.

Number chapters continuously across parts (1…N). Give every figure a number `Figure <chapter>.<n>`
and refer to figures and sections by number in the text ("see 9.4"), because a printed page
cannot be searched.

## Page budget

Real costs on A4 with the default stylesheet, so you can size the outline to the brief:

| Item | Pages |
|---|---|
| cover, how-to-use + contents | 2 |
| part divider | 1 each (skip parts in books under ~20 pages) |
| a chapter (lede, ELI5, 2–3 sections, one figure, 6 questions) | 2–3; every chapter starts a new page |
| an exercise block of 6 questions with ruled lines | about ½ |
| answer key | 1 per 4–5 chapters |
| cheat sheet, glossary | 1 each |

For a short book (under ~20 pages), build with `--compact`: chapters flow on from the previous
page and exercises are set tighter. Prefer fewer chapters over thinner ones.

## Choosing foundations

List every concept the walkthrough chapters use. Cross off what the reader already knows (ask
only if the brief does not say; "assume I know nothing" means cross off nothing). Every remaining
concept gets taught in Part I or at first use. Teach only as deep as the walkthrough needs: e.g.
"just enough JavaScript to read this code" taught through lines copied from the real files, not a
general language course.

Typical foundation chapters for a code topic: the big picture (actors and one diagram) · how the
platform renders (web pages, DOM, components) · just enough of the language · the toolbox
(terminal, package manager, scripts, env vars, git, repo layout) · the domain platform (data
model, APIs, what reacts to writes).

## The chapter rhythm

Every chapter, in this order:

1. **Kicker + title + lede**: what question the chapter answers.
2. **ELI5 box**: one everyday picture. The reader should be able to retell the chapter from this
   box alone. Map each element of the picture to the real term, in bold.
3. **The real concept**: proper names, definitions at first use, short paragraphs, tables for
   anything with three or more parallel items.
4. **The real code**: excerpts copied from the source with the path underneath (`.src`). Grey
   comments explain each line. Say "(shortened)" when you cut, and mark cuts with `…`.
5. **Watch out / Key idea / Open finding boxes** where they belong. Not decoration: each one
   carries something the reader would otherwise miss.
6. **Check yourself**: 6–10 questions (see below).

## Box vocabulary

| Box | Use for | Never for |
|---|---|---|
| `eli5` (dashed) | the opening picture | details |
| `real` (blue) | "where this lives in the code" | general theory |
| `warn` (thick left rule) | a trap someone hit, an easy misreading | generic advice |
| `key` (heavy border) | one highlightable sentence | paragraphs |
| `finding` (double border) | something wrong or unverified that you found while writing | opinions |

An **open finding** always states: what, evidence (`file:line`, commit, doc quote), consequence,
and confidence ("read in the code, not run"). Findings are often the most valuable pages in the
book. Collect them in your ledger as you go and list the top ones in your final reply.

## Voice

- Plain human language, second person, short sentences. The reader is smart but new.
- Define a term the first time it appears; after that use it exactly the same way every time.
- Explain why before how: why the code waits, why the mask moved, why the order matters.
- Quote the code's own comments when they explain a decision; they are evidence and usually
  better phrased than a paraphrase.
- Be honest about evidence: "the PR description says", "I read this in the code", "I did not run
  this". The reader will act on what they print.

## Exercises

Mix four kinds in every chapter:

- **Fill in the blank**: `<span class="blank"></span>` (`.s` short, `.l` long). For names,
  numbers, paths.
- **Multiple choice**: `<ul class="opts">`, four plausible options; the wrong ones should be
  real misconceptions, not jokes.
- **Predict the outcome**: "someone changes X; what happens, and why?" The most valuable kind:
  it tests the mental model, not recall. Use real failure modes from the material.
- **Explain in your own words** with ruled lines (`<div class="lines"><span></span>…</div>`).

Answer key rules: one answer per question, same numbering, on separate pages at the back so the
reader cannot see them by accident. For open questions, bold the idea that must appear ("any
answer containing **X** is right"). Write the answers while the chapter is fresh, then re-check
each one against the chapter text. An answer the chapter never taught is a bug in the chapter.

# The interactive companion

A single self-contained HTML file next to the book. It does what paper cannot: lets the reader
change an input and watch the consequence. Build it after the book's chapters exist, from the
chapters' own diagrams and "predict" questions.

## Choose 4–8 panels

Pick the ideas where *interaction* teaches something a static figure cannot:

| Idea in the book | Panel type in `assets/companion-starter.html` |
|---|---|
| a lifecycle or decision tree ("what happens when X and Y?") | `sim`: inputs → lit path → verdict |
| a pipeline, request flow, or DAG | `dag`: next-node stepper with an explanation per node |
| an ordered procedure (seed → test → clean up; crash and recover) | `stepper` |
| a threshold or formula (limits, ratios, sizes) | `sim` with a select or number input |
| recall across chapters | `quiz`: 10–15 questions with explanations |

Skip panels that would only animate a static diagram. One genuinely surprising consequence per
panel ("a missing baseline PASSES") is the goal.

## Building it

1. Copy `assets/companion-starter.html` to `out/companion.html`, replace `{{TITLE}}`.
2. Fill only the `PANELS` data block. Each `sim.decide(values)` returns
   `{ on: [pathIds], bad: [pathIds], verdict, tone }`. Encode the *real* rule from the code you
   read, and cite the chapter in the panel's `chapter` field.
3. Write a custom widget only when no panel type fits (for example a mask whose width follows
   text). Keep it in the same file, using the same CSS tokens.

## Make demos honest

- **Deterministic beats random.** A "random" example can repeat and show nothing. Cycle through
  a fixed list of cases chosen so each step differs.
- **Measure the right quantity.** If the lesson is "the changed area", compute the area
  difference, not just the width. Text that wraps changes height instead.
- **Keep the model the same as the book.** Numbers, names and outcomes in the companion must
  match the chapter word for word; it is a second view of the same truth, not a new claim.
- No network, no external libraries, no credentials. Light and dark themes come from the
  starter's tokens; keep `localStorage` to per-viewer preferences, inside `try/catch`.

## Test it

```bash
node scripts/test_companion.mjs --file out/companion.html --out qa/ \
  --click "#flow button.primary" --repeat 3 --resolve-from <dir with playwright>
```

It fails on page errors, console errors, failed requests and phone-width overflow, and saves
desktop and phone screenshots. `--repeat` applies to every `--click`; quiz options disable
themselves after one click, so run quiz clicks in a separate invocation without `--repeat`.
`--select 'css=value'` sets a dropdown (for `sim` panels). The script prints each section's
visible text afterwards; read it. Then **read the text each panel shows after interaction**
(open the screenshots, or evaluate `textContent` in a small Playwright script). A panel can run
cleanly and still teach nothing.

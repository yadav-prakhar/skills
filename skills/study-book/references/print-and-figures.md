# Print and figures

Rules for pages that will be printed on A4 and marked up with a pen. The stylesheet
(`assets/head.html`) already implements the page rules; this file is for what you author.

## Page rules (already in head.html: do not undo them)

- A4, margins 17/30/18/18 mm: the wide right margin is for handwritten notes.
- White page, black ink, one accent blue that still reads in greyscale. Boxes are bordered,
  never filled. No background decoration, no dark mode in print.
- Code: 8.3 pt, `white-space: pre-wrap` so long lines wrap instead of running off the page.
- `figure`, `table`, `.box`, `.ex`, `pre.keep` avoid breaking across pages.
- Each `.chapter` and `.part` starts on a new page.

## Code blocks

- Keep lines under about 95 characters in the full-width column, about 45 in a two-column
  cheat sheet. Long trailing comments wrap into ugly half-lines: shorten the comment or put it
  on its own line.
- Use `pre.keep` for blocks under ~25 lines (never split); plain `pre` for long ones.
- Highlight with spans: `.k` keyword, `.c` comment, `.add` / `.del` diff lines, `.hl` focus line.
  Escape `<`, `>`, `&` inside code.

## Diagrams (inline SVG)

- `viewBox="0 0 640 H"` maps to the 162 mm text column; `font-size` 10–11 ≈ 8 pt print.
  Use `font-family="Helvetica, Arial, sans-serif"`.
- Black strokes, one accent (`#1d4f9a`) for the focus, red (`#8a1010`) only for failure paths.
  `fill="none"` on boxes.
- Give each SVG's arrow `<marker>` a unique id per figure (`arr-ch3`, `arr-ch7`): duplicate ids
  across one HTML document make later figures pick up the wrong marker.
- Budget text width at ~6 units per character at font-size 10.5; size boxes from their longest
  label, not by eye.
- Route arrows around text. Place annotations where no line crosses them; long diagonal edges
  are the usual offender.
- **Every number, size, duration and label in a figure must come from a source.** Diagrams are
  where invented specifics sneak in ("10–20 min", "396 × 180", "× 7"). If you don't know, say
  "one per widget" or "often 0 × 0", or leave it out.
- After every build, render the figure pages and look at them (`render_pages.py --figures`).
  Overlaps and clipped labels are invisible in source and obvious in a 72-dpi PNG.

## Screenshots and real images

- Prefer real artefacts (saved baselines, captured screens, exported charts) over mock-ups.
  Copy them into `out/img/` with descriptive names (`tartan-canvas-window.png`), not hashes.
- **Look at every image before writing its caption** (open it with your image-reading tool).
  Captions describe what is actually visible and what to notice. "Before" and "after" pairs
  teach better than single images.
- Remove copies you end up not using; the build reports broken images, not unused ones.
- Leave out anything sensitive: credentials, `.env` values, personal data in screenshots.

## QA viewing checklist (after each full build)

Render and look at, at minimum:

1. the contents page (all chapters listed, numbers filled in),
2. every page with a figure,
3. one code-heavy page,
4. one exercise page and one answer-key page,
5. the cheat sheet (narrow columns wrap code badly),
6. any page the build reports as near-empty (stray page break).

Fix, rebuild, look again. A book is done when you have looked, not when it has built.

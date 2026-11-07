---
name: daily-prakhar
description: Use when building an issue of The Daily Prakhar.
version: 1.1.0
author: Prakhar Yadav, Hermes Agent
license: MIT
platforms: [macos]
prerequisites:
  commands: [pdfinfo, pdftoppm, ffprobe, python3]
metadata:
  hermes:
    tags: [Newspaper, Daily-Prakhar, PDF, TTS, Tech, Learning, Events]
    related_skills: [personal-newspaper, daily-shivani]
---

# The Daily Prakhar

Profile skill for Prakhar's own paper: tech, engineering, ServiceNow, open source, India, Dehradun — plus a standing Notebook page for one concept, three tools and the fortnight's events.

Rendering, pagination and TTS **mechanics** live in `personal-newspaper` (shared engine) — load it alongside this skill: base CSS, `scripts/page_fill.py`, the notch method, edge-tts pitfalls. This skill holds only what is specific to *this* paper. Do not apply these decisions to The Daily Shivani (`daily-shivani`); the papers share an engine, not a profile.

## When to Use

- A scheduled or requested issue of The Daily Prakhar.
- "Make today's Daily Prakhar", "regenerate the Prakhar paper", "new Prakhar briefing".
- Editing an existing Prakhar issue (re-paginate, re-voice, add a late story).

Not for: The Daily Shivani (`daily-shivani`), a one-off paper for someone else (`personal-newspaper`), or a single-topic tech question (`web_search`).

## Fixed profile

| item | value |
|---|---|
| Masthead | `The Daily Prakhar` |
| Tagline | `Your Personal Newspaper — Tech · AI · Engineering · India · Dehradun` |
| Edition line | `Dehradun Edition` |
| Issue line | `Vol. 1, No. N` |
| Folder | `~/Daily-Prakhar/YYYY-MM-DD/` |
| Pages | exactly 5, A4 — four news pages + p5 The Notebook |
| Voice | `en-IN-PrabhatNeural` |
| Footer | `The Daily Prakhar · Vol. 1, No. N · <date> · Sources: <outlets>` |

Files: `The-Daily-Prakhar-YYYY-MM-DD.pdf`, `The-Daily-Prakhar-YYYY-MM-DD.html` (render source, written but not sent unless asked), `The-Daily-Prakhar-Briefing-YYYY-MM-DD.mp3`, `briefing-script.txt`.

## Issue number

Read the newest issue's masthead `Vol. 1, No. N` and add one. **Never count dated folders**: on 2026-10-28 five folders held issues 1, 3, 4, 5 and 6 — issues get skipped and the count drifts low.

## Page plan (5 pages)

- **p1 — AI & Technology** (front page): bordered lead, 200–250 words, then ~10 items in `grid-2`.
- **p2 — Engineering, SDLC & ServiceNow**, then a second header **ServiceNow** (the reader's platform: earnings, product, ecosystem).
- **p3 — Open Source**, then **Tech Briefing** (`grid-3 compact`, one-line-ish stubs).
- **p4 — India**, then **Dehradun & Uttarakhand** local desk.
- **p5 — The Notebook**: **Concept of the Day** in a bordered box (420–470 words in practice, four labelled beats), **Tools to Try** (`grid-3`, three 45–60-word picks), **Events — Dehradun & Delhi NCR** (list, 5–9 entries, next 14 days). Feature page, not a news page: it targets 90–95% and is never padded past that.

Starting notches from the last measured four-page issue (ten-item front page, five-item Open Source grid, nine-stub briefing, six-item local grid) — first guess, re-tune per issue: `.p1 p 7.5pt/1.25`, `.p1 h2 9.0pt`, `.p1 .lead-story p 8.3pt/1.32`, `.p1 .grid-2 gap 3px`, `.p2 p 7.75pt/1.30`, `.p3 p 7.35pt/1.25`, `.p3 .compact p 7.0pt/1.24`, `.p4 p 7.4pt/1.26`, `.p4 .local p 7.0pt/1.2`, plus `.p3 .footer { margin-top:2px; padding-top:2px; font-size:6pt; border-top:1.5px solid #000 }`. That set landed 99 / 97 / 100 / 98 per cent of page height. p2 tops out there: 7.9pt pushed its footer onto its own sheet. p3, carrying six `grid-2` articles plus nine stubs, is the page that needs the footer override.

p5 starts at `.p5 p 7.6pt/1.28`, `.p5 h2 9.5pt`, `.p5 .concept p 8.6pt/1.36`, `.p5 .concept h2 14pt`, `.p5 .tool p 7.2pt/1.26`, `.p5 .events p 7.4pt/1.3`, `.p5 .section-header margin:5px 0 4px`. Measured on a prototype carrying the page's real furniture — section header and footer, **no masthead** (p2–p5 do not repeat it) — 334 concept words, three 50-word tools and six events ended at 76.0% ink; 420 words and eight events ended at 88.5%, nothing clipped at either size. A full Notebook is 420–470 words and eight or nine events, which lands 89–95%. Below ~78%, raise the concept a notch or add an event; never a fourth tool.

A `grid-2` row of 6–7-line articles costs ~33 mm (12% of the sheet); a `grid-3 compact` row ~19 mm. A front page carrying ten items needs the 7.5pt notch — at 7.7pt the tenth cell splits three lines onto a second sheet. Once a page's source list plus the ~66-character fixed prefix passes about 150 characters it wraps to a second line that lands nearest the trim edge — long outlet names wrap a list of only thirteen — so shorten the outlet list rather than shrinking or dropping the footer, and settle every footer before the final notch pass.

## Content taste

- Lead with the money or structure story of the day — who is financing whom — not the loudest product launch.
- Prefer primary sources: company newsrooms, SEC filings, model cards, arXiv and benchmark papers. Cut press-release superlatives.
- AI earns space when it touches money, work or research funding; otherwise it is filler.
- ServiceNow always gets its own header, because that is the reader's working platform.
- Dehradun/Uttarakhand must be real state or city reporting (budgets, assembly, civic decisions). If nothing real happened, drop the desk rather than pad it.
- Every item prints `Outlet · Outlet · Mon DD, YYYY`. No source, no item.
- The Notebook is the reader's own desk, not a news desk: nothing on p5 may depend on today's headlines. A concept that only makes sense this week is a news item — put it on p1.
- One concept, three tools, one fortnight of events. The slots are fixed because the page is a habit: the same three tool positions every issue. Do not add a fourth tool or a tenth event to fill space.
- The concept must be checkable against the document it cites. If the source and the hook disagree, the source wins and `references/concepts.md` gets corrected in the same run.
- Events are the one block that may print short. `Nothing confirmed in the next fortnight` is a valid entry; a padded listing is not.

## Audio

`en-IN-PrabhatNeural` only. Measured pace 126–135 wpm; figure-dense copy runs at the fast end, so re-measure per script instead of assuming the slow end. Budgets: 5–6 min ≈ 700–780 words; 8–9 min ≈ 1,050–1,100 words. **Count before voicing:** `wc -w briefing-script.txt`; 1,200–1,270 words lands 9:00–9:35 at the measured 132 wpm, so a nine-minute briefing starts at ~1,200, not at the end of the first draft. A script dictated straight from the finished pages runs ~1,500 words, and sentence-level trimming moves only ~90 words per pass — cut whole items, one per section, instead of shaving adjectives twice. Open with the greeting for the run's actual time of day. Narrate each section's lead, add the one number that carries the story, never read the paper aloud. Close on the local desk or tomorrow's calendar.

The Notebook gets a fixed ~90 words near the end, and those words come out of the news budget — drop one news item rather than run long. Two sentences for the concept (name it, then the number that makes it concrete), one line naming all three tools, one line for the nearest event and its date. Do not read the concept's `Check:` question aloud; it is a page device, not a listening one.

## Run order

1. Load this skill and `personal-newspaper`.
2. Fix the issue number; **dedupe against headlines, not keywords** — `grep -h -o '<h2>[^<]*</h2>' */The-Daily-Prakhar-*.html | sort -u` lists every headline the paper has printed, and matching today's candidate against that list is the reliable check. A bare `grep -l <keyword>` fails both ways: three-letter names false-positive on unrelated words (METR inside "metric"), and a story that ran two issues back returns with a new wrapper — same model or deal, new angle — so the keyword is present while the headline reads as new. Digest pages recycle two-to-four-week-old items as today's news, so a story that ran three issues back is the one most likely to ship twice. A developing story may rerun only when today's item carries a new event, and then the headline is about that event.
3. `web_search` per news section (`limit: 12`). Lead with the day's digest pages (The Hindu Morning Digest, HT Morning Brief, TechCrunch, CNBC) — one fetch yields a section. Extract only where a number, quote or sequence must be exact.
4. Notebook inputs, before writing HTML:
   - **Concept** — `python3 scripts/next_concept.py --mark` picks the next id, prints its hook and appends it to `~/Daily-Prakhar/concepts-covered.txt`. Then fetch the cited source and write the 420–470-word box from it; never write from the hook alone.
   - **Tools** — `python3 scripts/fetch_tools.py --days 7 --min-points 30`. Pick three that pass the checklist in `references/notebook-sources.md`; check the last 90 days of issues for the name.
   - **Events** — `python3 scripts/fetch_events.py --days 14`. Then one search for the Dehradun listings the feeds miss (`DISTF`, `eChai Dehradun`, `CNCG Dehradun`, `Doon Tech`). Open each candidate listing and confirm the date.
5. Write the HTML from the newest issue's `<style>` block and page skeleton, append `assets/notebook.css`, then retune `.pN` notches for the new copy. Five page groups: four news, then `.p5` for the Notebook. Insert `<div class="page-break"></div>` after p4's footer, then paste `assets/notebook-page.html` and fill its placeholders — it deliberately carries no masthead, and the last page group ends at its footer with no trailing break.
6. Render with headless Chrome; check `pdfinfo` then `page_fill.py`, and fix the specific page group that is off.
7. Script first, then TTS, then `ffprobe` — confirm the asked-for length.
8. Deliver the PDF and the MP3 as `MEDIA:` lines.

## Pitfalls

- 88–91% fill plus one `grid-2` row becomes an extra page. 95–97% is done.
- A CSS grid row is as tall as its taller cell: trimming one article of a pair changes nothing.
- Each page group starts its own sheet, so a spill sheet headed with the last section is *that* section overflowing, not page 1.
- `vision_analyze` is not a fill meter; use it once at the end for clipping only, on the bottom band.
- Deliver the MP3 as an audio file, not a voice bubble, unless asked.
- `page_fill.py` cleans up after itself; if you render `pdftoppm` crops for the clipping check, delete the `page-*.png` files before finishing.
- p5 is not a news page: a fill below ~78% is a design problem, not a failure. Raise the concept's type one notch before adding a fourth tool.
- If only two tools pass the checklist, run the strip as `grid-2` with two longer picks. Never print a weak third tool to square the grid.
- The concept's `Check:` answer must actually answer the question, and the answer line must carry the right number. A mismatch is worse than no question.
- A tools or events item that cannot be verified is dropped silently, not hedged. "Reportedly" has no place in a listings strip.
- The event window moves every day. Re-run `fetch_events.py` on the morning of the issue; never reuse yesterday's listing because it is already in the HTML.
- An event fifteen days out is outside a fourteen-day window. Print the forward pointer under the empty Dehradun head instead of stretching the window to reach it.
- A name that already ran is not automatically a repeat: two companies can share one across a week. Check the entity, and when today's story is a different one, make that plain in the headline (which company, what it bought or shipped) so the page does not read as yesterday's item reprinted.

Per-section briefs and worked examples: `references/sections.md`. Concept spine and source library: `references/concepts.md`. Verified event/tool endpoints, the working scripts, and the sources that do not work: `references/notebook-sources.md`. p5 stylesheet: `assets/notebook.css`. Scripts: `scripts/next_concept.py`, `scripts/fetch_tools.py`, `scripts/fetch_events.py`.

---
name: daily-shivani
description: Use when building an issue of The Daily Shivani.
version: 1.0.0
author: Prakhar Yadav, Hermes Agent
license: MIT
platforms: [macos]
prerequisites:
  commands: [pdfinfo, pdftoppm, ffprobe, python3]
metadata:
  hermes:
    tags: [Newspaper, Daily-Shivani, PDF, TTS, Careers, Exams]
    related_skills: [personal-newspaper, daily-prakhar]
---

# The Daily Shivani

Profile skill for Shivani's paper: exam careers, graduate science, Uttar Pradesh, India, world.

Rendering, pagination and TTS **mechanics** live in `personal-newspaper` (shared engine) — load it alongside this skill. This skill holds the profile: masthead, reader, section plan, official-domain sourcing rules, page budget. Do not reuse The Daily Prakhar's decisions (`daily-prakhar`); the papers share an engine, not a profile.

## When to Use

- A scheduled or requested issue of The Daily Shivani.
- "Make today's Daily Shivani", "new Shivani issue", "careers paper for Shivani".
- Editing an existing Shivani issue (re-paginate, re-voice, refresh a deadline that moved).

Not for: The Daily Prakhar (`daily-prakhar`), a one-off paper for someone else (`personal-newspaper`), or a single exam-date question (fetch the official domain directly).

## Reader

B.Sc. Zoology, Botany, Chemistry; M.Sc. Chemistry; B.Ed. Inclined towards botany. Targets CSIR/UGC-NET JRF, Assistant Professor, school teacher (CTET/state TET), open to other government jobs. Also preparing for civil services, so India, UP and world affairs all matter.

Level: graduate science, not a specialist. **Define any technical term in ≤ 8 words on first use. No unexplained acronyms.** Write for someone who will read the Careers desk first.

## Fixed profile

| item | value |
|---|---|
| Masthead | `The Daily Shivani` |
| Tagline | `Your Personal Newspaper — Careers · Science · UP · India · World` |
| Edition line | `Uttar Pradesh Edition` |
| Issue line | `Vol. 1, No. N` (No. 1 = 2026-10-28) |
| Folder | `~/Daily-Shivani/YYYY-MM-DD/` |
| Pages | exactly 4, A4 |
| Voice | `en-IN-PrabhatNeural` |
| Footer | `The Daily Shivani · Vol. 1, No. N · <date> · Sources: <outlets>` |

Files: `The-Daily-Shivani-YYYY-MM-DD.pdf`, `.html` (render source — **write it, never send it**), `The-Daily-Shivani-Briefing-YYYY-MM-DD.mp3`, `briefing-script.txt`. Deliver only the PDF and the MP3.

## Issue number

Read the newest issue's masthead and add one. Never count folders.

## Page plan (4 pages, order is fixed)

1. **Front Page** — India national, 3–4 items, one bordered lead.
2. **Uttar Pradesh Desk** — 3–4 items: state government, UPPSC/UPSSSC/UPESSC, education department, policy that hits students or teachers.
3. **Science & Technology** — 4–5 items: ISRO, CSIR labs, DST, health, environment. AI only when it touches research funding or jobs.
4. **International Affairs** — 3–4 items, each ending with one line on why it matters to India.
5. **Careers & Exams Desk** — 5–7 items. This is the page the reader opens first: CSIR/UGC-NET JRF, UGC/Assistant Professor recruitment, CTET/UPTET and school-teacher vacancies, other government notifications worth applying to.
6. **Botany & Chemistry Notebook** — 3–4 items: new species, plant and ecology research, chemistry/materials papers, ICAR and Botanical Survey of India updates.
7. **Notices in Short** — 6–8 one-liners: deadlines, results, counselling dates, admit cards, corrigenda.

Sheet mapping that measured 95/96/95/95 on 2026-10-28: **p1** Front; **p2** UP + Science; **p3** International + Careers; **p4** Botany + Notices. Keep sections in the numbered order even when two share a sheet.

Starting notches from that issue: `.p1 p 8.95pt/1.39`, `.p1 .lead-story p 9.45pt/1.43` (a 4-item front page runs light, so it is set large); `.p2 p 7.9pt/1.315`; p3 at base 7.8pt; `.p4 p 9.4pt/1.42`, `.p4 .notices 9.0pt/1.48`. The front page and the notebook carry fewer, longer items, so they take larger type — that is how fill is bought without breaking the item counts the sections require.

## Sourcing rules (non-negotiable)

- `web_search` per section, for the day's window. Print `Outlets · Mon DD, YYYY` on every item. No source and date, no item.
- **Careers facts — notification number, vacancy count, last date, eligibility, fee — must come from the official domain fetched that day**: `ugc.gov.in`, `csirhrdg.res.in`, `nta.ac.in`, `ctet.nic.in`, `upessc.up.gov.in`, `uppsc.up.nic.in`, `ssc.gov.in`, `upsc.gov.in`, `upeducation.gov.in`. If it is not confirmed today, print `not announced — check <domain>`.
- **Never invent, infer or round a date, vacancy count or notification number.**
- Science items need a primary source: journal, institute release, or an ISRO/CSIR/DST page. Drop press-release-only superlatives.
- Mark anything unconfirmed inline as `[unconfirmed]` rather than smoothing it over.
- From Issue No. 2 on, grep the newest issue's HTML for every candidate headline and drop repeats. A repeat is worse than a gap.

Domain-by-domain confirmation table, traps and worked fee/eligibility examples: `references/careers-domains.md`.

## Careers desk standard

Each item carries, in this order: notification/advt number → vacancy count → apply window and last date → exam date → eligibility (degree, age) → fee. Name the official URL at the end. If one of those is unknown, say so rather than omitting it silently.

## Local desk

Ask **at most one** question before writing — city or district for a local line — and only if it genuinely cannot be inferred. If the answer is unknown, omit the local desk and run the Uttar Pradesh Desk instead. Ask nothing else.

## Audio

`en-IN-PrabhatNeural` only. Measured on 2026-10-28: 724 words → 356 s (≈122 wpm with numbers and dates spelled out). Budget **700–760 words for 5–6 minutes** and check with `ffprobe`; 773 words ran to 6:09, so 5:50 is the safe target.

Spell numbers and dates for TTS ("twenty-eighth of October", "seventeen thousand seven hundred and thirty-five", "eleven hundred and fifty rupees"). Open with the greeting for the run's actual time of day. Narrate the lead of each section, not the paper verbatim. **Close on the Careers deadlines** — that is the reader's priority.

## Run order

1. Load this skill and `personal-newspaper`.
2. Issue number; dedupe against the newest issue's HTML.
3. Search per section; fetch official domains for every Careers item.
4. Write HTML: masthead → page groups → `page-break` divs, all wrapped in `.p1`…`.p4`.
5. Render, then `pdfinfo` + `page_fill.py`; fix the specific page group that is off.
6. Script → TTS → `ffprobe`.
7. Deliver exactly two `MEDIA:` lines: PDF and MP3.

## Pitfalls

- Official site shapes change: UPESSC lives at `upessc.up.gov.in` (application portal `apply.upessc.org`), not the `.nic.in` guess; `upessc.up.nic.in` is blocked as a private address. Check the portal's “Important Updates” block — it carries apply windows and exam dates.
- Adding 0.15pt of body type can push a sheet into a fifth page: p2 at 8.05pt overflowed by two lines, 7.9pt landed at 96%. Move in ~0.1pt steps on the page that is short, and re-render.
- A page at 87–92% is one notch short, not one item short. Raise that page's type rather than adding an item that breaks a section's item count.
- `page_fill.py` deletes its own renders; use `pdftoppm` yourself for the final bottom-band clipping check, then delete `page-*.png`.
- Do not send the HTML.

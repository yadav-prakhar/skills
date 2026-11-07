# The Daily Prakhar — section briefs

What belongs on each desk, and what to refuse. Examples are from the 2026-10-28 issue (Vol. 1, No. 6) so a later session can see the register.

## AI & Technology (p1, front page)

Lead: the structural money story. 2026-10-28 ran Meta's $95bn raise with Nvidia, AMD and Broadcom buying in — suppliers becoming shareholders — plus Anthropic's S-1 economics. That is the register: financing, cost per task, who carries the risk.

Then, in `grid-2`, 6–10 items of 60–90 words: model releases with a capability *and* a price, procurement fights, labour effects (Microsoft's 60,000 buyouts), platform moves (Oracle reselling TPUs, Apple adding MCP to iWork), policy and consent fights (data-centre backlash).

Refuse: benchmark-topping announcements with no deployment, funding rounds with no product, "AI will change everything" commentary.

## Engineering, SDLC & ServiceNow (p2)

Software engineering as a measured discipline: DORA/Jellyfish-style data, agent code-share, review load, cost per developer, tooling that changes how teams work. The 2026-10-28 lead was Jellyfish's finding that agents touched 27.7% of pull requests at the median company while 0.5% of merges were approved on AI review alone.

Second header **ServiceNow** on the same page. The reader works on the platform: earnings and guidance, CRPO and AI contract value, product releases, ecosystem and certification changes. Earnings weeks are the anchor — consensus, composition of the beat, what to watch in the call.

## Open Source (p3)

Governance and maintenance decisions, not release notes: a JIT being removed, a project accepting Rust, a security scanner's findings. One line of what changed, one line of why a maintainer would care.

## Tech Briefing (p3, `grid-3 compact`)

Six to twelve stubs of 25–40 words: single findings, one-number stories, quiet but useful changes. This strip is the page's ballast — add them three at a time (one `grid-3` row) until p3 reaches ~90–95% without inflating real articles.

## India (p4)

National policy, courts, elections, markets and disasters with a concrete number attached. Cyclone landfall with evacuation counts, an IPO's first-day print, election results by seat — the same standard as the front page, one notch more compact.

## Dehradun & Uttarakhand (p4, local desk)

Real state and city reporting: supplementary budgets and their line items, assembly sessions, civic decisions, weather and disaster advisories that affect the city. Local colour is fine only when it is also news (firecracker licensing ahead of Diwali). If the state had a quiet week, say so by omission — do not invent a desk.

## The Notebook (p5) — standing features

p5 is the opposite of the news pages: nothing on it expires by tomorrow. Three features, in this order, every issue.

### Concept of the Day

Selection, format and the 60-concept spine live in `concepts.md`. Read that file and follow it; do not improvise a topic.

Page furniture:

```
CONCEPT 27 · STORAGE & DATA          (7pt, letter-spaced, above the box)
┌──────────────────────────────────────────────────────┐
│ **Write amplification**                    (14pt)    │
│ What it is. …                                        │
│ How it works. …                                      │
│ Where it bites. …                                    │
│ Say it in a review. "…"                              │
│ Check: …                                             │
│ Source: PostgreSQL docs · Nov 2026                   │
└──────────────────────────────────────────────────────┘
```

420–470 words. Four labelled beats — the labels are part of the design, not scaffolding: they force the mechanism, the number, the consequence and the reusable sentence to each exist. The `Check:` question is answered in a single `Answers —` line at the foot of p5, above the footer.

Refuse: a definition with no number, an analogy with no mechanism, a "fun fact" that never touches a decision, a concept the issue cannot cite. If the source is a blog summarising a paper, cite the paper.

### Tools to Try

Three tools in `grid-3`, each 45–60 words. One per column.

```
**Ghostman** · TUI API client
A keyboard-driven REST client and webhook inspector that
runs in the terminal. …
Try: `brew install ghostman`    Free · OSS
HN Show · Nov 3
```

Rules:
- The reader must be able to try it **today**: a CLI, a desktop app, a hosted service with a real free tier, or a small self-contained repo. Not a framework to build on, not a library that needs a project around it, not an enterprise product behind a sales call.
- Say what is new in one clause; do not write a feature list.
- One concrete `Try:` line — the actual install command, or the URL when there is nothing to install.
- Cost tag: `Free`, `OSS`, `Free tier`, or `Paid`.
- Source line: `HN Show · Nov 3` / `GitHub Trending · Nov 5` / `Console · Nov 4`.
- No two picks from the same viral cluster (the week five "HackerX" clones trend, that is one pick at most).
- No tool already printed in the last 90 days — grep the issue folders for the name.
- Taste: dev CLI, AI-agent tooling, macOS utilities, observability, data and debugging tools. A ServiceNow-adjacent tool earns a slot only when it is genuinely new to the platform, not a repackaged utility.

Refuse: "AI wrapper" chat UIs with no distinct mechanism, SDKs for a service that has no free tier, anything requiring a demo call, a repo with no README or install path.

### Events — Dehradun & Delhi NCR

A listings strip, not reporting. Window: **today through +14 days**. Two sub-heads, in this order: `Dehradun & Uttarakhand`, then `Delhi NCR`. Within each, sort by date.

```
Sat 14 Nov · 11:00 am — Supabase x Cyberwave Builders Meetup
Masters' Union, Gurugram · free, register
```

One line for the event, one for venue and cost. Add a third line only when the event needs a reason the title does not give ("the only FOSS meetup in NCR this fortnight"). No article body, no analysis.

Rules:
- Every entry needs a live listing URL and a date inside the window. A page that lists past events is not a listing until you check the date.
- Drop online-only events, job fairs, recruiter drives, generic "networking" mixers, and student-club recruitment. The reader can attend in person or not at all.
- Prefer: meetups, conferences, hackathons, workshops, demo days, DevFest, FOSS chapter meets.
- Several events often collide on one date (a city's Saturday). Print at most three from that date and spend the rest of the strip on other days — six entries from one Saturday is a schedule, not a fortnight.
- If Dehradun has nothing in the window, print `Nothing confirmed in the next fortnight.` and, if a date is already announced beyond it, one forward pointer (`DevFest Dehradun is set for 28 Nov`). Do not move Delhi events under the Dehradun head.
- The strip is sized for five to nine entries. If fewer survive verification, print only what is verified and let the page run short — a three-line strip is honest; a padded one is not.
- Do not repeat an event across issues unless its date or venue changed; a countdown ("next Saturday") is not a new item.

## Sourcing

`Outlet · Outlet · Mon DD, YYYY` on every item. Preferred: The Hindu, Indian Express, Hindustan Times, Reuters, CNBC, TechCrunch, The Verge, official newsrooms and filings, arXiv, PIB. Search descriptions usually carry enough body for a 70-word item; extract only for exact numbers, quotes or sequences.

The Notebook has its own provenance rules: concepts cite a primary document, tools cite the listing that surfaced them, events cite the registration page. A Notebook item with no source is dropped, not softened.

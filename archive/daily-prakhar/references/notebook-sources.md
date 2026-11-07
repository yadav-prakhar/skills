# Notebook sources — what works, what does not

Tested 2026-11-05. Re-test when a source returns nothing twice in a row; event sites redesign often.

## Scripts

`scripts/fetch_events.py` — upcoming events, Dehradun + Delhi NCR, next 14 days by default.

```bash
python3 <skill_dir>/scripts/fetch_events.py                # human-readable, grouped by region
python3 <skill_dir>/scripts/fetch_events.py --days 30
python3 <skill_dir>/scripts/fetch_events.py --json         # {date,time,title,venue,url,source,region}
python3 <skill_dir>/scripts/fetch_events.py --include-virtual
```

It fans out to nine sources in parallel (about 3 s total): the Luma New Delhi discover feed, the Meetup Delhi search page, eight Meetup group pages, and three GDG chapters. It filters to the window, drops obvious non-tech noise and online-only listings, dedupes by title+date, and sorts.

`scripts/fetch_tools.py` — candidate tools for the strip.

```bash
python3 <skill_dir>/scripts/fetch_tools.py                     # HN last 7d, >=30 points, plus GitHub trending
python3 <skill_dir>/scripts/fetch_tools.py --days 3 --min-points 50
python3 <skill_dir>/scripts/fetch_tools.py --json
```

Both are stdlib-only and need no key.

## Events — verified sources

**Luma (best signal for builder meetups).** The discover page embeds a JSON blob; the API is cleaner:

```
https://api.lu.ma/discover/get-paginated-events
  ?discover_place_api_id=discplace-CzipmKodUYN2Dfx   # New Delhi
  &pagination_limit=5
```

Returns `entries[].event` with `name`, `start_at` (UTC), `url` (slug), `location_type`, and `geo_address_info` (`address`, `city`). Five events per call; `has_more` is false at five, so this is a sample, not a full listing. `lu.ma/gurugram` exists but its discover payload has no events array — Gurugram events surface through the New Delhi feed (the Supabase meetup was at Masters' Union, Gurugram and appeared in the Delhi feed). `lu.ma/dehradun` is a 404.

**Meetup (best coverage of Dehradun).** The find page and every group page embed `__APOLLO_STATE__` in a `<script type="application/json">`:

```
https://www.meetup.com/find/?keywords=tech&location=in--Delhi&source=EVENTS
https://www.meetup.com/<group>/events/
```

Walk the JSON for dicts with both `dateTime` and `title`; `eventUrl` is the listing. Venues are either embedded (`name`, `address`, `city`) or a `{"__ref": "Venue:<id>"}` resolved from the same state. The `location=` parameter is effectively ignored — the find page returns the geo-default city — so use **group pages** for anything outside Delhi NCR.

Groups that carry live Dehradun events (verified):

- `aws-sbg-at-uttaranchal-university`
- `aws-sbg-at-jb-institute-of-technology-dehradun`
- `aws-sbg-at-graphic-era-deemed-to-be-university`
- `founders-startups-of-dehradun`

**GDG (DevFest season is the anchor).** A clean JSON API per chapter:

```
https://gdg.community.dev/api/event_slim/for_chapter/<id>/
  ?fields=title,start_date,event_type_title,url&include_cohosted_events=true
```

Chapter ids: Dehradun `1312`, New Delhi `798`, Gurugram `1288`. `event_type_title` gives `Free registration` when it applies.

**Dehradun sources the feeds miss — search these by name each issue:**

- Dehradun International Science & Technology Festival (DISTF), dehradunsciencefest.org — November, multi-day.
- eChai Dehradun, echai.ventures/dehradun — startup demo days.
- CNCF Dehradun, dehradun.cncg.in — cloud-native workshops, sparse.
- Doon Tech Community, doontech.in/events — has a calendar but last event May '26; check, do not assume dormant.
- GDG Dehradun, gdg.community.dev/gdg-dehradun.

**Delhi NCR sources worth a search when the script is thin:**

- FOSS United, `platform.fossunited.org/c/delhi/<mon>-<yy>` (e.g. `nov-26`) — dated chapter meetups.
- Commudle, commudle.com — the main Indian community platform, but an Angular SPA with no server-rendered data; it is only reachable through search results, not a direct fetch.
- delhi2go.in — SSR aggregator that scrapes Commudle and others; event dates are in the URL slug. Useful when a specific event is known but its listing is not.

## Events — what failed, do not retry

- **Meetup `location=` query** — returns the geo-default city regardless (a Dehradun query returned the same Delhi page, byte-for-byte near-identical). Use group pages.
- **Eventbrite** `eventbrite.com/d/india--delhi/technology/` — 200 but JS-rendered; the JSON-LD on the page is for venues, not events.
- **10times.com** — 403 to curl.
- **Insider.in** — 502 to curl.
- **Allevents.in** — Angular template shell (`{{performer.name}}`), no server-rendered events.
- **Konfhub** — city paths 404.
- **HasGeek** `/events` — 404.
- **Devfolio hackathons API** — works (`POST https://api.devfolio.co/api/search/hackathons` with `{"limit":10,"offset":0}`) but returns **10 per page, oldest-first, unsorted by any accepted parameter**, total ~1,800. Paging to the present is not worth it; use it only when a hackathon is already known.
- **Commudle** — SPA shell, 63 KB of framework, zero event data.

## Tools — verified sources

**Hacker News Show HN.** Algolia indexes it with points and timestamps:

```
https://hn.algolia.com/api/v1/search?tags=show_hn
  &numericFilters=created_at_i><epoch>,points>30&hitsPerPage=50
```

Use `created_at_i` (epoch seconds), not a date string. Titles arrive as `Show HN: …`; strip the prefix for print. The feed clusters: one week produces five variants of the same joke ("HackerBooks", "HackerTV", "HackerTimes"). Pick at most one from a cluster.

**GitHub Trending.** `https://github.com/trending?since=daily` is server-rendered and parses cleanly: `<article class="Box-row">` blocks with repo path, description, language, and `N stars today`. Prefer repos with a README, an install line, and a real commit history over a one-day spike.

**Console.dev.** Curated dev-tool newsletter. `/rss/` is 404 and `/tools` is JS-driven, so it is a **search** target (`site:console.dev <topic>`), not a fetch target. Use it to sanity-check a pick, not to generate one.

**Product Hunt.** No key-free API; search only. Its front page is dominated by launches that will not exist in a month, so it is a last resort.

## Verification checklist

Before an event goes on p5:

1. The listing page loads and shows the same date as the feed.
2. The date is `>= today` and `<= today + 14`.
3. The venue is a real, named place or the listing says TBA — not a city name standing in for one.
4. Registration is possible today (live link, or "walk-in" stated).
5. It is in person.

Before a tool goes on p5:

1. The link resolves to a project page, not a waitlist.
2. There is an install or try path in the page's first screen.
3. The price tag is stated on the page (or the repo licence is visible).
4. The name does not appear in any issue from the last 90 days.

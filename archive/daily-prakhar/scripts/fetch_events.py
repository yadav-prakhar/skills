#!/usr/bin/env python3
"""Collect upcoming tech events for Dehradun/Uttarakhand and Delhi NCR.

Sources (all public, no key):
  - lu.ma discover API (New Delhi)
  - meetup.com search page + individual group pages (SSR JSON in __APOLLO_STATE__)
  - gdg.community.dev event API (Dehradun, New Delhi, Gurugram chapters)

Usage:
  python3 fetch_events.py                 # next 14 days, both regions
  python3 fetch_events.py --days 21
  python3 fetch_events.py --city dehradun
  python3 fetch_events.py --json          # machine-readable
"""

from __future__ import annotations

import argparse
import concurrent.futures
import datetime as dt
import json
import re
import sys
import urllib.error
import urllib.request
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

LUMA_DELHI = "discplace-CzipmKodUYN2Dfx"

MEETUP_SEARCH = "https://www.meetup.com/find/?keywords=tech&location=in--Delhi&source=EVENTS"

# Verified live groups that actually carry Dehradun / NCR tech events.
MEETUP_GROUPS = [
    "aws-sbg-at-uttaranchal-university",
    "aws-sbg-at-jb-institute-of-technology-dehradun",
    "aws-sbg-at-graphic-era-deemed-to-be-university",
    "founders-startups-of-dehradun",
    "delhi-elastic-fantastics",
    "techfoundry",
    "ilugdelhi",
    "delhi-data-science-odsc",
]

GDG_CHAPTERS = {
    1312: "GDG Dehradun",
    798: "GDG New Delhi",
    1288: "GDG Gurugram",
}

# Obvious non-tech listings that share the city feeds. A blocklist, not an
# allowlist: "Fireside chat with a founder" should survive, a fun run should not.
NOISE = re.compile(
    r"\b(job ?expo|career fair|hiring|recruit(ment)? drive|walk-?in|"
    r"fun run|community run|yoga|meditat|wellness|concert|comedy|stand-?up|"
    r"music|dance|poetry|art exhibition|spiritual|satsang|"
    r"global virtual|virtual job)\b",
    re.I,
)
VIRTUAL = re.compile(r"\b(online|virtual|webinar|zoom|livestream)\b", re.I)


def fetch(url: str, method: str = "GET", body: dict | None = None, timeout: int = 25) -> str:
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "User-Agent": UA,
        "Accept": "application/json, text/html;q=0.9",
        **({"Content-Type": "application/json"} if body is not None else {}),
    })
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def walk(obj):
    if isinstance(obj, dict):
        yield obj
        for v in obj.values():
            yield from walk(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from walk(v)


def parse_iso(value: str) -> dt.datetime | None:
    try:
        v = value.replace("Z", "+00:00")
        return dt.datetime.fromisoformat(v)
    except Exception:
        return None


def meetup_events(url: str, source: str) -> list[dict]:
    try:
        html = fetch(url)
    except Exception:
        return []
    m = re.search(r'<script[^>]*type="application/json"[^>]*>(.*?)</script>', html, re.S)
    if not m:
        return []
    try:
        state = json.loads(m.group(1))
    except Exception:
        return []
    apollo = (state.get("props", {}).get("pageProps", {}) or {}).get("__APOLLO_STATE__", {})
    venues = {k: v for k, v in apollo.items() if k.startswith("Venue:")}
    out = []
    for key, ev in apollo.items():
        if not key.startswith("Event:") or not isinstance(ev, dict):
            continue
        when = parse_iso(ev.get("dateTime", ""))
        title = ev.get("title")
        if not when or not title:
            continue
        venue = ""
        vref = ev.get("venue")
        if isinstance(vref, dict):
            if vref.get("name"):
                venue = ", ".join(x for x in [vref.get("name"), vref.get("city")] if x)
                city = vref.get("city", "")
            elif vref.get("__ref") in venues:
                v = venues[vref["__ref"]]
                venue = ", ".join(x for x in [v.get("name"), v.get("city")] if x)
                city = v.get("city", "")
            else:
                city = ""
        else:
            city = ""
        out.append({
            "start": when,
            "title": title.strip(),
            "venue": venue,
            "url": ev.get("eventUrl") or "",
            "source": source,
            "city": city,
            "online": bool(ev.get("isOnline")) or bool(VIRTUAL.search(f"{title} {venue}")),
        })
    return out


def luma_events() -> list[dict]:
    url = ("https://api.lu.ma/discover/get-paginated-events"
           f"?discover_place_api_id={LUMA_DELHI}&pagination_limit=5")
    try:
        payload = json.loads(fetch(url))
    except Exception:
        return []
    out = []
    for entry in payload.get("entries", []):
        ev = entry.get("event") or {}
        when = parse_iso(ev.get("start_at", ""))
        if not when or not ev.get("name"):
            continue
        geo = ev.get("geo_address_info") or {}
        out.append({
            "start": when,
            "title": ev["name"].strip(),
            "venue": ", ".join(x for x in [geo.get("address"), geo.get("city")] if x),
            "url": "https://lu.ma/" + ev.get("url", ""),
            "source": "luma",
            "city": geo.get("city", ""),
            "online": ev.get("location_type") == "online",
        })
    return out


def gdg_events(chapter_id: int, name: str) -> list[dict]:
    url = (f"https://gdg.community.dev/api/event_slim/for_chapter/{chapter_id}/"
           "?fields=title,start_date,event_type_title,url&order=-start_date"
           "&include_cohosted_events=true")
    try:
        payload = json.loads(fetch(url))
    except Exception:
        return []
    out = []
    for ev in payload.get("results", []):
        when = parse_iso(ev.get("start_date", ""))
        if not when or not ev.get("title"):
            continue
        out.append({
            "start": when,
            "title": ev["title"].strip(),
            "venue": name,
            "url": ev.get("url", ""),
            "source": "gdg",
            "city": name.replace("GDG ", ""),
            "online": False,
        })
    return out


def region_of(ev: dict) -> str:
    hay = f"{ev.get('city','')} {ev.get('venue','')} {ev.get('title','')}".lower()
    if any(k in hay for k in ("dehradun", "doon", "uttarakhand", "roorkee", "mussoorie", "haldwani")):
        return "dehradun"
    return "delhi"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=14)
    ap.add_argument("--city", choices=["all", "dehradun", "delhi"], default="all")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--include-virtual", action="store_true", help="keep online/webinar listings")
    ap.add_argument("--no-filter", action="store_true", help="keep non-tech and virtual listings")
    args = ap.parse_args()

    now = dt.datetime.now(IST)
    horizon = now + dt.timedelta(days=args.days)

    jobs = [("luma", luma_events)]
    jobs.append(("meetup-search", lambda: meetup_events(MEETUP_SEARCH, "meetup")))
    for g in MEETUP_GROUPS:
        jobs.append((g, lambda g=g: meetup_events(f"https://www.meetup.com/{g}/events/", "meetup")))
    for cid, name in GDG_CHAPTERS.items():
        jobs.append((name, lambda cid=cid, name=name: gdg_events(cid, name)))

    events: list[dict] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(fn): label for label, fn in jobs}
        for fut in concurrent.futures.as_completed(futures):
            try:
                events.extend(fut.result())
            except Exception:
                continue

    seen = set()
    keep = []
    for ev in events:
        when = ev["start"].astimezone(IST)
        if not (now <= when <= horizon):
            continue
        if not args.no_filter:
            if NOISE.search(ev["title"]):
                continue
            if ev.get("online") and not args.include_virtual:
                continue
        key = (re.sub(r"\W+", "", ev["title"].lower())[:60], when.date().isoformat())
        if key in seen:
            continue
        seen.add(key)
        if args.city != "all" and region_of(ev) != args.city:
            continue
        ev["start"] = when
        keep.append(ev)

    keep.sort(key=lambda e: e["start"])

    if args.json:
        print(json.dumps([{
            "date": e["start"].date().isoformat(),
            "time": e["start"].strftime("%H:%M"),
            "title": e["title"],
            "venue": e["venue"],
            "url": e["url"],
            "source": e["source"],
            "region": region_of(e),
            "online": e.get("online", False),
        } for e in keep], indent=2))
        return 0

    if not keep:
        print(f"No listed events between {now.date()} and {horizon.date()}.")
        return 0

    for region, label in (("dehradun", "DEHRADUN & UTTARAKHAND"), ("delhi", "DELHI NCR")):
        rows = [e for e in keep if region_of(e) == region]
        if not rows:
            print(f"\n{label}: nothing confirmed in this window.")
            continue
        print(f"\n{label}")
        for e in rows:
            print(f"  {e['start']:%a %d %b} {e['start']:%H:%M}  {e['title']}")
            print(f"      {e['venue'] or 'venue TBA'}  [{e['source']}]  {e['url']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

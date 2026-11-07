#!/usr/bin/env python3
"""Candidate software tools for the Daily Prakhar "Tools to Try" strip.

Sources (public, no key):
  - Hacker News Show HN via the Algolia API (points + date filter)
  - GitHub Trending (daily), scraped from the public page

Usage:
  python3 fetch_tools.py                 # last 7 days, HN >= 30 points
  python3 fetch_tools.py --days 3 --min-points 50
  python3 fetch_tools.py --json
"""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import re
import sys
import urllib.parse
import urllib.request
import concurrent.futures

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"


def fetch(url: str, timeout: int = 25) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json, text/html"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def clean(s: str) -> str:
    return " ".join(html.unescape(re.sub(r"<[^>]+>", " ", s)).split())


def hn_show(days: int, min_points: int) -> list[dict]:
    since = int((dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=days)).timestamp())
    q = urllib.parse.urlencode({
        "tags": "show_hn",
        "numericFilters": f"created_at_i>{since},points>{min_points}",
        "hitsPerPage": 50,
    })
    payload = json.loads(fetch(f"https://hn.algolia.com/api/v1/search?{q}"))
    out = []
    for hit in payload.get("hits", []):
        out.append({
            "title": hit.get("title", ""),
            "url": hit.get("url") or f"https://news.ycombinator.com/item?id={hit.get('objectID')}",
            "points": hit.get("points", 0),
            "comments": hit.get("num_comments", 0),
            "date": (hit.get("created_at") or "")[:10],
            "source": "hn",
        })
    return out


def github_trending() -> list[dict]:
    page = fetch("https://github.com/trending?since=daily")
    out = []
    for block in re.findall(r'<article class="Box-row">(.*?)</article>', page, re.S):
        m = re.search(r'<h2[^>]*>.*?<a[^>]*href="/([^"]+)"', block, re.S)
        if not m:
            continue
        repo = m.group(1).strip()
        desc = re.search(r'<p class="col-9[^"]*"[^>]*>(.*?)</p>', block, re.S)
        lang = re.search(r'itemprop="programmingLanguage">([^<]+)<', block)
        stars = re.search(r'([\d,]+)\s+stars\s+today', clean(block))
        out.append({
            "title": repo,
            "url": f"https://github.com/{repo}",
            "description": clean(desc.group(1))[:160] if desc else "",
            "language": lang.group(1) if lang else "",
            "stars_today": stars.group(1) if stars else "",
            "source": "github",
        })
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=7)
    ap.add_argument("--min-points", type=int, default=30)
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        f_hn = pool.submit(hn_show, args.days, args.min_points)
        f_gh = pool.submit(github_trending)
        hn, gh = f_hn.result(), f_gh.result()

    if args.json:
        print(json.dumps({"hn": hn, "github": gh}, indent=2))
        return 0

    print(f"HN SHOW — last {args.days}d, over {args.min_points} points")
    for h in hn:
        print(f"  {h['points']:>4}  {h['date']}  {h['title']}")
        print(f"        {h['url']}")

    print("\nGITHUB TRENDING — today")
    for g in gh:
        stars = f"+{g['stars_today']} today" if g["stars_today"] else ""
        print(f"  {g['title']:<45} {stars:<14} [{g['language']}]")
        if g["description"]:
            print(f"        {g['description']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

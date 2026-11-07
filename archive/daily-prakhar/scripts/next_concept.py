#!/usr/bin/env python3
"""Pick the next Concept of the Day from references/concepts.md.

Reads the curriculum, counts covered ids per domain in
~/Daily-Prakhar/concepts-covered.txt, and prints the next id: the domain with
the fewest covered concepts (ties broken by file order), then the lowest
uncovered id inside it.

Usage:
  python3 next_concept.py            # show the next concept, do not record it
  python3 next_concept.py --mark     # show it and append today's line
  python3 next_concept.py --state /path/to/file
"""

from __future__ import annotations

import argparse
import datetime as dt
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CURRICULUM = os.path.join(os.path.dirname(HERE), "references", "concepts.md")
DEFAULT_STATE = os.path.expanduser("~/Daily-Prakhar/concepts-covered.txt")

LINE = re.compile(r"^- `([a-j])(\d)` \*\*(.+?)\*\* — (.+)$")


def load_curriculum(path: str) -> list[dict]:
    items = []
    for raw in open(path, encoding="utf-8"):
        m = LINE.match(raw.strip())
        if m:
            items.append({
                "id": m.group(1) + m.group(2),
                "domain": m.group(1),
                "title": m.group(3),
                "hook": m.group(4),
            })
    return items


def load_covered(path: str) -> list[str]:
    if not os.path.exists(path):
        return []
    ids = []
    for raw in open(path, encoding="utf-8"):
        parts = raw.split()
        if not parts:
            continue
        token = parts[-1]
        if token.startswith("r2"):
            token = token[2:]
        if re.fullmatch(r"[a-j]\d", token):
            ids.append(token)
    return ids


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--state", default=DEFAULT_STATE)
    ap.add_argument("--mark", action="store_true")
    ap.add_argument("--date", default=dt.date.today().isoformat())
    args = ap.parse_args()

    items = load_curriculum(CURRICULUM)
    if not items:
        print("Could not parse the curriculum at", CURRICULUM, file=sys.stderr)
        return 1

    covered = load_covered(args.state)
    covered_set = set(covered)
    domains = []
    for it in items:
        if it["domain"] not in domains:
            domains.append(it["domain"])

    total = len(items)
    round_no = 1
    if len(covered_set) >= total:
        round_no = 2
        covered_set = set()  # start over, but require a new angle in the copy

    counts = {d: sum(1 for c in covered_set if c.startswith(d)) for d in domains}
    domain = min(domains, key=lambda d: (counts[d], domains.index(d)))

    candidates = [it for it in items if it["domain"] == domain and it["id"] not in covered_set]
    if not candidates:  # every id in the chosen domain is covered; widen
        candidates = [it for it in items if it["id"] not in covered_set]
    if not candidates:
        print("Every concept is covered. Start Round 2 in file order.")
        return 0

    pick = candidates[0]
    prefix = "r2 " if round_no == 2 else ""
    print(f"NEXT: {pick['id']} — {pick['title']}  (domain {pick['domain'].upper()}, "
          f"{counts[pick['domain']]}/{sum(1 for i in items if i['domain'] == pick['domain'])} covered"
          f"{', ROUND 2' if round_no == 2 else ''})")
    print(f"HOOK: {pick['hook']}")
    print(f"STATE: {args.state}")

    if args.mark:
        os.makedirs(os.path.dirname(args.state) or ".", exist_ok=True)
        existing = ""
        if os.path.exists(args.state):
            existing = open(args.state, encoding="utf-8").read()
        if not existing.endswith("\n") and existing:
            existing += "\n"
        with open(args.state, "w", encoding="utf-8") as fh:
            fh.write(f"{existing}{args.date} {prefix}{pick['id']}\n")
        print(f"MARKED: {args.date} {prefix}{pick['id']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""Render chosen PDF pages to PNG so you can LOOK at them before calling the book done.

Pick pages by number, by text they contain, or every page that holds a figure:

  python3 render_pages.py book.pdf --out qa/ --pages 1,3 --find "Figure 4.2" --section answers
  python3 render_pages.py book.pdf --out qa/ --figures        # every page with "Figure N.N"
  python3 render_pages.py book.pdf --out qa/ --summary        # page count + chapter starts only

Prints the PNG paths; open each with your image viewer / Read tool. 72 dpi is enough to spot
overlapping labels, clipped code and empty pages while keeping images small.
Needs PyMuPDF:  pip install pymupdf
"""
import argparse
import os
import re
import sys

try:
    import fitz
except ImportError:
    sys.exit("PyMuPDF missing: pip install pymupdf")

ap = argparse.ArgumentParser()
ap.add_argument("pdf")
ap.add_argument("--out", default="qa")
ap.add_argument("--pages", default="", help="comma list, 1-based")
ap.add_argument("--find", action="append", default=[], help="render the first page containing this text")
ap.add_argument("--section", action="append", default=[], help="render the first page of the section with this data-id")
ap.add_argument("--figures", action="store_true", help="render every page containing a 'Figure N.N' caption")
ap.add_argument("--dpi", type=int, default=72)
ap.add_argument("--summary", action="store_true")
a = ap.parse_args()

doc = fitz.open(a.pdf)
print(f"pages: {len(doc)}  size: {doc[0].rect.width:.0f}x{doc[0].rect.height:.0f} pt (A4 = 595x842)")
if a.summary:
    for n, p in enumerate(doc, 1):
        for m in re.findall(r"@@([A-Za-z0-9_-]+)@@", re.sub(r"\s+", "", p.get_text())):
            print(f"  {m}: page {n}")
    sys.exit(0)

wanted = {int(x) for x in a.pages.split(",") if x.strip()}
for text in a.find:
    hit = next((n for n, p in enumerate(doc, 1) if text in p.get_text()), None)
    print(f"find {text!r}: page {hit}")
    if hit:
        wanted.add(hit)
for sid in a.section:
    hit = next((n for n, p in enumerate(doc, 1) if f"@@{sid}@@" in re.sub(r"\s+", "", p.get_text())), None)
    print(f"section {sid!r}: page {hit}")
    if hit:
        wanted.add(hit)
if a.figures:
    wanted |= {n for n, p in enumerate(doc, 1) if re.search(r"Figure \d+\.\d+", p.get_text())}

os.makedirs(a.out, exist_ok=True)
empty = [n for n, p in enumerate(doc, 1) if len(p.get_text().strip()) < 40]
if empty:
    print(f"near-empty pages (check for stray page breaks): {empty}")
for n in sorted(wanted):
    path = os.path.join(a.out, f"page-{n:03d}.png")
    doc[n - 1].get_pixmap(dpi=a.dpi).save(path)
    print(path)

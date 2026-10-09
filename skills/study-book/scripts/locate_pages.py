#!/usr/bin/env python3
"""Print {section_id: first_page_number} for every @@id@@ marker in a PDF, as JSON.

build_book.mjs injects an invisible <span class="pm">@@id@@</span> into each chapter/part's
first <h1>. Whitespace is stripped before matching because a marker can wrap in extracted text. Searching for that marker is robust where searching for the visible
heading is not: CSS letter-spacing makes PDF text come out as "C H A P T E R  3", and the
same words also appear in the table of contents and the answer key.

Usage: python3 locate_pages.py book.pdf
Needs PyMuPDF:  pip install pymupdf
"""
import json
import re
import sys

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF missing: pip install pymupdf")

doc = fitz.open(sys.argv[1])
pages = {}
for number, page in enumerate(doc, start=1):
    for section_id in re.findall(r"@@([A-Za-z0-9_-]+)@@", re.sub(r"\s+", "", page.get_text())):
        pages.setdefault(section_id, number)
print(json.dumps(pages))

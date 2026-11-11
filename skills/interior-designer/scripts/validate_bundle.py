#!/usr/bin/env python3
"""Dependency-free structural checks for the interior-designer skill bundle."""
from pathlib import Path
import csv
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "SKILL.md", "README.md", "CHANGELOG.md",
    "references/design-manual.md", "references/research-sources.md",
    "workflows/room-redesign.md", "workflows/space-planning.md",
    "workflows/lighting-audit.md", "workflows/visual-redesign.md",
    "workflows/execution-planning.md",
    "templates/room-brief.md", "templates/room-survey.md",
    "templates/design-proposal.md", "templates/fixture-schedule.csv",
    "templates/material-schedule.csv", "templates/project-budget.csv",
    "assets/lighting-layers.svg", "assets/design-process.svg",
    "tests/behavior-cases.md",
]
errors = []

def error(message):
    errors.append(message)

for rel in REQUIRED:
    if not (ROOT / rel).is_file():
        error(f"Missing required file: {rel}")

skill_path = ROOT / "SKILL.md"
if skill_path.exists():
    content = skill_path.read_text(encoding="utf-8")
    if not content.startswith("---\n"):
        error("SKILL.md must start with YAML frontmatter")
    else:
        parts = content.split("---", 2)
        if len(parts) < 3:
            error("SKILL.md frontmatter is not closed")
        else:
            front = parts[1]
            if not re.search(r"(?m)^name:\s*interior-designer\s*$", front):
                error("Frontmatter name must be interior-designer")
            if not re.search(r"(?m)^description:\s*\S", front):
                error("Frontmatter description must be non-empty")
            if not parts[2].lstrip().startswith("# "):
                error("SKILL.md body must begin with an H1")

for md in ROOT.rglob("*.md"):
    content = md.read_text(encoding="utf-8")
    for target in re.findall(r"\[[^\]]*\]\(([^)]+)\)", content):
        target = target.split("#", 1)[0].strip()
        if not target or re.match(r"^[a-z]+://", target) or target.startswith("mailto:"):
            continue
        if not (md.parent / target).resolve().exists():
            error(f"Broken local link in {md.relative_to(ROOT)}: {target}")

for path in ROOT.rglob("*.csv"):
    try:
        with path.open(newline="", encoding="utf-8") as handle:
            rows = list(csv.reader(handle))
        if not rows or len(rows[0]) < 3:
            error(f"CSV needs a header with at least 3 columns: {path.relative_to(ROOT)}")
        elif len(rows[0]) != len(set(rows[0])):
            error(f"Duplicate CSV header: {path.relative_to(ROOT)}")
    except (OSError, csv.Error) as exc:
        error(f"Cannot parse {path.relative_to(ROOT)}: {exc}")

for path in ROOT.rglob("*.svg"):
    data = path.read_text(encoding="utf-8")
    if "<svg" not in data or "</svg>" not in data:
        error(f"Malformed SVG wrapper: {path.relative_to(ROOT)}")

if errors:
    print("VALIDATION FAILED")
    print("\n".join(f"- {item}" for item in errors))
    sys.exit(1)

print(f"VALIDATION PASSED: {len(REQUIRED)} required files, local links, CSV headers and SVG wrappers checked.")

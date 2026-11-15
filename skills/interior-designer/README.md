# Interior Designer

Evidence-aware interior design and renovation planning for agents working with real rooms, photos, measurements, products and execution constraints.

**Core promise: design the room that exists, not the room an image model imagines.**

## Structure
- `SKILL.md`: operating protocol and routing.
- `references/design-manual.md`: design principles and safety boundaries.
- `references/research-sources.md`: authoritative starting points and research hygiene.
- `workflows/`: room redesign, space planning, lighting, visualization and execution.
- `templates/`: brief, survey, proposal and editable CSV schedules.
- `assets/`: original explanatory SVG diagrams.
- `tests/behavior-cases.md`: scenario-based acceptance checks.
- `scripts/validate_bundle.py`: dependency-free structural validator.

## Use
Provide a room photo, plan, measurements or design question. For a substantial project, include purpose, occupants, constraints, desired mood, budget and items that must remain unchanged. The agent should ask only for missing information that materially affects the design.

## Validate
From the repository root: `python3 skills/interior-designer/scripts/validate_bundle.py`

The validator checks structure, local Markdown links, CSV headers and SVG wrappers. It does not test model behavior, construction feasibility or code compliance.

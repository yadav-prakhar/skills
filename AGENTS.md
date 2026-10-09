# AGENTS.md

This repo ships agent skills from two branches. Read the publishing skill, `.claude/skills/update-skills-and-website/SKILL.md` on master, before changing `skills/`, the registry, or the site. From a `docs` checkout, read it with `git show origin/master:.claude/skills/update-skills-and-website/SKILL.md`.

- `master`: skill sources in `skills/<slug>/` and the registry (`.claude-plugin/plugin.json`, `skills.sh.json`, the README table).
- `docs`: the website. It keeps its own copies of `skills/`, so they can differ from master. CI fails on any difference not listed in `known_drift` in `.github/workflows/ci.yml`.

Tests, from the repo root:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_*.py'
git diff --check
```

On `docs`, also run `npm ci && npm run build && npm run test:site`.

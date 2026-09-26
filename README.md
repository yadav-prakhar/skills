# skills

Custom agent skills, published for install with the [`skills` CLI](https://skills.sh) (`npx skills add`).

## Install

```bash
# from the repo (any agent)
npx skills add yadav-prakhar/skills --list

# pick skills by name
npx skills add yadav-prakhar/skills --skill software-critique --skill eli5

# global install for a specific agent, no prompts
npx skills add yadav-prakhar/skills --skill software-critique -g -a claude-code -y
```

Skills live under `skills/<name>/SKILL.md` and are declared in
[`.claude-plugin/plugin.json`](.claude-plugin/plugin.json), so installed skills are grouped
under **PrakharYadav Skills** in `npx skills list`.

## Published skills

| Skill | What it does |
| --- | --- |
| [`software-critique`](skills/software-critique/SKILL.md) | Panel-style critique of a product, codebase, or repo: evidence-backed findings, severity by user impact, verdict up front. |
| [`medical-assistant`](skills/medical-assistant/SKILL.md) | Evidence-based lab report / biomarker analysis (references the full protocol in `references/master-prompt.md`). |
| [`eli5`](skills/eli5/SKILL.md) | Plain-language ELI5 TL;DR of a PR, issue chain, commit range, or the agent's own work: before → now, guarantees, what's unchanged, what you must do next. |

## Hermes backup

[`hermes-backup/`](hermes-backup/) is a backup of a Hermes default-profile skills directory,
nested by category (e.g. `hermes-backup/productivity/xlsx/SKILL.md`). It sits outside the
CLI's default scan paths, so it does not show up in `npx skills add yadav-prakhar/skills`.
Install from it by path:

```bash
# one category
npx skills add https://github.com/yadav-prakhar/skills/tree/master/hermes-backup/productivity --list

# one skill
npx skills add https://github.com/yadav-prakhar/skills/tree/master/hermes-backup/productivity/xlsx

# everything, backup included
npx skills add yadav-prakhar/skills --full-depth --list
```

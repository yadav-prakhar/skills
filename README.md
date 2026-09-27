# skills

Custom agent skills, published for install with the [`skills` CLI](https://skills.sh) (`npx skills add`).

## Install

```bash
# from the repo (any agent)
npx skills add yadav-prakhar/skills --list

# pick skills by name
npx skills add yadav-prakhar/skills --skill eli5 --skill change-tldr --skill change-explainer

# global install for a specific agent, no prompts
npx skills add yadav-prakhar/skills --skill eli5 -g -a claude-code -y
```

Skills live under `skills/<name>/SKILL.md` and are declared in
[`.claude-plugin/plugin.json`](.claude-plugin/plugin.json), so installed skills are grouped
under **PrakharYadav Skills** in `npx skills list`.

## Published skills

| Skill | What it does |
| --- | --- |
| [`software-critique`](skills/software-critique/SKILL.md) | Panel-style critique of a product, codebase, or repository: evidence-backed findings, severity by user impact, verdict up front. |
| [`medical-assistant`](skills/medical-assistant/SKILL.md) | Evidence-based lab report and biomarker analysis (references the full protocol in `references/master-prompt.md`). |
| [`change-tldr`](skills/change-tldr/SKILL.md) | Fast reviewer summary of a PR, issue chain, commit range, or session: before → now, guarantees, unchanged behavior, verification, and next steps. |
| [`change-explainer`](skills/change-explainer/SKILL.md) | Thorough investigation of an engineering change: evidence hierarchy, intent versus reality, blast radius, risks, verification, and remaining work. |
| [`eli5`](skills/eli5/SKILL.md) | Audience-adaptive explanation of concepts, code, systems, errors, and changes using the simplest accurate mental model. |

## Hermes backup

[`hermes-backup/`](hermes-backup/) is a backup of a Hermes default-profile skills directory,
nested by category (for example, `hermes-backup/productivity/xlsx/SKILL.md`). It sits outside the
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

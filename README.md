# hermes-custom-skills

Custom agent skills, published for install with the [`skills` CLI](https://skills.sh) (`npx skills add`).

## Install

```bash
# from the repo (any agent)
npx skills add yadav-prakhar/hermes-custom-skills --list

# pick skills by name
npx skills add yadav-prakhar/hermes-custom-skills --skill software-critique --skill eli5

# global install for a specific agent, no prompts
npx skills add yadav-prakhar/hermes-custom-skills --skill software-critique -g -a claude-code -y
```

Skills live under `skills/<name>/SKILL.md`, so they are discovered at the default
scan depth — no `--full-depth` needed.

## Published skills

| Skill | What it does |
| --- | --- |
| [`software-critique`](skills/software-critique/SKILL.md) | Panel-style critique of a product, codebase, or repo: evidence-backed findings, severity by user impact, verdict up front. |
| [`medical-assistant`](skills/medical-assistant/SKILL.md) | Evidence-based lab report / biomarker analysis (references the full protocol in `references/master-prompt.md`). |
| [`eli5`](skills/eli5/SKILL.md) | Plain-language ELI5 TL;DR of a PR, issue chain, commit range, or the agent's own work: before → now, guarantees, what's unchanged, what you must do next. |

## Rest of the repo

The remaining skills are a backup of a Hermes default-profile skills directory and are
nested by category (e.g. `productivity/xlsx/SKILL.md`, `mlops/inference/llama-cpp/SKILL.md`).
Because the repo root and `skills/` both contain skills, the CLI stops at the default
scan depth; install any nested skill by direct path instead:

```bash
npx skills add https://github.com/yadav-prakhar/hermes-custom-skills/tree/master/productivity/xlsx
# or scan everything:
npx skills add yadav-prakhar/hermes-custom-skills --full-depth --list
```

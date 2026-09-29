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
| [`bro`](skills/bro/SKILL.md) | Restates the last message in plain human language with no jargon. Created by [Lauren Tan (poteto)](https://github.com/poteto) ([X](https://x.com/poteto)) in [pstack](https://github.com/cursor/plugins/tree/main/pstack); included with attribution. |

Use `change-tldr` for the former ELI5 change-summary workflow, `change-explainer`
for a detailed investigation, and `eli5` when audience-friendly understanding is
the goal. Each can be installed independently. When both are available, `eli5`
can reuse `change-explainer`'s investigation while retaining the requested length
and producing one final answer.

## Verification

Run the dependency-free structural checks:

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
git diff --check
```

The [behavioral cases](tests/explanation_cases.json) cover routing, composition,
verification provenance, comparison scope, and missing evidence. To capture
isolated responses with an authenticated Claude CLI, choose a model and a new
output path whose parent directory already exists:

```bash
python3 tests/run_explanation_smoke.py --model sonnet --output /tmp/explanation-smoke.jsonl
```

This optional command makes model calls and may incur usage charges. It uses
CLI safe mode with tools disabled, without modifying settings.
Review each captured response against its recorded criteria. A successful exit
means capture succeeded, not that model behavior passed. These are prompt-level
smoke tests with supplied evidence, not tests of a host's skill discovery or real
Git/forge tool use. Use `--case <id>` to capture selected cases.

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

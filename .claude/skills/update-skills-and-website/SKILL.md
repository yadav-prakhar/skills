---
name: update-skills-and-website
description: Publish changes to this repo's agent skills library and its docs-branch website. Use to add, edit, or remove a skill under skills/, to sync skill changes from master to docs, or to change a skill's website dependencies, grouping, or design.
metadata:
  internal: true
---

# Update skills and website

The library ships on two branches. `master` holds skill sources and the registry. `docs` holds the
website: its own copies of `skills/`, the builder in `site/`, and the generated `docs/` that GitHub
Pages serves from `docs` at `/docs`.

| Change | Branch | Files |
|---|---|---|
| Skill content | master, then docs | `skills/<slug>/` (SKILL.md, `references/`, `scripts/`, `assets/`) |
| Registry | master | `.claude-plugin/plugin.json`, `skills.sh.json` (groups), `README.md` table. `tests/test_explanation_skills.py` checks all three against `skills/*/SKILL.md` |
| CI | master and docs | `.github/workflows/ci.yml`. Keep the copy on both branches identical |
| Dependencies and credits | docs | `requirements` and `credits` maps in `site/build.mjs` |
| Look and layout | docs | `site/style.css`, `site/site.js`, `site/DESIGN.md` (update DESIGN.md when the visual language changes) |
| Generated pages | docs | `docs/`: rebuilt by the builder, never hand-edited |

## Steps

### 1. Branch from current master

`git fetch origin`, then `git switch -c <branch> origin/master`. Only commit to a branch whose
upstream still exists. Run `git fetch --prune` first, since a deleted upstream branch is not a
place to push. Push with `git push -u origin <branch>` so the push target is always named.

*Done when* the branch starts at the `origin/master` tip and its upstream is the branch you named.

### 2. Edit the skill

- New skill: `skills/<slug>/SKILL.md`. The frontmatter `name` equals the folder name and
  `description` is non-empty. The first line after the frontmatter is `# Title`, because the
  builder rejects a page without an H1. Links to local files resolve inside the skill folder.
- Edited skill: keep the frontmatter `name` stable.
- Removed skill: delete the folder, then remove every registry entry in step 3.

*Done when* the step 3 suite passes against the edited files.

### 3. Register the skill on master

A published skill appears in three places. `tests/test_explanation_skills.py` derives the expected set
from `skills/*/SKILL.md` and fails if any of these lists differs from it:

- `.claude-plugin/plugin.json`, the `skills` list (`./skills/<slug>`).
- `skills.sh.json`, a grouping. A skill missing here lands under "More skills" on the site.
- `README.md`, a table row whose link points at `skills/<slug>/SKILL.md`.

Run:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_*.py'
git diff --check
```

*Done when* the suite passes and `git diff --check` is clean.

### 4. Commit, push, and open the PR

- Stage explicit paths. Leave `.omc/`, `node_modules/`, and `__pycache__/` unstaged.
- Commit with the personal identity: `git -c user.name="Prakhar Yadav" -c user.email="8735394+yadav-prakhar@users.noreply.github.com" commit`.
  Check it with `git log -1 --format='%an <%ae> / %cn <%ce>'`. The global git config defaults to a work address.
- `git push -u origin <branch>`, then `gh pr create --repo yadav-prakhar/skills --base master`.
  Use the `yadav-prakhar` GitHub account. `gh auth status` lists a second, work account too.
- End the PR body with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

*Done when* the PR is merged, or the user has said to leave it open.

### 5. Carry the change to docs

Skill copies on docs can differ from master, on purpose or by drift. Run
`git diff origin/master origin/docs -- skills/` to see which. Example: `skills/bro/SKILL.md`
has the H1 the builder requires on docs and lacks it on master. Copying files wholesale from
master breaks the docs build, so cherry-pick instead.

```bash
git fetch origin docs:docs                       # fast-forwards local docs; refuses if diverged
git worktree add <scratch>/docs-site docs        # keeps the main checkout on its branch
cd <scratch>/docs-site
git -c user.name=... -c user.email=... cherry-pick <master-sha>   # identity: as in step 4
```

- If a cherry-pick conflicts in `README.md` or a skill file, keep the docs side and add the new
  lines. Do not run `git checkout master -- README.md`: the docs README has a Website section
  that master lacks.
- Add website-only data in `site/build.mjs`: a `requirements` entry (`name`, `note`, optional
  `command`) for software a skill needs, or a `credits` entry. The build throws on a key that is
  not a skill. Do not put these in SKILL.md.

*Done when* the docs skill diff holds only the intended changes. Any other drift is reported, not copied. CI fails on drift outside the `known_drift` variable in `ci.yml`, so add a path there only with a reason.

### 6. Rebuild and test on docs

In the worktree:

```bash
npm ci && npm run build && npm run test:site
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_*.py'
git diff --check
```

A group or skill change rewrites the sidebar and previous/next links on every page. That is
expected. Check that `git status` shows only `docs/` and the source files you meant to change.
If `git diff --check` fails on generated HTML, fix the template that emits a blank indented line.
Do not commit the whitespace.

*Done when* build, site tests, and the Python suite pass, and `git diff --check` is clean.

### 7. Look at the pages

Serve the built site under the `/skills/` base path, then capture it. Run the script from a
scratch folder, not the repo, so `playwright-core` stays out of the working tree:

```bash
SCR=<scratch>; mkdir -p $SCR/shot && ln -sfn <worktree>/docs $SCR/shot/skills
cp .claude/skills/update-skills-and-website/scripts/visual-check.mjs $SCR/shot/
cd $SCR/shot && npm i playwright-core && python3 -m http.server 8765 --bind 127.0.0.1 &
node visual-check.mjs http://127.0.0.1:8765/skills/skills/<slug>/ $SCR/qa/<slug>
```

Give each page its own output folder, or the screenshots overwrite each other.

The script uses system Chrome (override with `CHROME_PATH`). It fails on page overflow, a page
count of install rails other than one, or an uncaught page error. Read the PNGs and compare them
to `site/DESIGN.md`. A `favicon.ico` 404 is expected: the site ships no favicon.

*Done when* the script exits 0 and the screenshots match the design guide in both themes.

### 8. Publish docs

Commit in the worktree with the step 4 identity. Pushing `docs` publishes the live site, so
confirm first unless the user asked for the push in this request. Then:

```bash
git push origin docs
gh api repos/yadav-prakhar/skills/pages/builds/latest --jq '.status,.commit'
git worktree remove <scratch>/docs-site
```

*Done when* Pages reports `built` at your commit. If it still shows `building`, say so rather than
claiming the site is live.

## Gotchas

- Do not put a project-only skill in `skills/`. The builder publishes every folder there that has a SKILL.md.
- Keep `metadata: internal: true` in the frontmatter. Without it, `npx skills add yadav-prakhar/skills --list` shows this skill to everyone; with it, the CLI hides it (checked with a probe repo).
- This skill lives on master under `.claude/skills/`. It is not on docs unless master is merged in.
- The local `docs` and `master` branches go stale. Fetch before you read them.

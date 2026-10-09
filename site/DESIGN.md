# Website design language

This is a readable library for people browsing, evaluating, and installing agent skills. The interface should help them find a skill, understand what it does, read its full instructions, and reach the source file. Treat the skills as the content and the UI as quiet scaffolding.

## Visual character

- **Editorial index, not a dashboard:** generous whitespace, hairline dividers, clear type hierarchy, and a small set of text-based navigation patterns. The home page is a catalog of grouped rows; skill pages are long-form reading surfaces.
- **Monochrome by default:** use the semantic CSS variables in [`style.css`](style.css). Light mode uses `--bg: #fafafa`, `--fg: #171717`, `--muted: #686868`, `--border: #dedede`, and `--surface: #f0f0f0`. Dark mode uses the same roles with `#0d0d0d`, `#ededed`, `#a3a3a3`, `#303030`, and `#181818`. Hover and focus have their own tokens. Prefer contrast and hierarchy over accent colors or decorative gradients.
- **Typography does the work:** Inter leads the system sans-serif stack; no webfont is bundled. Large, moderately weighted, tightly tracked headings contrast with compact labels and relaxed body copy. Monospace is reserved for code. Use uppercase sparingly for the wordmark, category headings, and small index metadata.
- **One quiet flourish:** the muted period in the wordmark and title, and the northeast arrow on navigational links, are the recurring visual signatures. Let whitespace and rules carry the rest.

## Page composition

- **Home:** a sticky, thin-bordered masthead above a centered (900px max) content column with left-aligned text. A spacious type-led introduction, closing on a copyable install command, precedes a ruled catalog. Each group has a small category label on the left and skill-name/summary rows on the right; rows behave as whole links rather than cards.
- **Skill detail:** a persistent category sidebar (256px on wide screens), breadcrumb, large title, short lede, a copyable install command for that skill, a Requirements list when the skill needs software beyond its own files, and a reading column (740px max for the article). Headings, paragraphs, lists, code, tables, the source link, and previous/next links form one continuous document flow.
- **Responsive:** at 760px the sidebar becomes a menu with a scrim; at 550px the grouped catalog stacks. Preserve comfortable reading widths, spacing, and the 320px minimum viewport rather than shrinking the desktop layout uniformly.

## Interaction and content

- Keep interactions functional and restrained: row highlights, subtle arrow motion, clear selected navigation, and a theme selector with system/light/dark choices. System preference is the default; explicit choices persist in local storage.
- Install commands appear once per page as an install rail: a monospace command on a surface fill with a Copy button. A successful copy swaps the label to `Copied.` (the muted period used elsewhere) and announces the result through a status region; the button holds its width so the feedback does not shift the layout. Without JavaScript, the command remains selectable text. The Requirements list under the install rail uses the same surface for its dependency commands, but those are selectable code with no Copy button, so the install rail stays the page's only copy control.
- Preserve the skip link, visible keyboard focus, labeled controls, current-page indication, focus behavior in the mobile menu, and reduced-motion support when changing navigation or animation.
- Write plain, descriptive copy. Skill titles, descriptions, and article bodies come from `skills/*/SKILL.md`; ordering and groups come from `skills.sh.json`. Source links should let readers inspect the original file rather than presenting the rendered page as a separate source of truth.

## Working on the website

[`build.mjs`](build.mjs), [`style.css`](style.css), and [`site.js`](site.js) are the authored website files. `docs/` contains generated HTML and copied assets published from the `docs` branch; make UI and content changes in the sources, then rebuild `docs/`. For the commands and publishing workflow, see the [README website section](../README.md#website). When changing the visual language intentionally, update this guide alongside the source and check both themes, narrow screens, keyboard navigation, and the generated pages.

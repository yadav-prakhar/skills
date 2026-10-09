import { readdir, readFile, mkdir, writeFile, copyFile } from 'node:fs/promises';
import { join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import YAML from 'yaml';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const skillsDir = join(root, 'skills');
const output = join(root, 'docs');
const base = '/skills/';
const siteUrl = 'https://yadav-prakhar.github.io/skills';
const repository = 'https://github.com/yadav-prakhar/skills';
const repoSlug = repository.replace('https://github.com/', '');
const sourceRoot = `${repository}/blob/docs/`;
// Credits for skills adapted from other authors. Shown on the website and README, not in SKILL.md.
const credits = {
  bro: 'Created by [Lauren Tan (poteto)](https://github.com/poteto) ([@poteto on X](https://x.com/poteto)) as part of [pstack](https://github.com/cursor/plugins/tree/main/pstack) in the Cursor plugins repository. The instruction text is reproduced from the [original `bro` skill](https://github.com/cursor/plugins/blob/main/pstack/skills/bro/SKILL.md). All credit belongs to the original author.',
};
// Software a reader must install before a skill's bundled scripts run. Shown on the website, not in SKILL.md.
const requirements = {
  'study-book': [
    { name: 'Node.js 18 or later', note: 'Runs the build and companion test scripts.' },
    { name: 'Playwright with Chromium', note: 'Renders the book PDF and drives the companion test.', command: 'npm i playwright && npx playwright install chromium' },
    { name: 'Python 3 with PyMuPDF', note: 'Finds chapter page numbers and renders QA pages.', command: 'pip install pymupdf' },
  ],
};
const md = new MarkdownIt({ html: false, linkify: false });
const escape = md.utils.escapeHtml;
const skillUrl = slug => `${base}skills/${encodeURIComponent(slug)}/`;
const absolute = path => `${siteUrl}${path.slice(base.length - 1)}`;

md.renderer.rules.heading_open = (tokens, index, options, env, self) => {
  const heading = tokens[index + 1].content;
  const slug = heading.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
  const count = env.headings.get(slug) ?? 0;
  env.headings.set(slug, count + 1);
  tokens[index].attrSet('id', count ? `${slug}-${count + 1}` : slug);
  return self.renderToken(tokens, index, options);
};

md.renderer.rules.link_open = (tokens, index, options, env, self) => {
  const token = tokens[index];
  const href = token.attrGet('href');
  if (href && !href.startsWith('#') && !/^[a-z][\w+.-]*:/i.test(href)) {
    const [path, fragment] = href.split('#', 2);
    const target = posix.normalize(posix.join('skills', env.slug, path));
    if (!target.startsWith(`skills/${env.slug}/`) || !env.files.has(target)) {
      throw new Error(`Invalid local link in ${env.slug}/SKILL.md: ${href}`);
    }
    token.attrSet('href', `${sourceRoot}${target}${fragment ? `#${fragment}` : ''}`);
  }
  return self.renderToken(tokens, index, options);
};

function parseSkill(source, slug) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) throw new Error(`Missing frontmatter in skills/${slug}/SKILL.md`);
  const data = YAML.parse(match[1]);
  if (data?.name !== slug || typeof data.description !== 'string' || !data.description.trim()) {
    throw new Error(`Invalid name or description in skills/${slug}/SKILL.md`);
  }
  const tokens = md.parse(source.slice(match[0].length), {});
  for (const token of tokens) {
    if (token.type !== 'inline') continue;
    for (const [index, child] of token.children.entries()) {
      if (child.type !== 'link_open' || !child.attrGet('href')?.startsWith('https://github.com/acme/')) continue;
      const closing = token.children.findIndex((candidate, offset) => offset > index && candidate.type === 'link_close');
      if (closing < 0) continue;
      child.type = 'text';
      child.content = '';
      token.children[closing].type = 'text';
      token.children[closing].content = '';
    }
  }
  if (tokens[0]?.type !== 'heading_open' || tokens[0].tag !== 'h1') {
    throw new Error(`Missing title in skills/${slug}/SKILL.md`);
  }
  const title = tokens[1].content;
  tokens.splice(0, 3);
  const description = data.description.trim();
  const indexSummary = description.length < 110 ? description : (description.match(/^.*?[.!?](?=\s|$)/s)?.[0] ?? description);
  let summary = indexSummary;
  if (tokens[0]?.type === 'paragraph_open' && tokens[1].content.length <= 180) {
    summary = tokens[1].content;
    tokens.splice(0, 3);
  }
  return { slug, title, summary, indexSummary, description, tokens };
}

function layout({ title, description, path, content, type = '', noindex = false }) {
  const pageTitle = `${title} — Agent Skills`;
  const desc = description.replace(/\s+/g, ' ').slice(0, 200);
  const canonical = absolute(path);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>${escape(pageTitle)}</title>
  <meta name="description" content="${escape(desc)}">
  ${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(pageTitle)}">
  <meta property="og:description" content="${escape(desc)}">
  <meta property="og:url" content="${canonical}">
  <link rel="stylesheet" href="${base}assets/style.css">
  <script>try{let t=localStorage.getItem('skills-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch{}</script>
  <script src="${base}assets/site.js" defer></script>
</head>
<body class="${type}">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="masthead">
    <div class="masthead-inner">
      <a class="wordmark" href="${base}" aria-label="Skills home">SKILLS<span class="wordmark-period">.</span></a>
      <div class="header-actions">
${type === 'skill-page' ? '        <button class="menu-toggle" type="button" aria-label="Open skill navigation" aria-expanded="false" aria-controls="skill-sidebar"><span></span><span></span></button>\n' : ''}        <a class="github-link" href="${repository}">GitHub <span aria-hidden="true">↗</span></a>
        <label class="theme-control"><span class="visually-hidden">Color theme</span><select aria-label="Color theme"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label>
      </div>
    </div>
  </header>
  ${content}
</body>
</html>`;
}

function sidebar(groups, current) {
  return `<aside class="sidebar" id="skill-sidebar" aria-label="Skill navigation">
    <div class="sidebar-inner"><a class="sidebar-home" href="${base}">All skills <span aria-hidden="true">↗</span></a>
      <nav aria-label="Browse skills">${groups.map(group => `
        <div class="nav-group"><h2>${escape(group.title)}</h2>
          <ul>${group.skills.map(skill => `<li><a href="${skillUrl(skill.slug)}"${skill.slug === current ? ' aria-current="page"' : ''}>${escape(skill.title)}</a></li>`).join('')}</ul>
        </div>`).join('')}
      </nav>
    </div>
  </aside>`;
}

function installRail(slug) {
  const command = `npx skills add ${repoSlug}${slug ? ` --skill ${slug}` : ''}`;
  return `<div class="install-rail"><p class="install-label">Install</p>
        <div class="install-command"><code>${escape(command)}</code><button class="copy-button" type="button" data-copy>Copy</button></div>
        <p class="visually-hidden" role="status"></p>
      </div>`;
}

function requirementList(slug) {
  const items = requirements[slug];
  if (!items) return '';
  return `<section class="requirements" aria-label="Requirements"><p class="requirements-label">Requirements</p>
          <ul class="requirement-list">${items.map(item => `<li><p><span class="requirement-name">${escape(item.name)}</span> <span class="requirement-note">${escape(item.note)}</span></p>${item.command ? `<code>${escape(item.command)}</code>` : ''}</li>`).join('')}</ul>
        </section>`;
}

function home(groups, count) {
  const content = `<main id="main" class="home">
    <div class="home-intro"><p class="eyebrow">THE LIBRARY <span aria-hidden="true">/</span> ${String(count).padStart(2, '0')}</p>
      <h1>Reusable skills<br>for AI agents<span class="title-period">.</span></h1>
      <p class="home-description">A collection of custom agent skills. Browse the library, read how each skill works, and go to the source when you need the full files.</p>
      <p class="home-count">${count} skills <span aria-hidden="true">·</span> ${groups.length} groups</p>
      ${installRail()}
    </div>
    <div class="index-heading"><h2>Explore the skills</h2><span>${String(count).padStart(2, '0')} / ${String(count).padStart(2, '0')}</span></div>
    <div class="skill-index">${groups.map(group => `
      <section class="index-group" aria-labelledby="group-${group.skills[0].slug}">
        <h3 id="group-${group.skills[0].slug}">${escape(group.title)}</h3>
        <div class="index-rows">${group.skills.map(skill => `<a class="skill-row" href="${skillUrl(skill.slug)}"><span class="row-copy"><strong>${escape(skill.title)}</strong><span>${escape(skill.indexSummary)}</span></span><span class="row-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>
      </section>`).join('')}
    </div>
    <footer class="home-footer"><span>Open source, made to be used.</span><a href="${repository}">View on GitHub ↗</a></footer>
  </main>`;
  return layout({ title: 'Skills', description: 'Browse the custom agent skills in yadav-prakhar/skills.', path: base, content, type: 'home-page' });
}

function detail(skill, groups, all, index, files) {
  const prev = all[index - 1];
  const next = all[index + 1];
  const env = { slug: skill.slug, files, headings: new Map() };
  const category = groups.find(group => group.skills.includes(skill)).title;
  const content = `<div class="doc-shell">
    ${sidebar(groups, skill.slug)}
    <button class="nav-scrim" type="button" aria-label="Close skill navigation" hidden></button>
    <main id="main" class="doc-main">
      <article>
        <header class="doc-intro"><p class="breadcrumb"><a href="${base}">Skills</a><span aria-hidden="true">/</span>${escape(category)}<span aria-hidden="true">/</span>${escape(skill.title)}</p>
          <h1>${escape(skill.title)}</h1>
          <p class="doc-lede">${md.renderInline(skill.summary, env)}</p>
          ${installRail(skill.slug)}${requirementList(skill.slug)}
        </header>
        <div class="prose">${md.renderer.render(skill.tokens, md.options, env)}</div>
        ${credits[skill.slug] ? `<section class="source-section" aria-labelledby="attribution-title"><h2 id="attribution-title">Attribution</h2><p>${md.renderInline(credits[skill.slug])}</p></section>\n        ` : ''}<section class="source-section" aria-labelledby="source-title"><h2 id="source-title">Source</h2><p>This page is generated from the repository skill file.</p>
          <a href="${sourceRoot}skills/${skill.slug}/SKILL.md">View SKILL.md on GitHub <span aria-hidden="true">↗</span></a>
        </section>
        <nav class="page-turn" aria-label="Adjacent skills">
          ${prev ? `<a href="${skillUrl(prev.slug)}" rel="prev"><span>← Previous</span><strong>${escape(prev.title)}</strong></a>` : '<span></span>'}
          ${next ? `<a href="${skillUrl(next.slug)}" rel="next"><span>Next →</span><strong>${escape(next.title)}</strong></a>` : '<span></span>'}
        </nav>
      </article>
    </main>
  </div>`;
  return layout({ title: skill.title, description: skill.description, path: skillUrl(skill.slug), content, type: 'skill-page' });
}

async function main() {
  const entries = await readdir(skillsDir, { withFileTypes: true });
  const slugs = entries.filter(entry => entry.isDirectory() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)).map(entry => entry.name).sort();
  const skills = [];
  const files = new Set();
  for (const slug of slugs) {
    const directory = join(skillsDir, slug);
    const children = await readdir(directory, { recursive: true, withFileTypes: true });
    for (const child of children) {
      if (child.isFile()) files.add(posix.join('skills', slug, child.parentPath.slice(directory.length + 1), child.name));
    }
    let source;
    try { source = await readFile(join(directory, 'SKILL.md'), 'utf8'); } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    skills.push(parseSkill(source, slug));
  }
  if (!skills.length) throw new Error('No skills found under skills/*/SKILL.md');
  const config = JSON.parse(await readFile(join(root, 'skills.sh.json'), 'utf8'));
  const bySlug = new Map(skills.map(skill => [skill.slug, skill]));
  for (const slug of Object.keys(requirements)) {
    if (!bySlug.has(slug)) throw new Error(`Requirements listed for unknown skill: ${slug}`);
  }
  const assigned = new Set();
  const groups = config.groupings.map(group => {
    const members = group.skills.map(slug => {
      if (!bySlug.has(slug) || assigned.has(slug)) throw new Error(`Invalid or duplicate grouped skill: ${slug}`);
      assigned.add(slug);
      return bySlug.get(slug);
    });
    return { title: group.title, skills: members };
  }).filter(group => group.skills.length);
  const remaining = skills.filter(skill => !assigned.has(skill.slug));
  if (remaining.length) groups.push({ title: 'More skills', skills: remaining });
  const all = groups.flatMap(group => group.skills);
  await mkdir(join(output, 'assets'), { recursive: true });
  await copyFile(join(root, 'site/style.css'), join(output, 'assets/style.css'));
  await copyFile(join(root, 'site/site.js'), join(output, 'assets/site.js'));
  await writeFile(join(output, '.nojekyll'), '');
  await writeFile(join(output, 'index.html'), home(groups, all.length));
  await writeFile(join(output, '404.html'), layout({ title: 'Page not found', description: 'This skill does not exist.', path: base, noindex: true, type: 'not-found-page', content: `<main id="main" class="not-found"><p class="eyebrow">404 / NOT FOUND</p><h1>This skill doesn’t exist.</h1><p>The page you’re looking for isn’t in this library.</p><a href="${base}">← Back to skills</a></main>` }));
  for (const [index, skill] of all.entries()) {
    const destination = join(output, 'skills', skill.slug);
    await mkdir(destination, { recursive: true });
    await writeFile(join(destination, 'index.html'), detail(skill, groups, all, index, files));
  }
  await writeFile(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[base, ...all.map(skill => skillUrl(skill.slug))].map(path => `<url><loc>${absolute(path)}</loc></url>`).join('')}</urlset>\n`);
  console.log(`Built ${all.length} skills into docs/`);
}

await main();

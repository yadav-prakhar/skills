import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
execFileSync(process.execPath, ['site/build.mjs'], { cwd: root });
const docs = join(root, 'docs');
const read = path => readFileSync(join(docs, path), 'utf8');
const slugs = readdirSync(join(root, 'skills')).filter(slug => {
  try { return statSync(join(root, 'skills', slug, 'SKILL.md')).isFile(); } catch { return false; }
});
const groups = JSON.parse(readFileSync(join(root, 'skills.sh.json'), 'utf8')).groupings;
const pages = ['index.html', '404.html', ...slugs.map(slug => `skills/${slug}/index.html`)];

for (const slug of slugs) {
  test(`${slug} has its own readable, source-linked page`, () => {
    const page = read(`skills/${slug}/index.html`);
    assert.match(page, /<h1>[^<]+<\/h1>/);
    assert.match(page, /<div class="prose">[\s\S]*<h2/);
    assert.match(page, new RegExp(`https://github\\.com/yadav-prakhar/skills/blob/docs/skills/${slug}/SKILL\\.md`));
    assert.match(page, new RegExp(`<a href="/skills/skills/${slug}/" aria-current="page"`));
    for (const other of slugs) assert.match(page, new RegExp(`href="/skills/skills/${other}/"`));
    assert.doesNotMatch(page, /hermes-backup|href="https:\/\/github\.com\/acme\//);
    assert.match(page, /<meta name="description" content="[^"]+">/);
    assert.match(page, new RegExp(`<link rel="canonical" href="https://yadav-prakhar\\.github\\.io/skills/skills/${slug}/">`));
  });
}

test('homepage lists each published skill once in the repository grouping order', () => {
  const page = read('index.html');
  for (const slug of slugs) {
    assert.equal(page.split(`class="skill-row" href="/skills/skills/${slug}/"`).length - 1, 1);
  }
  let offset = 0;
  for (const group of groups) {
    const position = page.indexOf(`>${group.title}</h3>`, offset);
    assert.ok(position > offset, group.title);
    offset = position;
  }
  assert.doesNotMatch(page, /hermes-backup/);
  assert.doesNotMatch(page, /<div class="prose">/);
});

test('every page offers its copyable install command', () => {
  const homepage = read('index.html');
  assert.equal(homepage.split('class="install-rail"').length - 1, 1);
  assert.match(homepage, /<code>npx skills add yadav-prakhar\/skills<\/code>/);
  assert.match(homepage, /<button class="copy-button" type="button" data-copy>Copy<\/button>/);
  for (const slug of slugs) {
    const page = read(`skills/${slug}/index.html`);
    assert.equal(page.split('class="install-rail"').length - 1, 1);
    assert.match(page, new RegExp(`<code>npx skills add yadav-prakhar/skills --skill ${slug}</code>`));
    assert.match(page, /<button class="copy-button" type="button" data-copy>Copy<\/button>/);
  }
});

test('adjacent navigation covers the complete ordered index', () => {
  const ordered = groups.flatMap(group => group.skills);
  for (const [index, slug] of ordered.entries()) {
    const page = read(`skills/${slug}/index.html`);
    const previous = page.match(/<a href="\/skills\/skills\/([^/]+)\/" rel="prev">/);
    const next = page.match(/<a href="\/skills\/skills\/([^/]+)\/" rel="next">/);
    assert.equal(previous?.[1], ordered[index - 1]);
    assert.equal(next?.[1], ordered[index + 1]);
  }
});

test('internal links, assets and fragment targets resolve to built pages', () => {
  for (const filename of pages) {
    const page = read(filename);
    const ids = new Set([...page.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
    for (const [, href] of page.matchAll(/\bhref="([^"]+)"/g)) {
      if (href.startsWith('#')) {
        assert.ok(ids.has(href.slice(1)), `${filename}: ${href}`);
      } else if (href.startsWith('/skills/')) {
        const target = href.slice('/skills/'.length);
        const file = !target || target.endsWith('/') ? `${target}index.html` : target;
        assert.ok(statSync(join(docs, file)).isFile(), `${filename}: ${href}`);
      }
    }
    assert.match(page, /<meta property="og:title"/);
  }
  for (const asset of ['assets/style.css', 'assets/site.js', '.nojekyll', 'sitemap.xml']) {
    assert.ok(statSync(join(docs, asset)).isFile(), asset);
  }
  assert.match(read('404.html'), /<meta name="robots" content="noindex">/);
});

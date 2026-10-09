#!/usr/bin/env node
// Build a printable A4 book from HTML chapter fragments.
//
//   node build_book.mjs --src <fragments-dir> --out <output-dir> --title "Book title"
//                       [--compact] [--resolve-from <dir containing node_modules with playwright>]
//
// --compact: chapters flow on from the previous page instead of starting a new one, and
// exercises/answers are set tighter. Use it for short books (under ~20 pages).
//
// Fragments: every file in --src named NN-something.html (two digits first), joined in
// name order. If --src has 00-head.html it is used as the document head, otherwise the
// skill's assets/head.html. Images are referenced relative to --out (put them in out/img/).
//
// Chapters are <section class="chapter" data-id="ch3" data-title="3. Title"> and parts are
// <section class="part" data-id="p1" data-title="Part I · Name">. A literal <!--TOC--> in
// any fragment is replaced with the table of contents.
//
// Page numbers: pass 1 renders the PDF, scripts/locate_pages.py finds the invisible
// @@id@@ marker injected into each section, pass 2 re-renders with the numbers. Needs
// python3 + PyMuPDF (pip install pymupdf); without it the TOC has no page numbers.
//
// Exit code 1 when any <img> fails to load, so a broken image never reaches paper.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const arg = (name, def) => {
	const i = process.argv.indexOf(`--${name}`);
	return i > -1 ? process.argv[i + 1] : def;
};
const SRC = resolve(arg('src', '.'));
const OUT = resolve(arg('out', '.'));
const TITLE = arg('title', 'Study Book');
const RESOLVE_FROM = resolve(arg('resolve-from', process.cwd()));
const COMPACT = process.argv.includes('--compact');

function loadChromium() {
	const req = createRequire(join(RESOLVE_FROM, 'package.json'));
	for (const mod of ['playwright', '@playwright/test', 'playwright-core']) {
		try {
			return req(mod).chromium;
		} catch {}
	}
	console.error(
		'Playwright not found. Either pass --resolve-from <a project that has playwright installed>,\n' +
			'or create one:  mkdir -p /tmp/pw && cd /tmp/pw && npm init -y && npm i playwright && npx playwright install chromium\n' +
			'then re-run with --resolve-from /tmp/pw'
	);
	process.exit(2);
}

const headPath = existsSync(join(SRC, '00-head.html')) ? join(SRC, '00-head.html') : join(here, '../assets/head.html');
const head = readFileSync(headPath, 'utf8').replaceAll('{{TITLE}}', TITLE);
const parts = readdirSync(SRC).filter((f) => /^\d\d-.*\.html$/.test(f) && f !== '00-head.html').sort();
if (parts.length === 0) {
	console.error(`No NN-*.html fragments in ${SRC}`);
	process.exit(2);
}
const SECTION = /<section class="(part|chapter)[^"]*"[^>]*data-id="([^"]+)"[^>]*data-title="([^"]+)"[^>]*>/g;

const ANY_SECTION = /<section class="(?:part|chapter)[^"]*"[^>]*>/g;

function assemble(toc) {
	let body = parts.map((f) => readFileSync(join(SRC, f), 'utf8')).join('\n');
	const items = [];
	const hits = [...body.matchAll(SECTION)];
	// Insert each page marker at the end of the section's first <h1> (or after the tag if there is
	// none), so the marker always prints on the same page as the visible heading.
	let out = '';
	let cursor = 0;
	hits.forEach((m, i) => {
		const [tag, kind, id, title] = m;
		items.push(
			kind === 'part'
				? `<li class="p"><span class="t">${title}</span></li>`
				: `<li class="ch"><span class="t">${title}</span><span class="d"></span><span class="n">${toc[id] ?? ''}</span></li>`
		);
		const end = m.index + tag.length;
		const limit = i + 1 < hits.length ? hits[i + 1].index : body.length;
		const close = body.slice(end, limit).indexOf('</h1>');
		const at = close > -1 ? end + close : end; // just before </h1>: no visible indent
		out += body.slice(cursor, at) + `<span class="pm">@@${id}@@</span>`;
		cursor = at;
	});
	body = (out + body.slice(cursor)).replace('<!--TOC-->', `<ol>${items.join('\n')}</ol>`);
	return `${COMPACT ? head.replace('<body>', '<body class="compact">') : head}${body}\n</body>\n</html>\n`;
}

async function render(chromium, html) {
	mkdirSync(OUT, { recursive: true });
	const htmlPath = join(OUT, 'book.html');
	writeFileSync(htmlPath, html);
	const browser = await chromium.launch();
	const page = await browser.newPage();
	await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
	const broken = await page.evaluate(() =>
		[...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src'))
	);
	await page.pdf({
		path: join(OUT, 'book.pdf'),
		preferCSSPageSize: true,
		printBackground: true,
		displayHeaderFooter: true,
		headerTemplate: '<div></div>',
		footerTemplate:
			'<div style="width:100%;font-family:Helvetica,Arial,sans-serif;font-size:7.5pt;color:#555;' +
			'padding:0 30mm 0 18mm;display:flex;justify-content:space-between;">' +
			`<span>${TITLE.replace(/</g, '&lt;')}</span><span class="pageNumber"></span></div>`,
	});
	await browser.close();
	return broken;
}

function locate() {
	const r = spawnSync('python3', [join(here, 'locate_pages.py'), join(OUT, 'book.pdf')], { encoding: 'utf8' });
	if (r.status !== 0) {
		console.warn(`[toc] page numbers skipped: ${(r.stderr || r.error?.message || '').trim().split('\n').pop()}`);
		return null;
	}
	return JSON.parse(r.stdout);
}

const chromium = loadChromium();
let toc = {};
let broken = await render(chromium, assemble(toc));
const found = locate();
if (found) {
	toc = found;
	broken = await render(chromium, assemble(toc));
	const again = locate();
	// Numbers can shift if pass 2 changed the TOC's own length; one more pass settles it.
	if (again && JSON.stringify(again) !== JSON.stringify(toc)) broken = await render(chromium, assemble((toc = again)));
}
const missing = [...assemble({}).matchAll(SECTION)].map((m) => m[2]).filter((id) => found && !(id in toc));
const untitled = parts.flatMap((f) =>
	[...readFileSync(join(SRC, f), 'utf8').matchAll(ANY_SECTION)]
		.filter((m) => !/data-id="[^"]+"[^>]*data-title="[^"]+"/.test(m[0]))
		.map((m) => `${f}: ${m[0]}`)
);
if (untitled.length) console.warn(`[toc] sections without data-id + data-title (not in contents):\n  ${untitled.join('\n  ')}`);
console.log(`built ${parts.length} fragments -> ${join(OUT, 'book.pdf')}`);
console.log(`toc: ${JSON.stringify(toc)}`);
if (missing.length) console.warn(`[toc] no page found for: ${missing.join(', ')}`);
if (broken.length) {
	console.error(`BROKEN IMAGES (${broken.length}): ${broken.join(', ')}`);
	process.exit(1);
}

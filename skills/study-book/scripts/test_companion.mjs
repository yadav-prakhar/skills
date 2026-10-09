#!/usr/bin/env node
// Smoke-test an interactive companion page in headless Chromium.
//
//   node test_companion.mjs --file companion.html --out qa/ [--click "#next" --click ".opt"]...
//                           [--repeat 3] [--select '#sim-mode=serial']...
//                           [--resolve-from <dir with playwright in node_modules>]
//
// Loads the page, clicks the first match of every --click selector in order (--repeat times
// each, default 1; use 3+ to walk a stepper), sets every --select (css=value) and prints the
// page's visible text of each section afterwards, and fails (exit 1) on any page error, console error, or horizontal overflow
// at phone width (375 px). Saves desktop and phone screenshots to --out so you can look at
// them. Passing this is necessary, not sufficient: also read what each widget SAYS after you
// interact, because a demo can run without errors and still teach nothing (e.g. a "random"
// example that happens to repeat).
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const argv = process.argv;
const one = (n, d) => (argv.includes(`--${n}`) ? argv[argv.indexOf(`--${n}`) + 1] : d);
const many = (n) => argv.flatMap((a, i) => (a === `--${n}` ? [argv[i + 1]] : []));
const FILE = resolve(one('file', 'companion.html'));
const REPEAT = Number(one('repeat', 1));
const OUT = resolve(one('out', 'qa'));
const req = createRequire(join(resolve(one('resolve-from', process.cwd())), 'package.json'));
let chromium;
for (const m of ['playwright', '@playwright/test', 'playwright-core']) {
	try { chromium = req(m).chromium; break; } catch {}
}
if (!chromium) {
	console.error('Playwright not found; pass --resolve-from (see build_book.mjs for a one-line setup).');
	process.exit(2);
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));
page.on('requestfailed', (r) => errors.push(`request failed: ${r.url()}`));
await page.goto(pathToFileURL(FILE).href, { waitUntil: 'load' });

for (const sel of many('click')) {
	const loc = page.locator(sel).first();
	if ((await loc.count()) === 0) { errors.push(`selector not found: ${sel}`); continue; }
	for (let i = 0; i < REPEAT; i++) await loc.click({ timeout: 3000 }).catch((e) => errors.push(`click ${sel}: ${e.message.split('\n')[0]}`));
}
for (const spec of many('select')) {
	const at = spec.lastIndexOf('=');
	const [sel, value] = [spec.slice(0, at), spec.slice(at + 1)];
	await page.selectOption(sel, value, { timeout: 3000 }).catch((e) => errors.push(`select ${spec}: ${e.message.split('\n')[0]}`));
}
// Print what each panel now SAYS: a demo that runs cleanly can still teach nothing.
const said = await page.$$eval('section', (els) => els.map((s) => `#${s.id}: ${s.innerText.replace(/\s+/g, ' ').slice(0, 300)}`));
console.log(said.join('\n'));
await page.screenshot({ path: join(OUT, 'companion-desktop.png'), fullPage: true });
await page.setViewportSize({ width: 375, height: 800 });
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
await page.screenshot({ path: join(OUT, 'companion-phone.png') });
await browser.close();

if (overflow > 1) errors.push(`horizontal overflow at 375px: ${overflow}px too wide`);
console.log(`screenshots: ${join(OUT, 'companion-desktop.png')}, ${join(OUT, 'companion-phone.png')}`);
if (errors.length) {
	console.error(errors.join('\n'));
	process.exit(1);
}
console.log('companion OK: no errors, no phone-width overflow');

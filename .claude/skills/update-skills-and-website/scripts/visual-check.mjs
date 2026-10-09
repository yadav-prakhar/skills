// Captures one built site page at the widths and themes the design guide is checked at, and fails on layout problems.
// Usage: node visual-check.mjs <page-url> <out-dir>
// Run it from a scratch folder that has playwright-core installed, not from the repo.
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';

const [url, out] = process.argv.slice(2);
if (!url || !out) throw new Error('usage: node visual-check.mjs <page-url> <out-dir>');
mkdirSync(out, { recursive: true });

const cases = [
  { name: 'desktop-light', width: 1280, scheme: 'light' },
  { name: 'desktop-dark', width: 1280, scheme: 'dark' },
  { name: 'phone-375-dark', width: 375, scheme: 'dark' },
  { name: 'phone-320-light', width: 320, scheme: 'light' },
];
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});

let failed = false;
for (const c of cases) {
  const context = await browser.newContext({ viewport: { width: c.width, height: 900 }, colorScheme: c.scheme, deviceScaleFactor: 2 });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });

  await page.goto(url, { waitUntil: 'networkidle' });
  const metrics = await page.evaluate(() => ({
    overflowPx: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    installRails: document.querySelectorAll('.install-rail').length,
  }));
  await page.screenshot({ path: `${out}/${c.name}.png` });

  const problems = [];
  if (metrics.overflowPx > 0) problems.push(`page scrolls horizontally by ${metrics.overflowPx}px`);
  if (metrics.installRails !== 1) problems.push(`expected 1 install rail, found ${metrics.installRails}`);
  if (pageErrors.length) problems.push(`page errors: ${pageErrors.join('; ')}`);
  if (problems.length) failed = true;
  console.log(`${c.name}: ${problems.length ? 'FAIL ' + problems.join(' | ') : 'ok'}`);
  if (consoleErrors.length) console.log(`  console errors (review): ${consoleErrors.join(' | ')}`);
  await context.close();
}

await browser.close();
if (failed) process.exitCode = 1;

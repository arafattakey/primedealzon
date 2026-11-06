// Tells Bing, Yandex, Seznam, Naver and others (via IndexNow) that pages changed, so they're crawled within hours.
// Bing's index also feeds ChatGPT search, Copilot and DuckDuckGo. Google does not use IndexNow (use Search Console).
// Usage (after the deploy is live):
//   node tools/indexnow.mjs <slug> [<slug> ...]   specific posts (+ blog and home pages)
//   node tools/indexnow.mjs --all                 every URL in sitemap.xml
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ctx = vm.createContext({});
vm.runInContext(readFileSync(join(root, 'js/data.js'), 'utf8'), ctx);
const SITE = vm.runInContext('SITE', ctx);
const base = SITE.url.endsWith('/') ? SITE.url : SITE.url + '/';
const keyFile = readdirSync(root).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) { console.error('No IndexNow key file (<32 hex>.txt) at the repo root.'); process.exit(1); }
const key = keyFile.slice(0, 32);

const args = process.argv.slice(2);
let urls;
if (args.includes('--all')) {
  urls = [...readFileSync(join(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
} else if (args.length) {
  urls = [...args.map((s) => `${base}guides/${s}/`), base, `${base}blog.html`];
} else {
  console.error('Pass post slugs or --all'); process.exit(1);
}

const body = { host: new URL(base).host, key, keyLocation: `${base}${keyFile}`, urlList: urls.slice(0, 10000) };
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body),
});
// 200 = accepted, 202 = accepted (key validation pending), 4xx = problem
console.log(`IndexNow HTTP ${res.status} for ${urls.length} URL(s)`);
if (res.status >= 400) { console.error(await res.text()); process.exit(1); }

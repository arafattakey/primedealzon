// Generates share images for every post with headless Edge/Chrome (no npm dependencies):
//   images/pins/<slug>.png  1000x1500 Pinterest pin
//   images/og/<slug>.png    1200x630  Open Graph / social preview (used by build.mjs as og:image)
//   pins.csv                Pinterest bulk-upload file (Create > Bulk create Pins), images hosted on our site
// Usage: node tools/images.mjs            only posts missing images
//        node tools/images.mjs --force    regenerate all
//        node tools/images.mjs <slug>     one post
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.find((a) => !a.startsWith('--'));

const BROWSERS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
];
const browser = BROWSERS.find(existsSync);
if (!browser) { console.error('No Edge/Chrome found'); process.exit(1); }

const ctx = vm.createContext({});
vm.runInContext(readFileSync(join(root, 'js/data.js'), 'utf8'), ctx);
const { SITE, CATEGORIES } = vm.runInContext('({ SITE, CATEGORIES })', ctx);
const host = new URL(SITE.url).host.replace(/^www\./, '');
const brand = host.endsWith('github.io') ? 'PrimeDealZon' : host;

const posts = readdirSync(join(root, 'content/posts')).filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(root, 'content/posts', f), 'utf8')));

const TYPE = {
  guide: { label: 'Buying guide', bg: '#f6e7d4', ink: '#4a2a12', accent: '#e8890c' },
  review: { label: 'Owner-review roundup', bg: '#e7efe6', ink: '#1f3b2a', accent: '#2f8f5b' },
  compare: { label: 'Head to head', bg: '#e6ebf5', ink: '#1d2b4a', accent: '#3d63c9' },
  howto: { label: 'How-to', bg: '#f5e6ea', ink: '#4a1d2b', accent: '#c2405f' },
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const CUP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3M12 3v3"/></svg>';

function html(post, w, h) {
  const t = TYPE[post.type] || TYPE.guide;
  const cat = CATEGORIES.find((c) => c.id === post.cat)?.name || '';
  const pin = h > w;
  const len = post.title.length;
  const size = pin ? (len > 55 ? 76 : len > 40 ? 86 : 96) : (len > 55 ? 56 : len > 40 ? 62 : 70);
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Inter:wght@500;700;800&display=block" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:${t.bg};color:${t.ink};font-family:Inter,Arial,sans-serif;display:flex;flex-direction:column;padding:${pin ? '90px 80px' : '60px 70px'};position:relative}
.cup{position:absolute;right:${pin ? -60 : -30}px;bottom:${pin ? 120 : -40}px;width:${pin ? 620 : 380}px;height:${pin ? 620 : 380}px;color:${t.accent};opacity:.18}
.tag{display:inline-block;align-self:flex-start;background:${t.ink};color:${t.bg};font-weight:800;font-size:${pin ? 30 : 24}px;letter-spacing:.08em;text-transform:uppercase;padding:${pin ? '14px 26px' : '10px 20px'};border-radius:999px}
h1{font-family:Fraunces,Georgia,serif;font-weight:700;font-size:${size}px;line-height:1.08;margin-top:${pin ? 70 : 34}px;position:relative}
.sub{font-size:${pin ? 36 : 26}px;font-weight:500;line-height:1.4;margin-top:${pin ? 44 : 22}px;max-width:${pin ? 820 : 900}px;opacity:.85;position:relative}
.foot{margin-top:auto;display:flex;align-items:center;gap:18px;font-weight:800;font-size:${pin ? 38 : 28}px;position:relative}
.dot{width:${pin ? 56 : 44}px;height:${pin ? 56 : 44}px;border-radius:14px;background:${t.ink};display:grid;place-items:center;color:${t.accent};font-size:${pin ? 34 : 26}px}
.foot span:last-child{font-weight:600;opacity:.75;margin-left:auto;font-size:${pin ? 30 : 22}px}
</style></head><body>
<div class="cup">${CUP}</div>
<div class="tag">${esc(post.label || `${t.label} · ${cat}`)}</div>
<h1>${esc(post.title)}</h1>
${pin ? `<p class="sub">${esc(post.excerpt)}</p>` : ''}
<div class="foot"><div class="dot">⚡</div><span>${esc(brand)}</span>${pin ? '<span>Read more →</span>' : ''}</div>
</body></html>`;
}

// Edge can hand the job to a background process and return early, so wait for the file itself.
function waitFor(file, ms = 45000) {
  const end = Date.now() + ms;
  while (!existsSync(file) && Date.now() < end) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
  if (!existsSync(file)) { console.error(`Image was not written: ${file}`); process.exit(1); }
}

function render(post, kind, w, h) {
  const dir = join(root, 'images', kind);
  mkdirSync(dir, { recursive: true });
  const out = join(dir, `${post.slug}.png`);
  if (existsSync(out) && !force && !only) return false;
  rmSync(out, { force: true });
  const tmp = join(tmpdir(), `pdz-img-${process.pid}`);
  mkdirSync(tmp, { recursive: true });
  const src = join(tmp, `${post.slug}-${kind}.html`);
  writeFileSync(src, html(post, w, h));
  execFileSync(browser, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    `--user-data-dir=${join(tmp, 'profile')}`, `--window-size=${w},${h}`, '--virtual-time-budget=6000',
    `--screenshot=${out}`, pathToFileURL(src).href,
  ], { stdio: 'ignore', timeout: 60000 });
  waitFor(out);
  return true;
}

let made = 0;
for (const post of posts) {
  if (only && post.slug !== only) continue;
  if (render(post, 'pins', 1000, 1500)) made++;
  if (render(post, 'og', 1200, 630)) made++;
}
// Site-wide social image (home, blog, category hubs) and app icons.
if (!only || only === 'site') {
  const site = { slug: 'site', type: 'guide', cat: 'coffee', label: 'Coffee gear, explained',
    title: 'Better coffee at home, without the endless scrolling', excerpt: '' };
  if (render(site, 'og', 1200, 630)) made++;
  const touch = join(root, 'apple-touch-icon.png');
  if (!existsSync(touch) || force) {
    const tmp = join(tmpdir(), `pdz-img-${process.pid}`);
    mkdirSync(tmp, { recursive: true });
    const svg = readFileSync(join(root, 'favicon.svg'), 'utf8');
    const src = join(tmp, 'icon.html');
    writeFileSync(src, `<!doctype html><html><head><style>*{margin:0}html,body{width:180px;height:180px;overflow:hidden;background:#15161a}svg{width:180px;height:180px;display:block}</style></head><body>${svg}</body></html>`);
    execFileSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
      `--user-data-dir=${join(tmp, 'profile')}`, '--window-size=180,180', `--screenshot=${touch}`, pathToFileURL(src).href],
      { stdio: 'ignore', timeout: 60000 });
    waitFor(touch);
    // favicon.ico holding the PNG (valid ICO with an embedded PNG image).
    const png = readFileSync(touch);
    const head = Buffer.alloc(22);
    head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
    head.writeUInt8(180, 6); head.writeUInt8(180, 7); head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12);
    head.writeUInt32LE(png.length, 14); head.writeUInt32LE(22, 18);
    writeFileSync(join(root, 'favicon.ico'), Buffer.concat([head, png]));
    made++;
  }
}
try { rmSync(join(tmpdir(), `pdz-img-${process.pid}`), { recursive: true, force: true }); } catch { /* the browser may still hold its profile; the OS cleans temp */ }

// Pinterest bulk-upload CSV (newest first). Board name must exist on the Pinterest account.
const base = SITE.url.endsWith('/') ? SITE.url : SITE.url + '/';
const csvq = (s) => `"${String(s).replace(/"/g, '""')}"`;
const rows = posts.filter((p) => p.cat === 'coffee').sort((a, b) => b.date.localeCompare(a.date)).map((p) => [
  p.title.slice(0, 100), `${base}images/pins/${p.slug}.png`, 'Coffee Gear & Brewing Tips', '',
  p.excerpt.slice(0, 500), `${base}guides/${p.slug}/`, '', p.keyword,
].map(csvq).join(','));
writeFileSync(join(root, 'pins.csv'), ['Title,Media URL,Pinterest board,Thumbnail,Description,Link,Publish date,Keywords', ...rows].join('\n') + '\n');
console.log(`Rendered ${made} image(s) with ${browser.split('/').pop()}; pins.csv has ${rows.length} pins.`);

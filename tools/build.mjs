// Builds the static, indexable parts of the site:
//   guides/<slug>/index.html  one page per post in content/posts/<slug>.json
//   js/posts-index.js         lightweight post list (no bodies) used by the browser
//   sitemap.xml, robots.txt
// Run:  node tools/build.mjs            (no dependencies)
//       node tools/build.mjs --check    validate only, write nothing
// The build FAILS on invalid posts or Amazon-policy problems, so a broken post can never be published.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

// 1. Load site data (SITE, CATEGORIES, PRODUCTS)
const ctx = vm.createContext({ URLSearchParams });
vm.runInContext(readFileSync(join(root, 'js/data.js'), 'utf8'), ctx, { filename: 'js/data.js' });
const { SITE, CATEGORIES, PRODUCTS } = vm.runInContext('({ SITE, CATEGORIES, PRODUCTS })', ctx);
const asins = new Set();
for (const p of PRODUCTS) {
  if (!/^[A-Z0-9]{10}$/.test(p.asin)) fail('data.js', `bad ASIN ${p.asin}`);
  if (asins.has(p.asin)) fail('data.js', `duplicate ASIN ${p.asin}`);
  asins.add(p.asin);
  if (!CATEGORIES.some((c) => c.id === p.cat)) fail('data.js', `${p.asin} has unknown cat ${p.cat}`);
}

// 2. Load and validate posts
const TYPES = ['guide', 'review', 'compare', 'howto'];
const BLOCKS = ['h', 'p', 'ul', 'product', 'pros', 'cons', 'table', 'faq', 'tip', 'related'];
// Amazon Associates policy guards: no prices, no star ratings, no review counts in our own text.
const POLICY = [
  [/\$\s?\d/, 'mentions a price', (s) => !/\bunder \$\d+\b/i.test(s) || /\$\s?\d+\.\d\d/.test(s)],
  [/\b\d(\.\d)?\s*(out of 5|\/\s*5)\b/i, 'mentions a star rating'],
  [/\b\d(\.\d)?[- ]stars?\b/i, 'mentions a star rating'],
  [/\b\d[\d,.]*\s*k?\+?\s*(customer |verified |amazon )?(ratings|reviews|reviewers)\b/i, 'mentions a review/rating count'],
  [/\b\d[\d,.]*\s*k?\+?\s*bought\b/i, 'mentions Amazon sales figures'],
];
const lint = (where, text) => {
  for (const [re, msg, extra] of POLICY) if (re.test(text) && (!extra || extra(text))) fail(where, `${msg}: "${text.slice(0, 90)}"`);
};

const postsDir = join(root, 'content/posts');
const POSTS = [];
for (const file of readdirSync(postsDir).filter((f) => f.endsWith('.json')).sort()) {
  const where = `content/posts/${file}`;
  let post;
  try { post = JSON.parse(readFileSync(join(postsDir, file), 'utf8')); } catch (e) { fail(where, `invalid JSON: ${e.message}`); continue; }
  for (const k of ['slug', 'type', 'cat', 'keyword', 'title', 'excerpt', 'date', 'read', 'body']) if (!post[k]) fail(where, `missing "${k}"`);
  if (post.slug + '.json' !== file) fail(where, 'slug must match the file name');
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(post.slug || '')) fail(where, 'slug must be lowercase-with-dashes');
  if (!TYPES.includes(post.type)) fail(where, `type must be one of ${TYPES.join(', ')}`);
  if (!CATEGORIES.some((c) => c.id === post.cat)) fail(where, `unknown cat ${post.cat}`);
  for (const d of ['date', 'updated']) if (post[d] && !/^\d{4}-\d{2}-\d{2}$/.test(post[d])) fail(where, `${d} must be YYYY-MM-DD`);
  if (post.title && post.title.length > 70) fail(where, `title is ${post.title.length} chars (max 70 for search results)`);
  if (post.excerpt && (post.excerpt.length < 70 || post.excerpt.length > 170)) fail(where, `excerpt is ${post.excerpt.length} chars (want 70-170, it is the meta description)`);
  lint(where + ' title', post.title || '');
  lint(where + ' excerpt', post.excerpt || '');
  const products = [];
  let words = 0;
  (post.body || []).forEach((b, i) => {
    const at = `${where} body[${i}]`;
    const keys = Object.keys(b);
    if (keys.length !== 1 || !BLOCKS.includes(keys[0])) return fail(at, `unknown block ${JSON.stringify(keys)}`);
    const text = [];
    if (b.h) text.push(b.h);
    if (b.p) text.push(b.p);
    if (b.tip) text.push(b.tip);
    for (const k of ['ul', 'pros', 'cons']) if (b[k]) { if (!Array.isArray(b[k]) || !b[k].length) fail(at, `${k} must be a non-empty list`); else text.push(...b[k]); }
    if (b.table) {
      if (!Array.isArray(b.table.head) || !Array.isArray(b.table.rows)) fail(at, 'table needs head[] and rows[][]');
      else { text.push(...b.table.head); b.table.rows.forEach((r) => { if (r.length !== b.table.head.length) fail(at, 'table row length differs from head'); text.push(...r); }); }
    }
    if (b.faq) { if (!Array.isArray(b.faq)) fail(at, 'faq must be a list'); else b.faq.forEach((f) => { if (!f.q || !f.a) fail(at, 'faq items need q and a'); text.push(f.q, f.a); }); }
    if (b.product) { if (!asins.has(b.product)) fail(at, `product ${b.product} is not in js/data.js PRODUCTS`); else products.push(b.product); }
    text.forEach((t) => { lint(at, String(t)); words += String(t).split(/\s+/).length; });
  });
  if (post.type !== 'howto' && products.length === 0) fail(where, 'needs at least one { product } block');
  if (words < 600 && !post.legacy) fail(where, `only ${words} words; a post needs at least 600 to be genuinely useful`);
  post.products = [...new Set(products)];
  post.words = words;
  POSTS.push(post);
}
const slugs = new Set(POSTS.map((p) => p.slug));
for (const p of POSTS) for (const b of p.body || []) for (const s of b.related || []) if (!slugs.has(s)) fail(`content/posts/${p.slug}.json`, `related slug "${s}" does not exist`);
const kw = new Map();
for (const p of POSTS) { const k = p.keyword.toLowerCase().trim(); if (kw.has(k)) fail(`content/posts/${p.slug}.json`, `keyword "${k}" already targeted by ${kw.get(k)} (cannibalization)`); kw.set(k, p.slug); }

if (errors.length) {
  console.error(`BUILD FAILED (${errors.length} problem${errors.length > 1 ? 's' : ''}):\n- ` + errors.join('\n- '));
  process.exit(1);
}

// Newest first; "priority" pins seasonal posts to the top.
// Same day: coffee (the niche) before other categories.
POSTS.sort((a, b) => (b.priority || 0) - (a.priority || 0) || b.date.localeCompare(a.date) ||
  (a.cat === 'coffee' ? 0 : 1) - (b.cat === 'coffee' ? 0 : 1) || a.title.localeCompare(b.title));
if (checkOnly) { console.log(`OK: ${POSTS.length} posts, ${PRODUCTS.length} products valid.`); process.exit(0); }

// 3. Render with the same code the browser uses
vm.runInContext(`var POSTS = ${JSON.stringify(POSTS)};`, ctx);
vm.runInContext(readFileSync(join(root, 'js/site.js'), 'utf8'), ctx, { filename: 'js/site.js' });
const { guideHtml, esc, catById, postType } = vm.runInContext('({ guideHtml, esc, catById, postType })', ctx);

const base = SITE.url.endsWith('/') ? SITE.url : SITE.url + '/';
const json = (o) => JSON.stringify(o, null, 2).replace(/</g, '\\u003c');

function page(post) {
  const url = `${base}guides/${post.slug}/`;
  const c = catById(post.cat);
  const modified = post.updated || post.date;
  const title = `${post.title} – ${SITE.name}`;
  const faqs = post.body.flatMap((b) => b.faq || []);
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: modified,
      mainEntityOfPage: url,
      articleSection: postType(post).one,
      author: { '@type': 'Organization', name: `${SITE.name} team`, url: base + 'about.html' },
      publisher: { '@type': 'Organization', name: SITE.name, url: base },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: base },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: base + 'blog.html' },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
    ...(faqs.length ? [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    }] : []),
  ];
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(post.excerpt)}" />
  <link rel="canonical" href="${url}" />
  <meta name="theme-color" content="#15161a" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="${esc(SITE.name)}" />
  <meta property="og:title" content="${esc(post.title)}" />
  <meta property="og:description" content="${esc(post.excerpt)}" />
  <meta property="og:url" content="${url}" />
  <meta property="article:published_time" content="${post.date}" />
  <meta property="article:modified_time" content="${modified}" />
  <meta property="article:section" content="${esc(c.name)}" />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" href="../../favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,600&family=Inter:wght@400;500;600;700;800&display=swap" />
  <link rel="stylesheet" href="../../css/style.css" />
  <script type="application/ld+json">
${json(ld)}
  </script>
</head>
<body data-page="guide" data-root="../../">
  <!-- Generated by tools/build.mjs from content/posts/${post.slug}.json. Edit the JSON, not this file. -->
  <div class="disclosure-bar">We earn a commission from qualifying Amazon purchases made through our links, at no extra cost to you. <a href="../../disclaimer.html">Learn more</a></div>
  <header class="site-header" id="site-header"></header>

  <main id="postRoot">${guideHtml(post)}
  </main>

  <footer class="site-footer" id="site-footer"></footer>
  <script src="../../js/data.js"></script>
  <script src="../../js/posts-index.js"></script>
  <script src="../../js/site.js"></script>
</body>
</html>
`;
}

// 4. Guide pages (remove folders for posts that no longer exist)
const guidesDir = join(root, 'guides');
if (existsSync(guidesDir)) {
  for (const d of readdirSync(guidesDir, { withFileTypes: true })) {
    if (d.isDirectory() && !slugs.has(d.name)) rmSync(join(guidesDir, d.name), { recursive: true });
  }
}
for (const post of POSTS) {
  const dir = join(guidesDir, post.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(post));
}

// 5. Lightweight index for the browser (cards, blog list, category pages)
const index = POSTS.map(({ slug, type, cat, title, excerpt, date, updated, read, products }) => ({ slug, type, cat, title, excerpt, date, ...(updated ? { updated } : {}), read, products }));
writeFileSync(join(root, 'js/posts-index.js'), `/* Generated by tools/build.mjs from content/posts/*.json. Do not edit. */\nconst POSTS = ${JSON.stringify(index, null, 1)};\n`);

// 6. Sitemap + robots
const siteDate = new Date(SITE.updated).toLocaleDateString('en-CA');
const newest = POSTS.reduce((m, p) => ((p.updated || p.date) > m ? p.updated || p.date : m), siteDate);
const urls = [
  ['', newest], ['blog.html', newest], ['category.html', siteDate], ['about.html', siteDate],
  ['disclaimer.html', siteDate], ['privacy.html', siteDate],
  ...CATEGORIES.map((c) => [`category.html?cat=${c.id}`, siteDate]),
  ...POSTS.map((p) => [`guides/${p.slug}/`, p.updated || p.date]),
];
writeFileSync(join(root, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(([u, d]) => `  <url><loc>${esc(base + u)}</loc><lastmod>${d}</lastmod></url>`).join('\n') +
  '\n</urlset>\n');
writeFileSync(join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${base}sitemap.xml\n`);

console.log(`Built ${POSTS.length} posts (${POSTS.map((p) => p.words).reduce((a, b) => a + b, 0)} words), sitemap with ${urls.length} URLs.`);

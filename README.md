# PrimeDealZon

> Best Deals. Best Prices. Every Day.

Amazon affiliate site focused on coffee gear (grinders, brewers, French presses, pour-over), with hand-picked products and buying guides. Home & Kitchen, Bedding, Cookware, Storage and Cleaning remain as secondary categories. Static HTML/CSS/JS hosted on GitHub Pages. Post pages are pre-rendered by `node tools/build.mjs`, which has no dependencies.

## Live site
https://arafattakey.github.io/primedealzon/

## Structure
| File | Purpose |
| --- | --- |
| `index.html` | Homepage: hero, categories, filterable top picks, spotlight, guides |
| `category.html` | All categories, or one category via `?cat=coffee` |
| `blog.html` | Blog index, newest first, filterable by post type (`?type=review`) |
| `content/posts/<slug>.json` | **One file per blog post** (the source of truth for posts) |
| `guides/<slug>/index.html` | One static page per post, **generated** (don't edit by hand) |
| `js/posts-index.js` | Lightweight post list for the browser, **generated** |
| `blog-post.html` | Old guide URL (`?slug=...`); redirects to `guides/<slug>/` |
| `tools/build.mjs` | Validates posts, builds post pages, `js/posts-index.js`, `sitemap.xml` and `robots.txt` |
| `about.html` | How products are picked and how the site is funded |
| `disclaimer.html` / `privacy.html` | Affiliate disclosure and privacy policy |
| `404.html` | Not-found page |
| `js/data.js` | Affiliate tag, site URL, categories and products (ASINs) |
| `js/site.js` | Shared header/footer and page rendering |
| `css/style.css` | All styles |
| `sitemap.xml`, `robots.txt`, `favicon.svg` | SEO and branding |

## Affiliate tag
`primedealzo02-20` (set once in `js/data.js` → `SITE.affiliateTag`)

## Adding or updating products
1. Open `js/data.js`.
2. Copy a product entry and change the `asin`, `brand`, `title`, `blurb`, `badge` and `cat`.
3. Check that the ASIN opens a live product at `https://www.amazon.com/dp/<ASIN>`.
4. Commit and push. GitHub Pages redeploys automatically.

**Don't add prices or star ratings by hand.** The Amazon Associates Operating Agreement only allows showing prices and reviews pulled from the Product Advertising API and kept up to date. Cards link to Amazon with a "Check price on Amazon" button instead.

## Adding a blog post
1. Create `content/posts/<slug>.json`:
   ```json
   {
     "slug": "baratza-encore-review", "type": "review", "cat": "coffee",
     "keyword": "baratza encore review",
     "title": "Baratza Encore Review: What Owners Say After a Year",
     "excerpt": "70–170 characters; this is the meta description.",
     "date": "2026-11-06", "read": "8 min read",
     "body": [ { "p": "..." }, { "product": "B007F183LK" } ]
   }
   ```
   - `type`: `guide` (best-of roundups, gift guides), `review` (one product), `compare` (X vs Y), `howto`.
   - `keyword`: the one search phrase the post targets. Each keyword can only be used by one post.
   - Optional fields: `updated` (YYYY-MM-DD) and `priority` (a higher number pins the post to the top, e.g. seasonal guides).
   - Body blocks: `{ h }`, `{ p }`, `{ ul: [] }`, `{ product: ASIN }`, `{ pros: [] }`, `{ cons: [] }`, `{ table: { head: [], rows: [[]] } }`, `{ faq: [{ q, a }] }` (also emitted as FAQPage JSON-LD), `{ tip }`, `{ related: [slug] }`.
2. Run `node tools/build.mjs --check`, then `node tools/build.mjs`. The build **fails** on any of these:
   - a missing field, or a title over 70 characters
   - an unknown product or related slug
   - a duplicate keyword
   - fewer than 600 words (`legacy: true` exempts the original short posts until they're expanded)
   - a price, star rating, review count or "bought" figure in the text (Amazon policy)
3. Commit the JSON and the generated files together.

## Custom domain (primedealzon.com)
1. In the repo, go to Settings → Pages → Custom domain, enter `primedealzon.com`. This adds a `CNAME` file.
2. At your DNS provider, add `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, plus a `CNAME` record for `www` pointing to `arafattakey.github.io`.
3. Enable "Enforce HTTPS", then set `SITE.url` in `js/data.js` to `https://primedealzon.com/` and run `node tools/build.mjs`.

## Build-managed pages (2026-11-07)
- `node tools/build.mjs` also writes `category/<id>/index.html` (static category hubs) and refreshes the root pages (`index.html`, `blog.html`, `category.html`, `about.html`, `disclaimer.html`, `privacy.html`, `terms.html`, `404.html`). It bakes in the header, footer, disclosure bar, fonts, icons, canonical and social tags from `SITE.url`. Edit the page body by hand; the build owns those parts.
- Old `category.html?cat=<id>` links redirect to `category/<id>/`.
- Guides get a "top picks" box (first 3 products), a table of contents (3+ headings) and an editors box automatically.
- `node tools/images.mjs site` renders the site-wide social image and `favicon.ico` / `apple-touch-icon.png`.

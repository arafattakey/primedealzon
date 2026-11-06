# PrimeDealZon

> Best Deals. Best Prices. Every Day.

Amazon affiliate site focused on coffee gear (grinders, brewers, French presses, pour-over), with hand-picked products and buying guides. Home & Kitchen, Bedding, Cookware, Storage and Cleaning remain as secondary categories. Static HTML/CSS/JS, so it needs no build step.

## Live site
https://arafattakey.github.io/primedealzon/

## Structure
| File | Purpose |
| --- | --- |
| `index.html` | Homepage: hero, categories, filterable top picks, spotlight, guides |
| `category.html` | All categories, or one category via `?cat=coffee` |
| `blog.html` | Buying guide index |
| `guides/<slug>/index.html` | One static page per guide, **generated** by `tools/build.mjs` (don't edit by hand) |
| `blog-post.html` | Old guide URL (`?slug=...`); redirects to `guides/<slug>/` |
| `tools/build.mjs` | Builds guide pages, `sitemap.xml` and `robots.txt` from `js/data.js` |
| `about.html` | How products are picked and how the site is funded |
| `disclaimer.html` / `privacy.html` | Affiliate disclosure and privacy policy |
| `404.html` | Not-found page |
| `js/data.js` | **All content**: affiliate tag, categories, products (ASINs) and guides |
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

## Adding a guide
1. Add an object to `POSTS` in `js/data.js`. A body is a list of blocks: `{ h }` heading, `{ p }` paragraph, `{ ul: [...] }` checklist, `{ product: "ASIN" }` inline product card, `{ related: ["slug", ...] }` "Read next" links to other guides. Optional `updated: "Month D, YYYY"` sets the modified date.
2. Run `node tools/build.mjs`. It writes `guides/<slug>/index.html` and regenerates `sitemap.xml` and `robots.txt`.
3. Commit the data change and the generated files together.

## Custom domain (primedealzon.com)
1. In the repo, go to Settings → Pages → Custom domain, enter `primedealzon.com`. This adds a `CNAME` file.
2. At your DNS provider, add `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, plus a `CNAME` record for `www` pointing to `arafattakey.github.io`.
3. Enable "Enforce HTTPS", then set `SITE.url` in `js/data.js` to `https://primedealzon.com/` and run `node tools/build.mjs`.

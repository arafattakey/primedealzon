# PrimeDealZon

> Best Deals. Best Prices. Every Day.

Amazon affiliate site with hand-picked products and buying guides for Home & Kitchen, Coffee, Bedding, Cookware, Storage and Cleaning. Static HTML/CSS/JS, so it needs no build step.

## Live site
https://arafattakey.github.io/primedealzon/

## Structure
| File | Purpose |
| --- | --- |
| `index.html` | Homepage: hero, categories, filterable top picks, spotlight, guides |
| `category.html` | All categories, or one category via `?cat=coffee` |
| `blog.html` | Buying guide index |
| `blog-post.html` | A single guide via `?slug=...` |
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
Add an object to `POSTS` in `js/data.js`. A body is a list of blocks: `{ h }` heading, `{ p }` paragraph, `{ ul: [...] }` checklist, `{ product: "ASIN" }` inline product card. Add the new URL to `sitemap.xml`.

## Custom domain (primedealzon.com)
1. In the repo, go to Settings → Pages → Custom domain, enter `primedealzon.com`. This adds a `CNAME` file.
2. At your DNS provider, add `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, plus a `CNAME` record for `www` pointing to `arafattakey.github.io`.
3. Enable "Enforce HTTPS", then update the URLs in `robots.txt` and `sitemap.xml`.

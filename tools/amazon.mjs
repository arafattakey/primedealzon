// Fetches live product data (photo, price, rating, availability) for every ASIN in js/data.js
// from the Amazon Creators API and writes js/amazon-data.js, which the site reads.
//
//   node tools/amazon.mjs          fetch and write js/amazon-data.js
//   node tools/amazon.mjs --test   fetch and print a summary only (writes nothing)
//
// Needs these environment variables (stored as GitHub Actions secrets, never in the repo):
//   AMAZON_CREDENTIAL_ID       Credential ID from Associates Central > Tools > Creators API
//   AMAZON_CREDENTIAL_SECRET   The secret shown once when the credential was created
//   AMAZON_CREDENTIAL_VERSION  Optional, default 3.1 (the "Version" column; 3.1 = US)
//
// Amazon Associates rules this follows:
// - Prices, ratings and images come only from the API, and the site hides prices and ratings
//   if this data is more than 24 hours old (see js/site.js).
// - Image URLs are used as returned (hotlinked), never downloaded or re-hosted.
// - If the API call fails, the existing file is left untouched, so the site never breaks.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const testOnly = process.argv.includes('--test');

// Token endpoints per credential version (from Amazon's official Creators API SDK).
const TOKEN_URLS = {
  '2.1': 'https://creatorsapi.auth.us-east-1.amazoncognito.com/oauth2/token',
  '2.2': 'https://creatorsapi.auth.eu-south-2.amazoncognito.com/oauth2/token',
  '2.3': 'https://creatorsapi.auth.us-west-2.amazoncognito.com/oauth2/token',
  '3.1': 'https://api.amazon.com/auth/o2/token',
  '3.2': 'https://api.amazon.co.uk/auth/o2/token',
  '3.3': 'https://api.amazon.co.jp/auth/o2/token',
};
const API = 'https://creatorsapi.amazon/catalog/v1/getItems';
const MARKETPLACE = 'www.amazon.com';
const RESOURCES = [
  'images.primary.large',
  'itemInfo.title',
  'offersV2.listings.price',
  'offersV2.listings.availability',
  'offersV2.listings.isBuyBoxWinner',
  'customerReviews.starRating',
  'customerReviews.count',
];

const die = (msg) => { console.error(`ERROR: ${msg}`); process.exit(1); };
const call = (url, opts) => fetch(url, opts).catch((e) => die(`Could not reach ${new URL(url).host}: ${e.cause?.code || e.message}`));
const id = process.env.AMAZON_CREDENTIAL_ID?.trim();
const secret = process.env.AMAZON_CREDENTIAL_SECRET?.trim();
const version = (process.env.AMAZON_CREDENTIAL_VERSION || '3.1').trim();
if (!id || !secret) die('AMAZON_CREDENTIAL_ID and AMAZON_CREDENTIAL_SECRET must be set (GitHub repo secrets).');
if (!TOKEN_URLS[version]) die(`Unsupported AMAZON_CREDENTIAL_VERSION "${version}". Use one of ${Object.keys(TOKEN_URLS).join(', ')}.`);

// ASINs and affiliate tag from the site's own data file.
const ctx = vm.createContext({});
vm.runInContext(readFileSync(join(root, 'js/data.js'), 'utf8'), ctx);
const { SITE, PRODUCTS } = vm.runInContext('({ SITE, PRODUCTS })', ctx);
const asins = [...new Set(PRODUCTS.map((p) => p.asin))];

async function getToken() {
  const lwa = version.startsWith('3.');
  const fields = { grant_type: 'client_credentials', client_id: id, client_secret: secret, scope: lwa ? 'creatorsapi::default' : 'creatorsapi/default' };
  const res = await call(TOKEN_URLS[version], lwa
    ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields) }
    : { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fields) });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) {
    die(`Login failed (HTTP ${res.status}): ${body.error_description || body.error || 'no access token'}. ` +
      'Check that the credential ID, secret and version match Associates Central.');
  }
  return body.access_token;
}

async function getItems(token, itemIds) {
  const res = await call(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-marketplace': MARKETPLACE,
      Authorization: version.startsWith('3.') ? `Bearer ${token}` : `Bearer ${token}, Version ${version}`,
    },
    body: JSON.stringify({ partnerTag: SITE.affiliateTag, itemIds, resources: RESOURCES }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body.message || body.errors?.[0]?.message || JSON.stringify(body).slice(0, 300);
    die(`getItems failed (HTTP ${res.status}): ${msg}` +
      (res.status === 403 ? '\nThis usually means API access is paused until the account has enough recent qualifying sales.' : ''));
  }
  return body;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const token = await getToken();
const items = {};
const missing = [];
for (let i = 0; i < asins.length; i += 10) {
  const batch = asins.slice(i, i + 10);
  const body = await getItems(token, batch);
  for (const e of body.errors || []) console.warn(`warn: ${e.code}: ${e.message}`);
  for (const it of body.itemsResult?.items || []) {
    const listing = (it.offersV2?.listings || []).find((l) => l.isBuyBoxWinner) || it.offersV2?.listings?.[0];
    const price = listing?.price;
    const img = it.images?.primary?.large;
    items[it.asin] = {
      ...(img?.url && { image: img.url, w: img.width, h: img.height }),
      ...(price?.money?.displayAmount && { price: price.money.displayAmount }),
      ...(price?.savingBasis?.money?.displayAmount && price.savings?.percentage > 0 && {
        was: price.savingBasis.money.displayAmount, save: price.savings.percentage,
      }),
      ...(listing?.availability?.type && { stock: listing.availability.type }),
      ...(it.customerReviews?.starRating?.value && { rating: it.customerReviews.starRating.value }),
      ...(it.customerReviews?.count && { reviews: it.customerReviews.count }),
    };
  }
  if (i + 10 < asins.length) await sleep(1100); // stay under ~1 request/second
}
for (const a of asins) if (!items[a]) missing.push(a);

const n = (k) => Object.values(items).filter((x) => x[k]).length;
console.log(`Fetched ${Object.keys(items).length}/${asins.length} products: ${n('image')} photos, ${n('price')} prices, ${n('rating')} ratings.`);
if (missing.length) console.log(`Not returned (discontinued or unavailable?): ${missing.join(', ')}`);
if (testOnly) {
  for (const [a, x] of Object.entries(items).slice(0, 3)) console.log(`  ${a}: ${x.price || 'no price'} | ${x.rating ? x.rating + '★' : 'no rating'} | ${x.image ? 'photo ✓' : 'no photo'}`);
  console.log('Test only: nothing written.');
  process.exit(0);
}
if (!Object.keys(items).length) die('The API returned no products; keeping the existing js/amazon-data.js.');

const data = { fetchedAt: new Date().toISOString(), items };
writeFileSync(join(root, 'js/amazon-data.js'),
  '/* Generated by tools/amazon.mjs from the Amazon Creators API. Do not edit by hand. */\n' +
  `var AMAZON = ${JSON.stringify(data, null, 1)};\n`);
console.log('Wrote js/amazon-data.js');

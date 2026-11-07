#!/usr/bin/env node
// Qualifies resale leads from a Keepa get_deals JSON response (business #3, the sourcing newsletter).
//
//   node side-income/tools/leads.mjs <keepa-deals.json> [--out qualified.json]
//        [--recover 0.85] [--tax 0.07] [--fba 5.5] [--inbound 0.75] [--referral 0.15]
//        [--min-roi 30] [--min-profit 5] [--max-rank 100000]
//        [--products keepa-products.json] [--min-drops90 15]
//
// Two passes:
//   1. Deals only: a cheap screen using the deal's average and a flat FBA fee. Expect most to fail pass 2.
//   2. --products: the Keepa get_products response for the survivors. Uses each product's real FBA fee,
//      the LOWER of the Amazon and New 90-day averages (so a one-day price spike can't inflate the resale),
//      and a velocity check (sales-rank drops in 90 days ≈ sales).
// Model (deliberately conservative):
//   buy cost       = current price × (1 + sales tax)
//   resale price   = 90-day average × recover   (assumes the price only partly recovers)
//   fees           = resale × referral + FBA fee + inbound shipping
//   profit, ROI    = resale − fees − buy cost, profit ÷ buy cost
// These are ESTIMATES. Real fees depend on size tier and category: check in Seller Central / Keepa before buying.
import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : dflt;
};
const num = (name, dflt) => Number(opt(name, dflt));

const file = args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
if (!file) {
  console.error('usage: node side-income/tools/leads.mjs <keepa-deals.json> [--out file.json] [options]');
  process.exit(1);
}

const cfg = {
  recover: num('recover', 0.85),
  tax: num('tax', 0.07),
  fba: num('fba', 5.5),
  inbound: num('inbound', 0.75),
  referral: num('referral', 0.15),
  minRoi: num('min-roi', 30),
  minProfit: num('min-profit', 5),
  maxRank: num('max-rank', 100000),
  minDrops90: num('min-drops90', 15),
};

// Optional pass 2: per-product facts from Keepa get_products.
const productsFile = opt('products');
const products = {};
if (productsFile) {
  const pr = JSON.parse(readFileSync(productsFile, 'utf8'));
  for (const p of (Array.isArray(pr) ? pr : pr.products || [])) products[p.asin] = p;
}

// Categories that make poor resale leads: sizes/returns, perishables, media, furniture freight.
const EXCLUDE = /\b(shoe|sandal|boot|jean|pants|shirt|jacket|dress|sock|bra|underwear|size \d|\d+W x \d+L|furniture|coffee table|patio|mattress|book|dvd|blu-ray|vinyl|fresh|frozen|refrigerat)/i;

const money = (s) => (typeof s === 'number' ? s : Number(String(s ?? '').replace(/[^0-9.]/g, '')) || 0);
const r2 = (n) => Math.round(n * 100) / 100;

const raw = JSON.parse(readFileSync(file, 'utf8'));
// Accepts a raw Keepa deals response, or this script's own pass-1 output (so pass 2 can run on the survivors).
const deals = (Array.isArray(raw) ? raw : raw.deals || raw.qualified || []).map((d) =>
  d.currentValue ? d : { ...d, currentValue: d.buy, averageValue: d.avg90, priceDropPercent: d.dropPercent });

const rejected = {};
const reject = (why) => (rejected[why] = (rejected[why] || 0) + 1);

const qualified = [];
for (const d of deals) {
  const buy = money(d.currentValue);
  let avg = money(d.averageValue);
  let fba = cfg.fba;
  let drops90 = null;
  let rankAvg90 = null;
  if (productsFile) {
    const p = products[d.asin];
    if (!p) { reject('not in products file'); continue; }
    const avgs = [p.prices?.AMAZON?.avg90, p.prices?.NEW?.avg90].map(money).filter(Boolean);
    if (avgs.length) avg = Math.min(...avgs);
    if (p.fbaPickAndPackFee) fba = money(p.fbaPickAndPackFee);
    drops90 = p.salesRankDrops90 ?? null;
    rankAvg90 = p.salesRank90DayAvg ?? null;
    if (drops90 !== null && drops90 < cfg.minDrops90) { reject(`under ${cfg.minDrops90} sales-rank drops in 90 days (slow seller)`); continue; }
  }
  if (!buy || !avg) { reject('missing price'); continue; }
  if (EXCLUDE.test(d.title || '')) { reject('excluded category'); continue; }
  if (!d.salesRank || d.salesRank > cfg.maxRank) { reject(`sales rank > ${cfg.maxRank} or none`); continue; }

  const cost = buy * (1 + cfg.tax);
  const resale = avg * cfg.recover;
  const fees = resale * cfg.referral + fba + cfg.inbound;
  const profit = resale - fees - cost;
  const roi = (profit / cost) * 100;
  if (profit < cfg.minProfit || roi < cfg.minRoi) { reject('profit/ROI below minimum'); continue; }

  qualified.push({
    asin: d.asin,
    title: d.title,
    url: `https://www.amazon.com/dp/${d.asin}`,
    buy: r2(buy),
    avg90: r2(avg),
    dropPercent: d.priceDropPercent,
    salesRank: d.salesRank,
    salesRankAvg90: rankAvg90,
    salesRankDrops90: drops90,
    fbaFee: r2(fba),
    estResale: r2(resale),
    estFees: r2(fees),
    estProfit: r2(profit),
    estRoi: Math.round(roi),
    dealSince: d.dealSince,
  });
}
qualified.sort((a, b) => b.estRoi * b.estProfit - a.estRoi * a.estProfit);

const out = opt('out');
if (out) writeFileSync(out, JSON.stringify({ generated: new Date().toISOString(), assumptions: cfg, qualified, rejected }, null, 2));

console.log(`${qualified.length} qualified of ${deals.length} deals  (${productsFile ? 'pass 2: real FBA fees + lower 90d avg' : `pass 1: flat FBA $${cfg.fba}`}, resale = avg × ${cfg.recover}, tax ${Math.round(cfg.tax * 1000) / 10}%)`);
for (const q of qualified) {
  console.log(`${q.asin}  buy $${q.buy.toFixed(2).padStart(7)}  avg $${q.avg90.toFixed(2).padStart(7)}  profit $${q.estProfit.toFixed(2).padStart(6)}  ROI ${String(q.estRoi).padStart(3)}%  rank ${q.salesRank}${q.salesRankDrops90 !== null ? `  drops90 ${q.salesRankDrops90}` : ''}  ${q.title.slice(0, 60)}`);
}
if (Object.keys(rejected).length) console.log('rejected:', rejected);

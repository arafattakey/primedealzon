#!/usr/bin/env node
// Flip profit calculator (business #5).
//
//   node side-income/tools/flip-calc.mjs --buy 25 --sell 85 [--platform ebay|mercari|fb-local|fb-shipped]
//        [--ship 12] [--supplies 1.5] [--miles 10]
//
// Fee rates are typical 2026 US rates. Platforms change them often, so check before relying on them,
// and adjust the table below if they change.
const FEES = {
  // pct of total sale (item + shipping charged) + fixed per order
  ebay: { pct: 0.1325, fixed: 0.4, label: 'eBay (most categories)' },
  mercari: { pct: 0.10, fixed: 0.5, label: 'Mercari (selling + payment fee, approx.)' },
  'fb-local': { pct: 0, fixed: 0, label: 'Facebook Marketplace, local pickup, cash' },
  'fb-shipped': { pct: 0.10, fixed: 0, label: 'Facebook Marketplace, shipped' },
};
const MILEAGE_RATE = 0.70; // $/mile, roughly the IRS standard rate; update yearly

const args = process.argv.slice(2);
const get = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const buy = Number(get('buy'));
const sell = Number(get('sell'));
if (!buy || !sell) {
  console.error('usage: node side-income/tools/flip-calc.mjs --buy 25 --sell 85 [--platform ebay] [--ship 12] [--supplies 1.5] [--miles 10]');
  process.exit(1);
}
const platform = get('platform', 'ebay');
const f = FEES[platform];
if (!f) { console.error(`unknown platform; use one of: ${Object.keys(FEES).join(', ')}`); process.exit(1); }
const ship = Number(get('ship', platform === 'fb-local' ? 0 : 12));
const supplies = Number(get('supplies', platform === 'fb-local' ? 0 : 1.5));
const miles = Number(get('miles', 0));

const fees = sell * f.pct + f.fixed;
const mileage = miles * MILEAGE_RATE;
const profit = sell - fees - ship - supplies - buy - mileage;
const roi = (profit / buy) * 100;
const verdict = profit >= 20 && roi >= 40 ? 'BUY' : profit > 0 ? 'MARGINAL: negotiate lower or pass' : 'PASS';
// Highest buy price that still meets both rules: profit >= $20 and profit >= 40% of buy.
const net = sell - fees - ship - supplies - mileage;
const maxOffer = Math.max(0, Math.min(net - 20, net / 1.4));

const $ = (n) => `$${n.toFixed(2)}`;
console.log(`${f.label}
  sell ${$(sell)}  −fees ${$(fees)}  −ship ${$(ship)}  −supplies ${$(supplies)}  −mileage ${$(mileage)}  −buy ${$(buy)}
  profit ${$(profit)}   ROI ${roi.toFixed(0)}%   → ${verdict}
  max offer for BUY rules (≥$20 and ≥40%): ${$(maxOffer)}`);

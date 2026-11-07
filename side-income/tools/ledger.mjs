#!/usr/bin/env node
// Side-income scoreboard: month-to-date profit per business against the $500/month goal.
//
//   node side-income/tools/ledger.mjs [--month 2026-11] [--json] [--file path.csv]
//
// Reads side-income/private/ledger.csv (git-ignored). Falls back to ledger.example.csv so the script can be tried.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const get = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };

const TARGETS = { websites: 150, freelance: 100, newsletter: 100, templates: 75, flipping: 100, studies: 50, youtube: 0 };
const GOAL = 500;
const TAX_SET_ASIDE = 0.25;

let file = get('file', join(dir, 'private/ledger.csv'));
let example = false;
if (!existsSync(file)) { file = join(dir, 'ledger.example.csv'); example = true; }

const month = get('month', new Date().toISOString().slice(0, 7));
const rows = readFileSync(file, 'utf8').trim().split(/\r?\n/).slice(1).filter(Boolean).map((line) => {
  const [date, business, type, amount, ...desc] = line.split(',');
  return { date, business: business.trim(), type: type.trim(), amount: Number(amount), description: desc.join(',') };
});

const errors = rows.filter((r) => !(r.business in TARGETS) || !['income', 'cost'].includes(r.type) || !Number.isFinite(r.amount));
const totals = Object.fromEntries(Object.keys(TARGETS).map((b) => [b, { income: 0, cost: 0, profit: 0, target: TARGETS[b] }]));
for (const r of rows) {
  if (!r.date?.startsWith(month) || !(r.business in totals)) continue;
  const t = totals[r.business];
  if (r.type === 'income') t.income += r.amount;
  if (r.type === 'cost') t.cost += Math.abs(r.amount);
  t.profit = t.income - t.cost;
}
const profit = Object.values(totals).reduce((s, t) => s + t.profit, 0);

// Pace: compare to the share of the month elapsed.
const [y, m] = month.split('-').map(Number);
const daysInMonth = new Date(y, m, 0).getDate();
const now = new Date();
const elapsed = now.toISOString().slice(0, 7) === month ? now.getDate() / daysInMonth : 1;

const result = { month, file, example, goal: GOAL, profit: Math.round(profit * 100) / 100, pace: Math.round(profit / elapsed), taxSetAside: Math.max(0, Math.round(profit * TAX_SET_ASIDE)), businesses: totals, badRows: errors.length };

if (args.includes('--json')) { console.log(JSON.stringify(result, null, 2)); process.exit(0); }

const $ = (n) => `$${n.toFixed(0)}`;
if (example) console.log('(no side-income/private/ledger.csv yet — showing ledger.example.csv)\n');
console.log(`Side income ${month}`);
console.log('business      profit   target   status');
for (const [b, t] of Object.entries(totals)) {
  const status = t.target === 0 ? 'long-term' : t.profit >= t.target ? 'on target' : t.profit >= t.target * elapsed ? 'on pace' : 'behind';
  console.log(`${b.padEnd(12)} ${$(t.profit).padStart(7)}  ${$(t.target).padStart(7)}   ${status}`);
}
console.log(`\nTotal profit ${$(profit)} of ${$(GOAL)} goal · month pace ${$(result.pace)} · set aside for tax ~${$(result.taxSetAside)}`);
if (errors.length) console.log(`⚠ ${errors.length} row(s) with an unknown business/type or bad amount were skipped.`);

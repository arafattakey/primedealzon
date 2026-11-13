// Minimal Cloudflare D1 binding on top of node:sqlite, for tests.
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const SCHEMA = readFileSync(new URL('../schema.sql', import.meta.url), 'utf8');

export function makeD1() {
  const db = new DatabaseSync(':memory:');
  db.exec(SCHEMA);
  return {
    _db: db,
    prepare(sql) {
      let args = [];
      const s = {
        bind(...a) { args = a.map((v) => (v === undefined ? null : v)); return s; },
        async first() { return db.prepare(sql).get(...args) ?? null; },
        async all() { return { results: db.prepare(sql).all(...args) }; },
        async run() { const r = db.prepare(sql).run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; },
      };
      return s;
    },
  };
}


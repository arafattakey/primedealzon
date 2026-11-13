// Run (in sohoj-api/): npm test
// Exercises the real Worker against an in-memory SQLite database shaped like Cloudflare D1.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { normaliseNumber } from '../src/index.js';
import { makeD1 } from './d1.mjs';

const ADMIN = 'test-admin-token-0123456789abcdef';
const env = () => ({ DB: makeD1(), SALT: 'pepper', ADMIN_TOKEN: ADMIN, ALLOWED_ORIGINS: 'https://primedealzon.com', MIN_REPORTS: '10', DEV: '1' });
const JPEG = 'data:image/jpeg;base64,' + Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(3000, 7)]).toString('base64');

function call(e, method, path, { body, ip = '10.0.0.1', token, origin = 'https://primedealzon.com' } = {}) {
  const headers = { 'cf-connecting-ip': ip, origin };
  if (body) headers['content-type'] = 'application/json';
  if (token) headers.authorization = 'Bearer ' + token;
  return worker.fetch(new Request('https://api.test' + path, { method, headers, body: body ? JSON.stringify(body) : undefined }), e);
}
const rep = (n, extra = {}) => ({ number: n, provider: 'bkash', category: 'officer', amount: 5000, screenshot: JPEG, confirm: true, ...extra });
async function j(resP) { const r = await resP; return { status: r.status, body: await r.json(), headers: r.headers }; }

test('normalises Bangladeshi numbers', () => {
  assert.equal(normaliseNumber('01711000000'), '01711000000');
  assert.equal(normaliseNumber('+880 1711-000000'), '01711000000');
  assert.equal(normaliseNumber('8801711000000'), '01711000000');
  assert.equal(normaliseNumber('০১৭১১০০০০০০'), '01711000000');
  assert.equal(normaliseNumber('01211000000'), null);   // no 012 operator
  assert.equal(normaliseNumber('0171100000'), null);    // too short
  assert.equal(normaliseNumber('16247'), null);
});

test('a report needs a screenshot, a valid number and confirmation', async () => {
  const e = env();
  assert.equal((await j(call(e, 'POST', '/api/report', { body: rep('01711000000', { screenshot: '' }) }))).body.error, 'screenshot');
  assert.equal((await j(call(e, 'POST', '/api/report', { body: rep('01711000000', { screenshot: 'data:image/jpeg;base64,AAAA' }) }))).body.error, 'screenshot');
  assert.equal((await j(call(e, 'POST', '/api/report', { body: rep('12345') }))).body.error, 'number');
  assert.equal((await j(call(e, 'POST', '/api/report', { body: rep('01711000000', { confirm: false }) }))).body.error, 'confirm');
  assert.equal((await j(call(e, 'POST', '/api/report', { body: rep('01711000000', { provider: 'paypal' }) }))).body.error, 'provider');
  const ok = await j(call(e, 'POST', '/api/report', { body: rep('01711000000') }));
  assert.equal(ok.status, 201);
  assert.equal(ok.body.status, 'pending');
});

test('same connection cannot report the same number twice', async () => {
  const e = env();
  assert.equal((await j(call(e, 'POST', '/api/report', { body: rep('01711000000') }))).status, 201);
  const again = await j(call(e, 'POST', '/api/report', { body: rep('+8801711000000') }));
  assert.equal(again.status, 409);
});

test('no raw IP is stored', async () => {
  const e = env();
  await call(e, 'POST', '/api/report', { body: rep('01711000000'), ip: '203.0.113.77' });
  const row = e.DB._db.prepare('SELECT * FROM reports').get();
  assert.ok(!JSON.stringify(row).includes('203.0.113.77'));
  assert.equal(row.reporter.length, 32);
});

test('a number is listed only after 10 different people have APPROVED reports', async () => {
  const e = env();
  const n = '01899000000';
  for (let i = 1; i <= 10; i++) assert.equal((await j(call(e, 'POST', '/api/report', { body: rep(n, { category: i % 2 ? 'officer' : 'sms' }), ip: '10.1.0.' + i }))).status, 201);

  // 10 pending reports: still nothing public
  let c = await j(call(e, 'GET', '/api/check?n=' + n));
  assert.deepEqual(c.body, { number: n, listed: false });

  const pending = (await j(call(e, 'GET', '/api/admin/pending', { token: ADMIN }))).body.pending;
  assert.equal(pending.length, 10);
  for (const r of pending.slice(0, 9)) await call(e, 'POST', '/api/admin/review', { token: ADMIN, body: { id: r.id, decision: 'approve' } });

  c = await j(call(e, 'GET', '/api/check?n=' + n));
  assert.equal(c.body.listed, false, '9 approved is below the threshold');
  assert.equal(c.body.reports, undefined, 'counts are not revealed below the threshold');

  await call(e, 'POST', '/api/admin/review', { token: ADMIN, body: { id: pending[9].id, decision: 'approve' } });
  c = await j(call(e, 'GET', '/api/check?n=0' + n.slice(1)));
  assert.equal(c.body.listed, true);
  assert.equal(c.body.reports, 10);
  assert.deepEqual(c.body.categories, { officer: 5, sms: 5 });
  assert.deepEqual(c.body.providers, { bkash: 10 });
});

test('rejected reports do not count and their screenshot is deleted', async () => {
  const e = env();
  e.MIN_REPORTS = '1';
  await call(e, 'POST', '/api/report', { body: rep('01911000000') });
  const [r] = (await j(call(e, 'GET', '/api/admin/pending', { token: ADMIN }))).body.pending;
  const img = await call(e, 'GET', '/api/admin/evidence/' + r.id, { token: ADMIN });
  assert.equal(img.status, 200);
  assert.equal(img.headers.get('content-type'), 'image/jpeg');
  await call(e, 'POST', '/api/admin/review', { token: ADMIN, body: { id: r.id, decision: 'reject' } });
  assert.equal((await call(e, 'GET', '/api/admin/evidence/' + r.id, { token: ADMIN })).status, 404);
  assert.equal((await j(call(e, 'GET', '/api/check?n=01911000000'))).body.listed, false);
  // A report can only be reviewed once
  assert.equal((await call(e, 'POST', '/api/admin/review', { token: ADMIN, body: { id: r.id, decision: 'approve' } })).status, 404);
});

test('moderator pages need the admin password', async () => {
  const e = env();
  assert.equal((await call(e, 'GET', '/api/admin/pending')).status, 401);
  assert.equal((await call(e, 'GET', '/api/admin/pending', { token: 'wrong' })).status, 401);
  assert.equal((await call(e, 'GET', '/api/admin/evidence/1', { token: ADMIN.slice(0, -1) + 'x' })).status, 401);
  const weak = { ...env(), ADMIN_TOKEN: 'short' };
  assert.equal((await call(weak, 'GET', '/api/admin/pending', { token: 'short' })).status, 401, 'a weak admin password is refused');
});

test('one connection can file at most 10 reports a day', async () => {
  const e = env();
  for (let i = 0; i < 10; i++) assert.equal((await call(e, 'POST', '/api/report', { body: rep('0171100000' + i) })).status, 201);
  assert.equal((await call(e, 'POST', '/api/report', { body: rep('01811000000') })).status, 429);
});

test('a cleared number is never listed, and disputes work', async () => {
  const e = env();
  e.MIN_REPORTS = '1';
  await call(e, 'POST', '/api/report', { body: rep('01611000000') });
  const [r] = (await j(call(e, 'GET', '/api/admin/pending', { token: ADMIN }))).body.pending;
  await call(e, 'POST', '/api/admin/review', { token: ADMIN, body: { id: r.id, decision: 'approve' } });
  assert.equal((await j(call(e, 'GET', '/api/check?n=01611000000'))).body.listed, true);

  const d = await j(call(e, 'POST', '/api/dispute', { body: { number: '01611000000', contact: 'me@example.com', message: 'This is my shop number, I am not a scammer.' } }));
  assert.equal(d.status, 201);
  const disputes = (await j(call(e, 'GET', '/api/admin/disputes', { token: ADMIN }))).body.disputes;
  assert.equal(disputes.length, 1);

  await call(e, 'POST', '/api/admin/clear', { token: ADMIN, body: { number: '01611000000', reason: 'Owner proved it is a shop' } });
  assert.equal((await j(call(e, 'GET', '/api/check?n=01611000000'))).body.listed, false);
  assert.equal((await j(call(e, 'GET', '/api/admin/disputes', { token: ADMIN }))).body.disputes.length, 0);
});

test('only the site itself may call the API from a browser (CORS)', async () => {
  const e = env();
  const ok = await call(e, 'GET', '/api/check?n=01711000000');
  assert.equal(ok.headers.get('access-control-allow-origin'), 'https://primedealzon.com');
  const bad = await call(e, 'GET', '/api/check?n=01711000000', { origin: 'https://evil.example' });
  assert.equal(bad.headers.get('access-control-allow-origin'), null);
});

test('without DEV mode, the human check (Turnstile) is required', async () => {
  const e = { ...env(), DEV: undefined, TURNSTILE_SECRET: 'x' };
  const r = await j(call(e, 'POST', '/api/report', { body: rep('01711000000') }));
  assert.equal(r.body.error, 'captcha');
});

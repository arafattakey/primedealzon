/**
 * Sohoj Tools — scam number reports API (Cloudflare Worker + D1).
 *
 * Public:
 *   GET  /api/check?n=01XXXXXXXXX   → { number, listed, reports?, categories?, providers?, last? }
 *   POST /api/report                → report a number, screenshot required, goes to review
 *   POST /api/dispute               → owner of a listed number asks for a review
 * Moderators (Authorization: Bearer ADMIN_TOKEN):
 *   GET  /api/admin/pending         → reports waiting for review (oldest first)
 *   GET  /api/admin/evidence/:id    → the screenshot for one report
 *   POST /api/admin/review          → { id, decision: "approve" | "reject" }
 *   GET  /api/admin/disputes        → open disputes
 *   POST /api/admin/dispute-close   → { id }
 *   POST /api/admin/clear           → { number, reason } never list this number again
 *
 * A number is shown as a scam only when it has approved reports from MIN_REPORTS different
 * reporters (default 10) and has not been cleared. Below that, /check reveals nothing.
 *
 * Env: DB (D1 binding), SALT, ADMIN_TOKEN, TURNSTILE_SECRET (secrets),
 *      ALLOWED_ORIGINS (comma list), MIN_REPORTS (default 10), DEV ("1" skips Turnstile, local tests only).
 */

const PROVIDERS = ['bkash', 'nagad', 'rocket', 'upay', 'other'];
const CATEGORIES = ['officer', 'sms', 'wrong', 'seller', 'other'];
const MAX_IMAGE_BYTES = 400 * 1024;
const MAX_REPORTS_PER_DAY = 10;
const DAY = 24 * 60 * 60 * 1000;

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    try {
      const res = await route(request, env);
      for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
      return res;
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.code, message: e.message }, e.status, cors);
      console.error(e);
      return json({ error: 'server', message: 'Something went wrong' }, 500, cors);
    }
  },
};

class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}

async function route(request, env) {
  const url = new URL(request.url);
  const p = url.pathname.replace(/\/+$/, '');
  const m = request.method;

  if (m === 'GET' && p === '/api/check') return check(url, env);
  if (m === 'POST' && p === '/api/report') return report(request, env);
  if (m === 'POST' && p === '/api/dispute') return dispute(request, env);

  if (p.startsWith('/api/admin/')) {
    await requireAdmin(request, env);
    if (m === 'GET' && p === '/api/admin/pending') return adminPending(env);
    const ev = p.match(/^\/api\/admin\/evidence\/(\d+)$/);
    if (m === 'GET' && ev) return adminEvidence(env, +ev[1]);
    if (m === 'POST' && p === '/api/admin/review') return adminReview(request, env);
    if (m === 'GET' && p === '/api/admin/disputes') return adminDisputes(env);
    if (m === 'POST' && p === '/api/admin/dispute-close') return adminDisputeClose(request, env);
    if (m === 'POST' && p === '/api/admin/clear') return adminClear(request, env);
  }
  throw new HttpError(404, 'not_found', 'Not found');
}

/* ---------- helpers ---------- */

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
}

function corsHeaders(request, env) {
  const origin = request.headers.get('origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const h = { 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'content-type, authorization', 'access-control-max-age': '86400', vary: 'origin' };
  if (allowed.includes(origin)) h['access-control-allow-origin'] = origin;
  return h;
}

/** Accepts 01711000000, +8801711000000, 8801711-000000, Bangla digits… → "01711000000" or null */
export function normaliseNumber(raw) {
  let s = String(raw || '').replace(/[০-৯]/g, (d) => '০১২৩৪৫৬৭৮৯'.indexOf(d)).replace(/[\s\-().]/g, '');
  if (s.startsWith('+')) s = s.slice(1);
  if (s.startsWith('880')) s = s.slice(2);
  else if (s.startsWith('0088')) s = s.slice(4);
  return /^01[3-9]\d{8}$/.test(s) ? s : null;
}

async function body(request, maxBytes = 700 * 1024) {
  const len = +(request.headers.get('content-length') || 0);
  if (len > maxBytes) throw new HttpError(413, 'too_large', 'Request is too large');
  const text = await request.text();
  if (text.length > maxBytes) throw new HttpError(413, 'too_large', 'Request is too large');
  try { return JSON.parse(text); } catch { throw new HttpError(400, 'bad_json', 'Invalid request'); }
}

async function sha256hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function reporterId(request, env) {
  if (!env.SALT) throw new HttpError(500, 'config', 'Server is not configured');
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip') || 'unknown';
  return (await sha256hex(env.SALT + '|' + ip)).slice(0, 32);
}

async function verifyTurnstile(token, request, env) {
  if (env.DEV === '1') return;
  if (!env.TURNSTILE_SECRET) throw new HttpError(500, 'config', 'Server is not configured');
  if (!token) throw new HttpError(400, 'captcha', 'Please complete the check');
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET);
  form.append('response', token);
  const ip = request.headers.get('cf-connecting-ip');
  if (ip) form.append('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  const d = await r.json();
  if (!d.success) throw new HttpError(400, 'captcha', 'The human check failed, please try again');
}

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}

async function requireAdmin(request, env) {
  const h = request.headers.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!env.ADMIN_TOKEN || env.ADMIN_TOKEN.length < 24 || !timingSafeEqual(token, env.ADMIN_TOKEN)) {
    throw new HttpError(401, 'unauthorised', 'Wrong admin password');
  }
}

function threshold(env) { const n = parseInt(env.MIN_REPORTS, 10); return n > 0 ? n : 10; }

/** Validates "data:image/jpeg;base64,..." and returns { mime, data } */
function parseImage(dataUrl) {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ''));
  if (!m) throw new HttpError(400, 'screenshot', 'A screenshot is required');
  const bytes = Math.floor(m[2].length * 3 / 4);
  if (bytes > MAX_IMAGE_BYTES) throw new HttpError(413, 'screenshot_size', 'Screenshot is too large');
  if (bytes < 2000) throw new HttpError(400, 'screenshot', 'The screenshot looks empty');
  const head = atob(m[2].slice(0, 16));
  const sig = [...head].slice(0, 4).map((c) => c.charCodeAt(0));
  const ok = (m[1] === 'image/jpeg' && sig[0] === 0xff && sig[1] === 0xd8) || (m[1] === 'image/png' && sig[0] === 0x89 && sig[1] === 0x50) ||
    (m[1] === 'image/webp' && head.startsWith('RIFF'));
  if (!ok) throw new HttpError(400, 'screenshot', 'The screenshot is not a valid image');
  return { mime: m[1], data: m[2] };
}

function cleanText(s, max) { return String(s || '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max); }

/* ---------- public ---------- */

async function check(url, env) {
  const number = normaliseNumber(url.searchParams.get('n'));
  if (!number) throw new HttpError(400, 'number', 'Enter a valid Bangladeshi mobile number');
  const cleared = await env.DB.prepare('SELECT 1 FROM cleared WHERE number = ?').bind(number).first();
  if (cleared) return json({ number, listed: false });
  const row = await env.DB.prepare(
    "SELECT COUNT(DISTINCT reporter) AS n, MAX(created_at) AS last FROM reports WHERE number = ? AND status = 'approved'"
  ).bind(number).first();
  const n = row ? row.n : 0;
  if (n < threshold(env)) return json({ number, listed: false });   // reveal nothing below the threshold
  const cats = await env.DB.prepare(
    "SELECT category AS k, COUNT(*) AS c FROM reports WHERE number = ? AND status = 'approved' GROUP BY category ORDER BY c DESC"
  ).bind(number).all();
  const provs = await env.DB.prepare(
    "SELECT provider AS k, COUNT(*) AS c FROM reports WHERE number = ? AND status = 'approved' GROUP BY provider ORDER BY c DESC"
  ).bind(number).all();
  const toObj = (r) => Object.fromEntries(r.results.map((x) => [x.k, x.c]));
  return json({ number, listed: true, reports: n, categories: toObj(cats), providers: toObj(provs), last: row.last });
}

async function report(request, env) {
  const b = await body(request);
  const number = normaliseNumber(b.number);
  if (!number) throw new HttpError(400, 'number', 'Enter a valid Bangladeshi mobile number');
  if (!PROVIDERS.includes(b.provider)) throw new HttpError(400, 'provider', 'Choose a service');
  if (!CATEGORIES.includes(b.category)) throw new HttpError(400, 'category', 'Choose what happened');
  if (b.confirm !== true) throw new HttpError(400, 'confirm', 'Please confirm the report is true');
  const amount = b.amount == null || b.amount === '' ? null : Math.round(Number(b.amount));
  if (amount != null && !(amount > 0 && amount < 10_000_000)) throw new HttpError(400, 'amount', 'Check the amount');
  const img = parseImage(b.screenshot);
  await verifyTurnstile(b.token, request, env);

  const reporter = await reporterId(request, env);
  const now = Date.now();
  const recent = await env.DB.prepare('SELECT COUNT(*) AS c FROM reports WHERE reporter = ? AND created_at > ?').bind(reporter, now - DAY).first();
  if (recent && recent.c >= MAX_REPORTS_PER_DAY) throw new HttpError(429, 'rate', 'Too many reports today. Please try again tomorrow');
  const dup = await env.DB.prepare('SELECT 1 FROM reports WHERE number = ? AND reporter = ?').bind(number, reporter).first();
  if (dup) throw new HttpError(409, 'duplicate', 'You have already reported this number');

  const ins = await env.DB.prepare(
    'INSERT INTO reports (number, reporter, provider, category, amount, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(number, reporter, b.provider, b.category, amount, cleanText(b.note, 300) || null, now).run();
  const id = ins.meta.last_row_id;
  await env.DB.prepare('INSERT INTO evidence (report_id, mime, data) VALUES (?, ?, ?)').bind(id, img.mime, img.data).run();
  return json({ ok: true, status: 'pending' }, 201);
}

async function dispute(request, env) {
  const b = await body(request, 8 * 1024);
  const number = normaliseNumber(b.number);
  if (!number) throw new HttpError(400, 'number', 'Enter a valid Bangladeshi mobile number');
  const contact = cleanText(b.contact, 120), message = cleanText(b.message, 1000);
  if (contact.length < 5 || message.length < 10) throw new HttpError(400, 'dispute', 'Add a way to contact you and a short explanation');
  await verifyTurnstile(b.token, request, env);
  const open = await env.DB.prepare("SELECT COUNT(*) AS c FROM disputes WHERE number = ? AND status = 'open'").bind(number).first();
  if (open && open.c >= 5) throw new HttpError(429, 'rate', 'This number already has open review requests');
  await env.DB.prepare('INSERT INTO disputes (number, contact, message, created_at) VALUES (?, ?, ?, ?)').bind(number, contact, message, Date.now()).run();
  return json({ ok: true }, 201);
}

/* ---------- moderators ---------- */

async function adminPending(env) {
  const rows = await env.DB.prepare(
    `SELECT r.id, r.number, r.provider, r.category, r.amount, r.note, r.created_at,
            (SELECT COUNT(DISTINCT reporter) FROM reports a WHERE a.number = r.number AND a.status = 'approved') AS approved_for_number,
            (SELECT COUNT(*) FROM reports s WHERE s.reporter = r.reporter) AS reports_by_this_reporter
       FROM reports r WHERE r.status = 'pending' ORDER BY r.created_at ASC LIMIT 50`
  ).all();
  return json({ threshold: threshold(env), pending: rows.results });
}

async function adminEvidence(env, id) {
  const row = await env.DB.prepare('SELECT mime, data FROM evidence WHERE report_id = ?').bind(id).first();
  if (!row) throw new HttpError(404, 'not_found', 'No screenshot');
  const bin = Uint8Array.from(atob(row.data), (c) => c.charCodeAt(0));
  return new Response(bin, { headers: { 'content-type': row.mime, 'cache-control': 'private, no-store' } });
}

async function adminReview(request, env) {
  const b = await body(request, 2048);
  const id = +b.id;
  if (!(id > 0) || !['approve', 'reject'].includes(b.decision)) throw new HttpError(400, 'bad_request', 'Invalid review');
  const status = b.decision === 'approve' ? 'approved' : 'rejected';
  const r = await env.DB.prepare("UPDATE reports SET status = ?, reviewed_at = ? WHERE id = ? AND status = 'pending'").bind(status, Date.now(), id).run();
  if (!r.meta.changes) throw new HttpError(404, 'not_found', 'Report not found or already reviewed');
  if (status === 'rejected') await env.DB.prepare('DELETE FROM evidence WHERE report_id = ?').bind(id).run();
  return json({ ok: true, status });
}

async function adminDisputes(env) {
  const rows = await env.DB.prepare("SELECT id, number, contact, message, created_at FROM disputes WHERE status = 'open' ORDER BY created_at ASC LIMIT 100").all();
  return json({ disputes: rows.results });
}

async function adminDisputeClose(request, env) {
  const b = await body(request, 1024);
  await env.DB.prepare("UPDATE disputes SET status = 'closed' WHERE id = ?").bind(+b.id).run();
  return json({ ok: true });
}

async function adminClear(request, env) {
  const b = await body(request, 2048);
  const number = normaliseNumber(b.number);
  if (!number) throw new HttpError(400, 'number', 'Invalid number');
  await env.DB.prepare('INSERT OR REPLACE INTO cleared (number, reason, cleared_at) VALUES (?, ?, ?)').bind(number, cleanText(b.reason, 300), Date.now()).run();
  await env.DB.prepare("UPDATE disputes SET status = 'closed' WHERE number = ?").bind(number).run();
  return json({ ok: true });
}

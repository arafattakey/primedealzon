# Sohoj Tools – scam number API

Free Cloudflare Worker + D1 database behind the **Scam Number Check & Report** page
(`sohoj/scam-number-check/`) and the moderator page (`sohoj/admin/`).

## How it works
1. A victim reports a number with a **required screenshot**. The screenshot is shrunk on their phone (≤ 350 KB).
2. The report waits as **pending**. Nothing about the number is public yet.
3. A moderator opens `/admin/`, looks at each screenshot and taps **Approve** or **Reject**.
   Rejected screenshots are deleted immediately.
4. When a number has approved reports from **10 different people** (`MIN_REPORTS`), the check page shows
   “Reported as a scam by N people”. Below that, the check page reveals nothing, not even the count.
5. The number's owner can ask for a review. A moderator can **clear** a number so it is never listed again.

Abuse protection: one report per connection per number, max 10 reports per connection per day,
Cloudflare Turnstile bot check, and moderator review. “Different people” means different internet
connections: the API stores only a salted one-way hash of the connection, never the IP address.
Many phones on the same mobile network can share one connection, so this errs on the side of *under*-counting.

## Deploy (about 15 minutes, free)
You need a free Cloudflare account and Node.js on your computer.

```bash
cd sohoj-api
npx wrangler login                                    # opens the browser to sign in to Cloudflare
npx wrangler d1 create sohoj-scams                    # copy the database_id it prints into wrangler.toml
npx wrangler d1 execute sohoj-scams --remote --file=schema.sql
npx wrangler secret put SALT                          # paste any long random text
npx wrangler secret put ADMIN_TOKEN                   # the moderator password, 24+ characters
```

**Bot check (Turnstile):** Cloudflare dashboard → Turnstile → Add widget → add your site's domain.
It gives a *site key* (public) and a *secret key*.

```bash
npx wrangler secret put TURNSTILE_SECRET              # paste the Turnstile secret key
```

In `wrangler.toml`, set `ALLOWED_ORIGINS` to the address where the site is served
(e.g. `https://primedealzon.com`, or your new domain). Then:

```bash
npx wrangler deploy                                   # prints https://sohoj-scam-api.<you>.workers.dev
```

Finally, put both values into **`sohoj/data/config.json`** and push:

```json
{ "scam_api": "https://sohoj-scam-api.<you>.workers.dev", "turnstile_site_key": "<site key>" }
```

Until `scam_api` is set, the page shows “starting soon” and nothing is sent anywhere.

## Moderating
Open `https://<your site>/sohoj/admin/` and enter the `ADMIN_TOKEN`. Share it only with trusted moderators;
change it any time with `npx wrangler secret put ADMIN_TOKEN`.

Approve only when the screenshot clearly shows money going to the number, or a scam call/SMS from it.
Reject anything unclear, edited, or that looks like a personal dispute.

## Free-tier limits
D1 free: 5 GB storage, 5 million reads/day. Screenshots average ~30–150 KB, so roughly 30,000+ reports fit.
Workers free: 100,000 requests/day.

## Tests
```bash
cd sohoj-api && npm test     # 11 tests, runs the real Worker against SQLite (Node 22+)
```

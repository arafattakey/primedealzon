---
name: income-site-builder
description: Business #1, local business websites and care plans. Finds local businesses with no website or a poor one, builds a demo one-page site from side-income/products/local-site-template, and drafts a single personal outreach message.
---
You run business #1: one-page websites for local service businesses, sold at **$150–300 set-up plus a $25–35/mo care plan** (hosting, small edits, 2 Google Business Profile posts a month).

## Prospecting (only the user's own city or area, given in `side-income/private/profile.md`)
- Search Google Maps and public directories for trades with good reviews but **no website**, or a broken or non-mobile one: plumbers, cleaners, barbers, food trucks, mobile mechanics, lawn care.
- Record 3–5 prospects a week in `side-income/private/prospects.csv` (business, category, public phone or email, what is missing, date). Use only publicly listed business contact details. Never collect personal data beyond that.

## Demo site
- Copy `side-income/products/local-site-template/` to `side-income/out/sites/<slug>/`. Fill in only facts that are public (name, services, area, hours, public reviews quoted with attribution). Mark anything unknown as `[confirm with owner]`. Never invent testimonials, licences or prices.
- Keep it fast: one HTML file, no frameworks. Mobile first. Click-to-call button. Map link.

## Outreach draft (the user sends it)
One short, personal message: what you noticed, a link or screenshot of the demo, the price, and "no worries if not". No fake urgency. No follow-up after a "no", and at most one follow-up after silence. Save it to `side-income/private/outreach/<slug>.md`.

## After a sale
A checklist for the user: take payment (Stripe or PayPal invoice), get the owner to confirm the content, set up a custom domain in the owner's name, deploy on Cloudflare Pages or GitHub Pages, and log the sale with the bookkeeper.

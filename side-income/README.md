# Side Income: 7 new businesses, run by an agent team

Goal: **about $500 a month in profit** from 7 new businesses. These are separate from the PrimeDealZon site and from the existing Amazon store.

The work is split this way:

- **Agents** do the research, drafting, pricing, building and bookkeeping (about 80% of the hours).
- **You** do the parts a platform requires a person for, or where real money or your name is involved: approve, send, buy, ship and take payment (about 3–5 hours a week).

> **Privacy:** this repo is published by GitHub Pages, so `_config.yml` keeps this folder off the website. The repo itself may still be public, though. Real numbers, client names and leads go in `side-income/private/`, which git ignores. A private repo for this folder is better still: run `git mv side-income` into it, along with `.claude/agents/income-*`.

---

## The 7 businesses

The research behind these choices (Reddit, YouTube creator reports, 2026 market data) is summarised at the end. Targets are for **month 4–6**. Month 1 will be lower; see the ramp table.

| # | Business | What you sell | Monthly target | Time to first $ | Startup cost | Agent |
|---|---|---|---|---|---|---|
| 1 | **Local business websites + care plan** | One-page sites for local trades (plumbers, salons, food trucks) at $150–300 each, then $25–35/mo for hosting, updates and Google Business Profile posts | **$150** | 2–4 weeks | $0 (GitHub Pages/Cloudflare free) | `income-site-builder` |
| 2 | **Freelance e-commerce services** (Upwork/Fiverr) | Listing rewrites, product research reports, Keepa/Sellerboard setups for *other* sellers. This is what you already know. | **$100** | 1–3 weeks | $0–15 (Upwork Connects) | `income-gig-hunter` |
| 3 | **Paid sourcing-leads newsletter** | 2 issues a week of vetted price-drop resale leads (beehiiv or Substack paid tier, $15–19/mo). Capped at 25 subscribers so the leads stay usable. | **$100** | 4–8 weeks | $0 (Keepa already connected) | `income-lead-scout` + `income-newsletter-editor` |
| 4 | **Digital templates** (Etsy + Gumroad/Payhip) | Spreadsheets for resellers and small shops: profit calculators, inventory and mileage trackers. Not wall art, which is saturated. | **$75** | 3–6 weeks | ~$5 (Etsy listing fees) | `income-template-maker` |
| 5 | **Local flipping** (FB Marketplace, eBay, Mercari) | Underpriced local items, clearance and returns. Agent pulls sold comps, prices and writes the listing; you pick up and ship. | **$100** | 1–2 weeks | $100–200 rolling | `income-flip-pricer` |
| 6 | **Paid research studies** (Prolific, User Interviews, Respondent) | Your time in academic studies and product interviews | **$50** | Days | $0 | none (manual on purpose, see below) |
| 7 | **Faceless how-to YouTube channel** (reseller and small-business tutorials) | Screen-recorded tutorials. It feeds #2–#4 and earns ad revenue much later. | **$0 now, upside later** | 6–12 months | $0 | `income-video-producer` |
| | | | **≈ $575/mo** | | | |

Why aim at $575: some businesses will miss target, so the extra covers that and still lands near $500.

### Ramp: what to expect

| Month | Likely total | Coming from |
|---|---|---|
| 1 | $50–150 | Research studies, first flips, maybe one freelance gig |
| 2 | $150–300 | Plus 1–2 website sales, first template sales |
| 3 | $250–450 | Plus first paid newsletter subscribers and care-plan recurring income |
| 4–6 | $400–650 | The recurring parts (care plans, newsletter, templates) compound |

If a business is under 25% of target after **8 weeks of real effort**, the chief agent recommends dropping it and doubling the best one.

### Why #6 has no agent
Prolific and similar platforms ban automated or AI-written answers and will ban the account. You answer the studies yourself. The agent's only job is to remind you to check, and it does not do that either. It's simply on your weekly checklist.

---

## The agent team

All agents are Claude Code subagents in `.claude/agents/income-*.md`.

```
                        ┌─────────────────────────┐
         you ◀────────▶ │  income-chief (orchestr.)│  weekly run, priorities, scoreboard
                        └───────────┬─────────────┘
     ┌──────────────┬───────────────┼───────────────┬───────────────┬──────────────┐
     ▼              ▼               ▼               ▼               ▼              ▼
 market-        site-builder    gig-hunter      lead-scout ──▶  template-     flip-pricer
 researcher     (biz #1)        (biz #2)        newsletter-     maker (#4)    (#5)
 (all)                                          editor (#3)
     │                                                                          │
     └──────────────▶  compliance-reviewer  ◀─── every outgoing draft ──────────┘
                       bookkeeper  ◀─── every sale / cost  → private/ledger.csv
                       video-producer (#7, optional)
```

| Agent | Does on its own | Hands to you |
|---|---|---|
| `income-chief` | Runs the weekly cycle, assigns work to the other agents, reads the ledger, writes the weekly brief | A short to-do list (`side-income/private/weekly-brief-YYYY-MM-DD.md`) |
| `income-market-researcher` | Checks demand (Reddit, YouTube, Etsy and Upwork search, Google Trends) before anything is built | Go / no-go with the evidence |
| `income-site-builder` | Finds local businesses with no site or a broken one, builds a demo site from `products/local-site-template/`, drafts the outreach | Demo link + message to send, then a call |
| `income-gig-hunter` | Drafts profile copy, gig descriptions and tailored proposals for matching jobs, and the delivery work itself | Proposals to submit (never auto-submitted), delivery to review |
| `income-lead-scout` | Pulls Keepa price drops, filters out junk, runs `tools/leads.mjs` for profit and ROI | A list of qualified leads |
| `income-newsletter-editor` | Turns leads into an issue with risk notes and a disclaimer | Issue to paste into beehiiv or Substack and send |
| `income-template-maker` | Builds the spreadsheet products (`tools/make-templates.py`), listing copy, mockup text, SEO tags | Files and copy to upload |
| `income-flip-pricer` | From a photo or description, finds sold comps and runs `tools/flip-calc.mjs` | Buy / pass, max offer, ready-to-paste listing |
| `income-compliance-reviewer` | Checks every outgoing text against platform rules, FTC and AI-disclosure rules, and income claims | Approve or block, with the fix |
| `income-bookkeeper` | Logs sales and costs, runs `tools/ledger.mjs`, flags tax set-aside | Scoreboard vs $500 |
| `income-video-producer` | Scripts and outlines for screen-recorded tutorials, plus titles and descriptions | Script to record in your own voice |

### Running it
- **First time:** follow [`START-HERE.md`](START-HERE.md) (week 1, about 4 hours). [`examples/newsletter-issue-001.md`](examples/newsletter-issue-001.md) is a real issue built from live Keepa data.
- **Note:** `private/` is git-ignored, so in a cloud session it disappears when the session ends. Run the system from your own computer, or a private repo, so the ledger persists.
- **Weekly (about 30 min of your time):** in Claude Code, run `/income-weekly`. The chief agent runs every agent, then writes your to-do list.
- **One agent:** "Use the income-flip-pricer agent on this: [photo/description]".
- **Scoreboard:** `node side-income/tools/ledger.mjs`.

### Hard rules (every agent follows them)
1. **Nothing goes out without you.** Agents draft. You send, submit, list, buy and take payment.
2. **No fake reviews, no fake scarcity, no guaranteed-income claims, no spam.** Outreach to a business is one personal, relevant message, with no follow-up after one "no".
3. **Disclose AI use** where a platform or client asks (Etsy requires it for AI-made listings; Upwork clients often ask).
4. **Platform rules beat growth hacks.** One account per platform, no ban evasion, no scraping behind logins.
5. **Set aside 25–30% of profit for taxes.** Self-employment income over $400 a year is taxable in the US.

---

## The research behind the picks (Nov 2026)

- **What people actually report earning:** Reddit and r/sidehustle reports put most real side incomes at $50–500 a month, 2–6 months to first income, and 10–15 hours a week for $500–1,000. Freelancing that builds on a skill you already have is the most consistent route. Surveys are not.
- **Etsy digital products:** broad categories (wall art, generic planners) are saturated. Specific niches still sell. 75% of shops earn under £1,000 a month. Etsy is actively enforcing AI disclosure. → Narrow reseller and small-business templates, disclosed.
- **Faceless YouTube:** since July 2025 YouTube demonetizes "inauthentic", mass-produced AI content, and it terminated large channels for it in January 2026. Original screen-recorded tutorials narrated by a real voice remain fine. → #7 is slow and real, not an AI-slop factory.
- **Newsletters:** beehiiv's ad network and Boosts pay small newsletters, but only meaningfully after about 1,000 subscribers. → #3 uses a **paid tier** with a few high-value subscribers instead of chasing ad revenue.
- **Arbitrage leads:** Keepa is the standard tool, and part-time resellers report $500–1,200 a month. Selling the leads to a capped group is an established model, and you already have Keepa.
- **Amazon Associates** commissions were cut in 2026, one reason this plan does not lean on more affiliate sites.

Sources: [r/sidehustle snapshot](https://gummysearch.com/r/sidehustle) · [Reddit side-hustle tests](https://digitalbiztalk.com/article/6-months-testing-reddit-side-hustles-brutal-truths-what-actually-works) · [Etsy 2026 income data](https://www.listifyai.net/blog/how-much-do-etsy-sellers-make-2026) · [Is Etsy worth it for printables 2026](https://elistit-web.pages.dev/guides/is-etsy-worth-it-for-printables-2026/) · [Printables honest math](https://www.lilachbullock.com/selling-printables-passive-income-honest-math/) · [YouTube AI slop crackdown](https://thenextweb.com/news/youtube-ai-slop-crackdown-faceless-creators-collateral-damage) · [Faceless channel demonetization](https://outlierkit.com/resources/faceless-youtube-channel-demonetized/) · [beehiiv earnings](https://roo.beehiiv.com/p/how-to-make-money-on-beehiiv) · [beehiiv ad network](https://www.emarketer.com/content/beehiiv-doubles-ad-sales-team-newsletter-monetization-heats-up) · [Online arbitrage income ranges](https://profitpath.com/en/blog/amazon-online-arbitrage-guide) · [Amazon Associates 2026 cuts](https://www.shopifreaks.com/amazon-slashed-affiliate-commission-rates-by-up-to-50-and-gutted-reporting-tools/)

Most income figures in these sources are self-reported or come from sites selling something. Treat them as ranges, not promises.

# Sohoj Tools (সহজ টুলস) — working name

Free, bilingual (Bangla + English) online tools for Bangladesh. Everything runs in the browser:
no server, no uploads, no sign-up, and it works offline once a page has been opened.

This folder is self-contained. To give it its own brand, copy `sohoj/` into a new repository
and point a domain at it (GitHub Pages or Cloudflare Pages, both free). Nothing outside this folder is used.

## Tools
| Group | Tool | Folder |
| --- | --- | --- |
| Content creators | Thumbnail maker (Bangla text, 1280×720, under 2 MB) | `thumbnail-maker/` |
| | YouTube thumbnail downloader | `youtube-thumbnail-downloader/` |
| | Caption & hashtag helper (13 niches, platform limits) | `hashtag-generator/` |
| | YouTube income calculator (taka, BD audiences) | `youtube-income-calculator/` |
| Photos & PDF | Photo resizer to exact px + KB (Teletalk, DV lottery, passport, visa) | `photo-resizer/` |
| | Signature resizer 300×80 / 60 KB with paper-whitening | `signature-resizer/` |
| | Image to PDF with a size limit (own PDF writer, no library) | `image-to-pdf/` |
| Calculators | Age on a date + job age-limit check | `age-calculator/` |
| | Loan EMI, flat vs reducing, yearly schedule | `emi-calculator/` |
| | Land units: shotok, katha, bigha, acre… | `land-converter/` |
| | BMI with South Asian cut-offs | `bmi-calculator/` |

## How it fits together
- `js/common.js` holds the **tool list** (`TOOLS`). Add a tool there and it appears on the homepage,
  in the footer and in "More free tools" on every page.
- Text is bilingual with `<span lang="en">…</span><span lang="bn">…</span>`; CSS shows only the active
  language. Bangla is the default; the choice is remembered on the device.
- `FT.num()` formats numbers in lakh/crore style and in Bangla digits when Bangla is on. `FT.parse()`
  accepts Bangla digits typed by the user.
- `js/resizer.js` is shared by the photo and signature resizers; presets live in each page.
- `sw.js` + `manifest.webmanifest` make it installable ("Add to Home screen") and usable offline.

## Adding a tool
1. Copy a similar tool folder, e.g. `bmi-calculator/` → `my-tool/`.
2. Change the `<title>`, description, `data-tool="my-tool"` and the page content.
3. Add an entry to `TOOLS` in `js/common.js` (`group`: `creator`, `image` or `calc`).

## Before launch
- Pick the final name and buy a `.com` (or `.com.bd`) domain.
- Add `sitemap.xml`, `robots.txt`, and Google Search Console.
- Apply for Google AdSense once there are ~20 tools with their how-to text.
- Re-check preset sizes (Teletalk, DV lottery) against current circulars before each job season.

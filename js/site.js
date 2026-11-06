/* PrimeDealZon shared UI. Depends on js/data.js. */

const ICONS = {
  pot: '<path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-6Z"/><path d="M2 10h20M9 6V4M15 6V4M12 6V3"/>',
  cup: '<path d="M4 9h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3M12 3v3"/>',
  bed: '<path d="M3 18V7M3 13h18v5M21 18v-5a3 3 0 0 0-3-3h-7v3"/><circle cx="7" cy="10.5" r="1.8"/>',
  pan: '<circle cx="10" cy="13" r="7"/><path d="M17 13h5"/><circle cx="10" cy="13" r="3.5" opacity=".5"/>',
  box: '<path d="M3 8l9-4 9 4v9l-9 4-9-4V8Z"/><path d="M3 8l9 4 9-4M12 12v9"/>',
  spray: '<path d="M8 10h6v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10ZM9 10V7h4v3M13 7h3l2-2M17 9h3M17 4h3"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="m5 12 4.5 4.5L19 7"/>',
};

function icon(name, cls = "") {
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const catById = id => CATEGORIES.find(c => c.id === id);
const productByAsin = asin => PRODUCTS.find(p => p.asin === asin);
const amazonUrl = asin => `https://www.amazon.com/dp/${asin}?tag=${SITE.affiliateTag}`;
const param = k => new URLSearchParams(location.search).get(k);
// Pages in subfolders (e.g. guides/<slug>/) set data-root="../../" so shared links still resolve.
// The build script runs this file without a DOM; its output lives two folders deep.
const ROOT = typeof document === "undefined" ? "../../" : (document.body.dataset.root || "");
const guideUrl = slug => `${ROOT}guides/${slug}/`;

/* ---------- Layout ---------- */

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const page = document.body.dataset.page;
  const link = (href, label, key) => `<a href="${href}"${page === key ? ' aria-current="page"' : ""}>${label}</a>`;
  el.innerHTML = `
    <div class="container header-inner">
      <a class="logo" href="${ROOT}index.html" aria-label="${SITE.name} home">
        <span class="logo-mark">${icon("bolt")}</span>
        <span>Prime<b>Deal</b>Zon</span>
      </a>
      <button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="siteNav" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
      <nav class="nav" id="siteNav" aria-label="Main">
        ${link(`${ROOT}index.html`, "Home", "home")}
        ${link(`${ROOT}category.html?cat=coffee`, "Coffee", "")}
        ${link(`${ROOT}index.html#picks`, "Top Picks", "")}
        ${link(`${ROOT}category.html`, "Categories", "category")}
        ${link(`${ROOT}blog.html`, "Blog", "blog")}
        <a class="nav-cta" href="${ROOT}index.html#picks">Shop deals</a>
      </nav>
    </div>`;
  const btn = document.getElementById("menuBtn");
  const nav = document.getElementById("siteNav");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML = `
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="logo" href="${ROOT}index.html"><span class="logo-mark">${icon("bolt")}</span><span>Prime<b>Deal</b>Zon</span></a>
        <p>${SITE.tagline} Hand-picked coffee gear and home essentials from Amazon, explained in plain English.</p>
      </div>
      <div>
        <h4>Shop</h4>
        ${CATEGORIES.map(c => `<a href="${ROOT}category.html?cat=${c.id}">${c.name}</a>`).join("")}
      </div>
      <div>
        <h4>Site</h4>
        <a href="${ROOT}blog.html">Blog</a>
        <a href="${ROOT}about.html">About us</a>
        <a href="${ROOT}disclaimer.html">Affiliate disclosure</a>
        <a href="${ROOT}privacy.html">Privacy policy</a>
      </div>
    </div>
    <div class="container footer-legal">
      <p>${SITE.name} is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate we earn from qualifying purchases. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.</p>
      <p>&copy; ${new Date().getFullYear()} ${SITE.name}. Product selections last reviewed ${SITE.updated}.</p>
    </div>`;
}

/* ---------- Components ---------- */

function productCard(p) {
  const c = catById(p.cat);
  return `
    <article class="card product" data-cat="${p.cat}">
      <div class="product-art art-${p.cat}">
        ${icon(c.icon, "art-ico")}
        ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
      </div>
      <div class="product-body">
        <div class="product-meta"><span>${esc(p.brand)}</span><span>·</span><a href="${ROOT}category.html?cat=${c.id}">${c.name}</a></div>
        <h3 class="product-title">${esc(p.title)}</h3>
        <p class="product-blurb">${esc(p.blurb)}</p>
        <a class="btn btn-amazon" href="${amazonUrl(p.asin)}" target="_blank" rel="nofollow sponsored noopener">
          Check price on Amazon ${icon("arrow")}
        </a>
      </div>
    </article>`;
}

function productInline(p) {
  const c = catById(p.cat);
  return `
    <aside class="inline-product">
      <div class="inline-art art-${p.cat}">${icon(c.icon, "art-ico")}</div>
      <div class="inline-body">
        <span class="inline-brand">${esc(p.brand)}${p.badge ? ` · ${esc(p.badge)}` : ""}</span>
        <strong>${esc(p.title)}</strong>
      </div>
      <a class="btn btn-amazon btn-sm" href="${amazonUrl(p.asin)}" target="_blank" rel="nofollow sponsored noopener">View on Amazon</a>
    </aside>`;
}

function categoryCard(c) {
  const n = PRODUCTS.filter(p => p.cat === c.id).length;
  return `
    <a class="card cat-card art-${c.id}" href="${ROOT}category.html?cat=${c.id}">
      <span class="cat-ico">${icon(c.icon)}</span>
      <span class="cat-name">${c.name}</span>
      <span class="cat-blurb">${c.blurb}</span>
      <span class="cat-count">${n} pick${n === 1 ? "" : "s"} ${icon("arrow")}</span>
    </a>`;
}

const POST_TYPES = [
  { id: "guide", label: "Buying guides", one: "Buying guide", cta: "Read the guide" },
  { id: "review", label: "Reviews", one: "Review", cta: "Read the review" },
  { id: "compare", label: "Comparisons", one: "Comparison", cta: "See the comparison" },
  { id: "howto", label: "How-to", one: "How-to", cta: "Read the how-to" },
];
const postType = post => POST_TYPES.find(t => t.id === post.type) || POST_TYPES[0];
const fmtDate = iso => new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

function postCard(post) {
  const c = catById(post.cat);
  const t = postType(post);
  return `
    <article class="card post-card">
      <a class="post-art art-${post.cat}" href="${guideUrl(post.slug)}" tabindex="-1" aria-hidden="true">${icon(c.icon, "art-ico")}</a>
      <div class="post-body">
        <div class="post-meta">${t.one} · ${c.name} · ${post.read}</div>
        <h3><a href="${guideUrl(post.slug)}">${esc(post.title)}</a></h3>
        <p>${esc(post.excerpt)}</p>
        <a class="link-arrow" href="${guideUrl(post.slug)}">${t.cta} ${icon("arrow")}</a>
      </div>
    </article>`;
}

/* ---------- Pages ---------- */

const pages = {
  home() {
    document.getElementById("catGrid").innerHTML = CATEGORIES.map(categoryCard).join("");
    document.getElementById("guideGrid").innerHTML = POSTS.filter(p => p.cat === "coffee").slice(0, 3).map(postCard).join("");

    const grid = document.getElementById("picksGrid");
    const bar = document.getElementById("filterBar");
    bar.innerHTML = [{ id: "all", name: "All" }, ...CATEGORIES]
      .map((c, i) => `<button class="chip${i === 0 ? " active" : ""}" data-filter="${c.id}" aria-pressed="${i === 0}">${c.name}</button>`)
      .join("");
    const draw = f => {
      const list = f === "all" ? PRODUCTS : PRODUCTS.filter(p => p.cat === f);
      grid.innerHTML = list.map(productCard).join("");
    };
    bar.addEventListener("click", e => {
      const b = e.target.closest(".chip");
      if (!b) return;
      bar.querySelectorAll(".chip").forEach(x => { x.classList.toggle("active", x === b); x.setAttribute("aria-pressed", x === b); });
      draw(b.dataset.filter);
    });
    draw("all");

    const star = productByAsin("B07CSKGLMM");
    if (star) document.getElementById("spotlightCta").href = amazonUrl(star.asin);
    document.getElementById("statProducts").textContent = PRODUCTS.length;
    document.getElementById("statGuides").textContent = POSTS.length;
  },

  category() {
    const id = param("cat");
    const c = catById(id);
    const head = document.getElementById("catHead");
    const grid = document.getElementById("catProducts");
    const nav = document.getElementById("catNav");
    nav.innerHTML = CATEGORIES.map(x => `<a class="chip${c && x.id === c.id ? " active" : ""}" href="${ROOT}category.html?cat=${x.id}">${x.name}</a>`).join("");

    if (!c) {
      document.title = `All Categories – ${SITE.name}`;
      head.innerHTML = `<p class="eyebrow">Browse</p><h1>All categories</h1><p class="lede">Every pick on ${SITE.name}, grouped by where it lives in your home.</p>`;
      grid.innerHTML = CATEGORIES.map(x => `
        <section class="cat-section">
          <div class="section-head"><h2>${x.name}</h2><a class="link-arrow" href="${ROOT}category.html?cat=${x.id}">See all ${icon("arrow")}</a></div>
          <div class="grid grid-products">${PRODUCTS.filter(p => p.cat === x.id).map(productCard).join("")}</div>
        </section>`).join("");
      return;
    }

    document.title = `Best ${c.name} Picks on Amazon – ${SITE.name}`;
    document.querySelector('meta[name="description"]').setAttribute("content", `Hand-picked ${c.name.toLowerCase()} products on Amazon. ${c.blurb}`);
    head.innerHTML = `
      <p class="eyebrow"><a href="${ROOT}category.html">Categories</a> / ${c.name}</p>
      <h1>The best ${c.name.toLowerCase()} on Amazon</h1>
      <p class="lede">${c.blurb}</p>`;
    grid.innerHTML = `<div class="grid grid-products">${PRODUCTS.filter(p => p.cat === c.id).map(productCard).join("")}</div>`;
    const related = POSTS.filter(p => p.cat === c.id || (p.products || []).some(a => productByAsin(a)?.cat === c.id)).slice(0, 9);
    if (related.length) {
      grid.innerHTML += `<section class="cat-section"><div class="section-head"><h2>From the blog</h2><a class="link-arrow" href="${ROOT}blog.html">All posts ${icon("arrow")}</a></div><div class="grid grid-posts">${related.map(postCard).join("")}</div></section>`;
    }
  },

  // Blog index: newest first (POSTS is already sorted by the build), filterable by post type.
  blog() {
    const grid = document.getElementById("postGrid");
    const bar = document.getElementById("typeBar");
    const types = [{ id: "all", label: "All posts" }, ...POST_TYPES.filter(t => POSTS.some(p => postType(p).id === t.id))];
    let current = types.some(t => t.id === param("type")) ? param("type") : "all";
    const draw = () => {
      bar.innerHTML = types.map(t => `<button class="chip${t.id === current ? " active" : ""}" data-type="${t.id}" aria-pressed="${t.id === current}">${t.label}</button>`).join("");
      const list = current === "all" ? POSTS : POSTS.filter(p => postType(p).id === current);
      grid.innerHTML = list.map(postCard).join("");
    };
    bar.addEventListener("click", e => {
      const b = e.target.closest(".chip");
      if (!b) return;
      current = b.dataset.type;
      history.replaceState(null, "", current === "all" ? "blog.html" : `blog.html?type=${current}`);
      draw();
    });
    draw();
  },

  // Old URL (blog-post.html?slug=...): send visitors and crawlers to the static guide page.
  post() {
    const post = POSTS.find(p => p.slug === param("slug"));
    if (post) { location.replace(guideUrl(post.slug)); return; }
    document.getElementById("postRoot").innerHTML = `<div class="container narrow empty"><h1>Guide not found</h1><p>That guide may have moved.</p><a class="btn btn-primary" href="${ROOT}blog.html">See all guides</a></div>`;
  },
};

/* Body blocks a post may use (validated by tools/build.mjs):
 *   { h } heading · { p } paragraph · { ul: [] } checklist · { product: ASIN } product card
 *   { pros: [] } / { cons: [] } owner-reported pros and cons · { table: { head: [], rows: [[]] } } comparison table
 *   { faq: [{ q, a }] } questions (also emitted as FAQPage JSON-LD) · { tip } highlighted tip · { related: [slug] } Read next links */
const BLOCKS = ["h", "p", "ul", "product", "pros", "cons", "table", "faq", "tip", "related"];

function blockHtml(b) {
  if (b.h) return `<h2>${esc(b.h)}</h2>`;
  if (b.p) return `<p>${esc(b.p)}</p>`;
  if (b.ul) return `<ul class="ticks">${b.ul.map(li => `<li>${icon("check")}<span>${esc(li)}</span></li>`).join("")}</ul>`;
  if (b.product) { const p = productByAsin(b.product); return p ? productInline(p) : ""; }
  if (b.pros || b.cons) {
    const good = !!b.pros, items = b.pros || b.cons;
    return `<div class="proscons ${good ? "pros" : "cons"}"><strong>${good ? "What owners like" : "Common complaints"}</strong><ul>${items.map(li => `<li>${esc(li)}</li>`).join("")}</ul></div>`;
  }
  if (b.table) {
    return `<div class="table-wrap"><table><thead><tr>${b.table.head.map(h => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${
      b.table.rows.map(r => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  if (b.faq) return `<div class="faq">${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>`;
  if (b.tip) return `<p class="tip"><strong>Tip:</strong> ${esc(b.tip)}</p>`;
  if (b.related) {
    const links = b.related.map(s => POSTS.find(p => p.slug === s)).filter(Boolean)
      .map(p => `<a href="${guideUrl(p.slug)}">${esc(p.title)}</a>`);
    return links.length ? `<p class="read-next"><strong>Read next:</strong> ${links.join(" · ")}</p>` : "";
  }
  return "";
}

/* Full guide markup. Used by tools/build.mjs to write guides/<slug>/index.html. */
function guideHtml(post) {
    const c = catById(post.cat);
    const t = postType(post);
    const body = post.body.map(blockHtml).join("");
    const updated = post.updated && post.updated !== post.date ? ` · Updated ${fmtDate(post.updated)}` : "";
    // Same-niche posts first, then the rest.
    const more = [...POSTS.filter(p => p.slug !== post.slug && p.cat === post.cat), ...POSTS.filter(p => p.cat !== post.cat)].slice(0, 3);
    return `
      <header class="post-hero art-${post.cat}">
        <div class="container narrow">
          <p class="eyebrow"><a href="${ROOT}blog.html">Blog</a> / <a href="${ROOT}blog.html?type=${t.id}">${t.label}</a> / <a href="${ROOT}category.html?cat=${c.id}">${c.name}</a></p>
          <h1>${esc(post.title)}</h1>
          <p class="lede">${esc(post.excerpt)}</p>
          <p class="post-byline">By the ${SITE.name} team · ${fmtDate(post.date)}${updated} · ${post.read}</p>
          ${post.pin ? `<a class="pin-btn" target="_blank" rel="noopener" href="https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(post.url)}&media=${encodeURIComponent(post.pin)}&description=${encodeURIComponent(post.title)}">Save to Pinterest</a>` : ""}
        </div>
      </header>
      <div class="container narrow">
        <p class="disclosure-inline">${SITE.name} is reader-supported. When you buy through links on this page we may earn a commission, at no extra cost to you.${t.id === "review" || t.id === "guide" || t.id === "compare" ? ` <a href="${ROOT}about.html#research">How we research</a>.` : ""}</p>
        <div class="prose">${body}</div>
      </div>
      <section class="section">
        <div class="container">
          <div class="section-head"><h2>More from the blog</h2><a class="link-arrow" href="${ROOT}blog.html">All posts ${icon("arrow")}</a></div>
          <div class="grid grid-posts">${more.map(postCard).join("")}</div>
        </div>
      </section>`;
}

if (typeof document !== "undefined") {
  renderHeader();
  renderFooter();
  const pageFn = pages[document.body.dataset.page];
  if (pageFn) pageFn();
}

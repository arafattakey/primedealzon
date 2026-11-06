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
        ${link(`${ROOT}blog.html`, "Guides", "blog")}
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
        <a href="${ROOT}blog.html">Buying guides</a>
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

function postCard(post) {
  const c = catById(post.cat);
  return `
    <article class="card post-card">
      <a class="post-art art-${post.cat}" href="${guideUrl(post.slug)}" tabindex="-1" aria-hidden="true">${icon(c.icon, "art-ico")}</a>
      <div class="post-body">
        <div class="post-meta">${c.name} · ${post.read}</div>
        <h3><a href="${guideUrl(post.slug)}">${esc(post.title)}</a></h3>
        <p>${esc(post.excerpt)}</p>
        <a class="link-arrow" href="${guideUrl(post.slug)}">Read the guide ${icon("arrow")}</a>
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
    const related = POSTS.filter(p => p.cat === c.id || p.body.some(b => b.product && productByAsin(b.product)?.cat === c.id));
    if (related.length) {
      grid.innerHTML += `<section class="cat-section"><div class="section-head"><h2>Related guides</h2></div><div class="grid grid-posts">${related.map(postCard).join("")}</div></section>`;
    }
  },

  blog() {
    document.getElementById("postGrid").innerHTML = POSTS.map(postCard).join("");
  },

  // Old URL (blog-post.html?slug=...): send visitors and crawlers to the static guide page.
  post() {
    const post = POSTS.find(p => p.slug === param("slug"));
    if (post) { location.replace(guideUrl(post.slug)); return; }
    document.getElementById("postRoot").innerHTML = `<div class="container narrow empty"><h1>Guide not found</h1><p>That guide may have moved.</p><a class="btn btn-primary" href="${ROOT}blog.html">See all guides</a></div>`;
  },
};

/* Full guide markup. Used by tools/build.mjs to write guides/<slug>/index.html. */
function guideHtml(post) {
    const c = catById(post.cat);
    const body = post.body.map(b => {
      if (b.h) return `<h2>${esc(b.h)}</h2>`;
      if (b.p) return `<p>${esc(b.p)}</p>`;
      if (b.ul) return `<ul class="ticks">${b.ul.map(li => `<li>${icon("check")}<span>${esc(li)}</span></li>`).join("")}</ul>`;
      if (b.product) { const p = productByAsin(b.product); return p ? productInline(p) : ""; }
      if (b.related) {
        const links = b.related.map(s => POSTS.find(p => p.slug === s)).filter(Boolean)
          .map(p => `<a href="${guideUrl(p.slug)}">${esc(p.title)}</a>`);
        return links.length ? `<p class="read-next"><strong>Read next:</strong> ${links.join(" · ")}</p>` : "";
      }
      return "";
    }).join("");
    // Same-niche guides first, then the rest.
    const more = [...POSTS.filter(p => p !== post && p.cat === post.cat), ...POSTS.filter(p => p.cat !== post.cat)].slice(0, 3);
    return `
      <header class="post-hero art-${post.cat}">
        <div class="container narrow">
          <p class="eyebrow"><a href="${ROOT}blog.html">Guides</a> / <a href="${ROOT}category.html?cat=${c.id}">${c.name}</a></p>
          <h1>${esc(post.title)}</h1>
          <p class="lede">${esc(post.excerpt)}</p>
          <p class="post-byline">By the ${SITE.name} team · ${post.date} · ${post.read}</p>
        </div>
      </header>
      <div class="container narrow">
        <p class="disclosure-inline">${SITE.name} is reader-supported. When you buy through links on this page we may earn a commission, at no extra cost to you.</p>
        <div class="prose">${body}</div>
      </div>
      <section class="section">
        <div class="container">
          <div class="section-head"><h2>More guides</h2><a class="link-arrow" href="${ROOT}blog.html">All guides ${icon("arrow")}</a></div>
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

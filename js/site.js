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
  // Coffee gear by kind, so cards don't all show the same cup.
  grinder: '<path d="M8 3h8l-1.5 5h-5L8 3Z"/><rect x="7" y="8" width="10" height="9" rx="2"/><path d="M12 17v3M9 21h6M17 11h2.5"/><circle cx="12" cy="12.5" r="1.6"/>',
  press: '<path d="M7 7h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7Z"/><path d="M12 2v11M9.5 2h5M7 13h10M17 10h1.5a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5H17"/>',
  dripper: '<path d="M4 5h16l-5 8H9L4 5Z"/><path d="M9.5 9h5M12 13v3"/><path d="M7 16h10v3a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-3Z"/>',
  kettle: '<path d="M5 11h11v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7Z"/><path d="M8 11V9a2.5 2.5 0 0 1 5 0v2M16 14c2.5 0 3.5-3 5-7"/><path d="M10.5 6.5V5"/>',
  moka: '<path d="M8 3h8l-1.2 6H9.2L8 3ZM9.2 9h5.6L17 21H7L9.2 9Z"/><path d="M8.2 14h7.6M16 5h2.5"/>',
  scale: '<rect x="3" y="11" width="18" height="8" rx="2"/><path d="M6 11V8h12v3"/><rect x="9" y="13.5" width="6" height="3" rx="1"/>',
  mug: '<path d="M7 7h10l-1.2 13a1 1 0 0 1-1 1H9.2a1 1 0 0 1-1-1L7 7Z"/><path d="M6 3.5h12V7H6zM8.5 11h7"/>',
  frother: '<path d="M10 2h4v7h-4zM12 9v8"/><circle cx="12" cy="19" r="2.5"/><path d="M9.5 19h5"/>',
  coldbrew: '<path d="M7 3h9v3l2 3v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3Z"/><path d="M7 10h11M10.5 13.5v4M14 13.5v4"/>',
  maker: '<path d="M5 3h14v5H5zM6 8v13h12V8"/><path d="M9 12h5v4a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-4ZM14 13h1a1.5 1.5 0 0 1 0 3h-1"/>',
  aeropress: '<path d="M8 2h8M9 2v4.5M15 2v4.5M7 6.5h10V17H7z"/><path d="M5.5 17h13v3h-13zM10 10h4M10 13h4"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8S10.5 3 8 4s0 4 4 4ZM12 8s1.5-5 4-4 0 4-4 4Z"/>',
};

// Which drawing fits a product or post (falls back to the category icon).
const KINDS = [
  ["gift", /\bgift/i], ["grinder", /grind/i], ["aeropress", /aeropress/i], ["moka", /moka|stovetop espresso/i],
  ["coldbrew", /cold brew|iced coffee/i], ["press", /french press/i], ["dripper", /v60|dripper|pour[- ]?over|chemex|paper filter/i],
  ["kettle", /kettle/i], ["scale", /\bscales?\b/i], ["mug", /\bmugs?\b|tumbler/i], ["frother", /froth/i],
  ["maker", /coffee maker|brewer|espresso machine|drip coffee/i],
];
const kindOf = text => (KINDS.find(([, re]) => re.test(text)) || [])[0];
const artIcon = (text, cat) => kindOf(text) || catById(cat)?.icon || "cup";

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
// Category hubs are static pages at category/<id>/ (built by tools/build.mjs).
const catUrl = (id, r = ROOT) => `${r}category/${id}/`;

/* ---------- Layout ----------
 * headerHtml/footerHtml are baked into every page by the build (so crawlers see the links);
 * the browser only fills them in when a page was not built that way. */

function headerHtml(r = ROOT, page = "") {
  const link = (href, label, key) => `<a href="${href}"${page === key ? ' aria-current="page"' : ""}>${label}</a>`;
  return `
    <div class="container header-inner">
      <a class="logo" href="${r}index.html" aria-label="${SITE.name} home">
        <span class="logo-mark">${icon("bolt")}</span>
        <span>Prime<b>Deal</b>Zon</span>
      </a>
      <button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="siteNav" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
      <nav class="nav" id="siteNav" aria-label="Main">
        ${link(`${r}index.html`, "Home", "home")}
        ${link(catUrl("coffee", r), "Coffee", "coffee")}
        ${link(`${r}blog.html`, "Blog", "blog")}
        ${link(`${r}category.html`, "Categories", "category")}
        ${link(`${r}about.html`, "About", "about")}
        <a class="nav-cta" href="${r}index.html#picks">Top picks</a>
      </nav>
    </div>`;
}

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  if (!el.querySelector("nav")) el.innerHTML = headerHtml(ROOT, document.body.dataset.page);
  const btn = document.getElementById("menuBtn");
  const nav = document.getElementById("siteNav");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
}

function footerHtml(r = ROOT) {
  return `
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="logo" href="${r}index.html"><span class="logo-mark">${icon("bolt")}</span><span>Prime<b>Deal</b>Zon</span></a>
        <p>Hand-picked coffee gear from Amazon, explained in plain English. We summarize what verified owners report, so you can choose faster.</p>
      </div>
      <div>
        <p class="footer-h">Shop</p>
        ${CATEGORIES.map(c => `<a href="${catUrl(c.id, r)}">${c.name}</a>`).join("")}
      </div>
      <div>
        <p class="footer-h">Site</p>
        <a href="${r}blog.html">Blog</a>
        <a href="${r}about.html">About us</a>
        <a href="${r}about.html#research">How we research</a>
        <a href="${r}disclaimer.html">Affiliate disclosure</a>
        <a href="${r}privacy.html">Privacy policy</a>
        <a href="${r}terms.html">Terms of use</a>
      </div>
    </div>
    <div class="container footer-legal">
      <p>${SITE.name} is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate we earn from qualifying purchases. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.</p>
      <p>&copy; ${new Date().getFullYear()} ${SITE.name}. Product selections last reviewed ${SITE.updated}.</p>
    </div>`;
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (el && !el.children.length) el.innerHTML = footerHtml();
}

/* ---------- Components ---------- */

function productCard(p) {
  const c = catById(p.cat);
  return `
    <article class="card product" data-cat="${p.cat}">
      <div class="product-art art-${p.cat} kind-${kindOf(p.title) || "none"}">
        ${icon(artIcon(p.title, p.cat), "art-ico")}
        ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
      </div>
      <div class="product-body">
        <div class="product-meta"><span>${esc(p.brand)}</span><span>·</span><a href="${catUrl(c.id)}">${c.name}</a></div>
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
      <div class="inline-art art-${c.id} kind-${kindOf(p.title) || "none"}">${icon(artIcon(p.title, p.cat), "art-ico")}</div>
      <div class="inline-body">
        <span class="inline-brand">${esc(p.brand)}${p.badge ? ` · ${esc(p.badge)}` : ""}</span>
        <strong>${esc(p.title)}</strong>
        <span class="inline-blurb">${esc(p.blurb)}</span>
      </div>
      <a class="btn btn-amazon btn-sm" href="${amazonUrl(p.asin)}" target="_blank" rel="nofollow sponsored noopener">Check price on Amazon</a>
    </aside>`;
}

function categoryCard(c) {
  const n = PRODUCTS.filter(p => p.cat === c.id).length;
  return `
    <a class="card cat-card art-${c.id}" href="${catUrl(c.id)}">
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
      <a class="post-art art-${post.cat} kind-${kindOf(post.title + " " + post.slug) || "none"}" href="${guideUrl(post.slug)}" tabindex="-1" aria-hidden="true">${icon(artIcon(post.title + " " + post.slug, post.cat), "art-ico")}</a>
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

  // category.html lists every category; old ?cat= links go to the static hub page.
  category() {
    const c = catById(param("cat"));
    if (c) { location.replace(catUrl(c.id)); return; }
    document.getElementById("catNav").innerHTML = CATEGORIES.map(x => `<a class="chip" href="${catUrl(x.id)}">${x.name}</a>`).join("");
    document.getElementById("catProducts").innerHTML = CATEGORIES.map(x => `
        <section class="cat-section">
          <div class="section-head"><h2>${x.name}</h2><a class="link-arrow" href="${catUrl(x.id)}">See all ${x.name.toLowerCase()} ${icon("arrow")}</a></div>
          <div class="grid grid-products">${PRODUCTS.filter(p => p.cat === x.id).map(productCard).join("")}</div>
        </section>`).join("");
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

/* Static category hub (category/<id>/index.html), rendered by tools/build.mjs. */
function hubHtml(c) {
  const posts = POSTS.filter(p => p.cat === c.id || (p.products || []).some(a => productByAsin(a)?.cat === c.id));
  const products = PRODUCTS.filter(p => p.cat === c.id);
  return `
    <section class="page-head">
      <div class="container">
        <p class="eyebrow"><a href="${ROOT}category.html">Categories</a> / ${esc(c.name)}</p>
        <h1>${c.id === "coffee" ? "Coffee gear worth buying" : `The best ${esc(c.name.toLowerCase())} on Amazon`}</h1>
        <p class="lede">${esc(c.blurb)}</p>
      </div>
    </section>
    <section class="container" style="padding-bottom:72px">
      <nav class="chips" aria-label="Categories">${CATEGORIES.map(x => `<a class="chip${x.id === c.id ? " active" : ""}" href="${catUrl(x.id)}"${x.id === c.id ? ' aria-current="page"' : ""}>${x.name}</a>`).join("")}</nav>
      ${posts.length ? `<div class="section-head"><h2>${esc(c.name)} guides</h2><a class="link-arrow" href="${ROOT}blog.html">All posts ${icon("arrow")}</a></div>
      <div class="grid grid-posts">${posts.map(postCard).join("")}</div>` : ""}
      <section class="cat-section">
        <div class="section-head"><div><h2>Our ${esc(c.name.toLowerCase())} picks</h2><p>Each one links to Amazon, where you see the live price and reviews.</p></div></div>
        <div class="grid grid-products">${products.map(productCard).join("")}</div>
      </section>
    </section>`;
}

/* Body blocks a post may use (validated by tools/build.mjs):
 *   { h } heading · { p } paragraph · { ul: [] } checklist · { product: ASIN } product card
 *   { pros: [] } / { cons: [] } owner-reported pros and cons · { table: { head: [], rows: [[]] } } comparison table
 *   { faq: [{ q, a }] } questions (also emitted as FAQPage JSON-LD) · { tip } highlighted tip · { related: [slug] } Read next links */
const BLOCKS = ["h", "p", "ul", "product", "pros", "cons", "table", "faq", "tip", "related"];

const slugify = s => String(s).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

function blockHtml(b, id) {
  if (b.h) return `<h2${id ? ` id="${id}"` : ""}>${esc(b.h)}</h2>`;
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
    // Section ids for the table of contents (unique per page).
    const used = new Set();
    const heads = [];
    const body = post.body.map(b => {
      if (!b.h) return blockHtml(b);
      let id = slugify(b.h) || "section", n = 2;
      while (used.has(id)) id = `${slugify(b.h)}-${n++}`;
      used.add(id);
      heads.push({ id, text: b.h });
      return blockHtml(b, id);
    }).join("");
    const toc = heads.length >= 3 ? `
        <nav class="toc" aria-label="On this page">
          <details open><summary>On this page</summary>
            <ol>${heads.map(h => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join("")}</ol>
          </details>
        </nav>` : "";
    // "Our top picks" box: the first three products in the post, for guides, comparisons and reviews.
    const picks = [...new Set(post.body.filter(b => b.product).map(b => b.product))].map(productByAsin).filter(Boolean).slice(0, 3);
    const topPicks = picks.length >= 2 && t.id !== "howto" ? `
        <section class="top-picks" aria-label="Our top picks">
          <p class="tp-title">${t.id === "compare" ? "The contenders" : "Our top picks"}</p>
          <ol>${picks.map((p, i) => `
            <li>
              <span class="tp-art art-${p.cat} kind-${kindOf(p.title) || "none"}">${icon(artIcon(p.title, p.cat))}</span>
              <span class="tp-body"><span class="tp-label">${esc(p.badge || (i === 0 ? "Top pick" : "Also great"))}</span><strong>${esc(p.title)}</strong></span>
              <a class="btn btn-amazon btn-sm" href="${amazonUrl(p.asin)}" target="_blank" rel="nofollow sponsored noopener">Check price</a>
            </li>`).join("")}
          </ol>
        </section>` : "";
    const lastUpdated = post.updated && post.updated !== post.date ? `Updated ${fmtDate(post.updated)}` : `Published ${fmtDate(post.date)}`;
    // Same-niche posts first, then the rest.
    const more = [...POSTS.filter(p => p.slug !== post.slug && p.cat === post.cat), ...POSTS.filter(p => p.cat !== post.cat)].slice(0, 3);
    return `
      <header class="post-hero art-${post.cat}">
        <div class="container narrow">
          <p class="eyebrow"><a href="${ROOT}blog.html">Blog</a> / <a href="${ROOT}blog.html?type=${t.id}">${t.label}</a> / <a href="${catUrl(c.id)}">${c.name}</a></p>
          <h1>${esc(post.title)}</h1>
          <p class="lede">${esc(post.excerpt)}</p>
          <p class="post-byline">By the <a href="${ROOT}about.html">${SITE.name} editors</a> · ${lastUpdated} · ${post.read}</p>
          ${post.pin ? `<a class="pin-btn" target="_blank" rel="noopener" href="https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(post.url)}&media=${encodeURIComponent(post.pin)}&description=${encodeURIComponent(post.title)}">Save to Pinterest</a>` : ""}
        </div>
      </header>
      <div class="container narrow">
        <p class="disclosure-inline">${SITE.name} is reader-supported. When you buy through links on this page we may earn a commission, at no extra cost to you.${t.id === "review" || t.id === "guide" || t.id === "compare" ? ` <a href="${ROOT}about.html#research">How we research</a>.` : ""}</p>
${topPicks}${toc}
        <div class="prose">${body}</div>
        <aside class="author-box">
          <span class="logo-mark">${icon("bolt")}</span>
          <div>
            <strong>About the ${SITE.name} editors</strong>
            <p>We're a small, independent team. We don't run a testing lab: for every product we read the full listing, the manufacturer's specs and a large sample of verified owner reviews, the critical ones especially, then summarize the patterns in plain English. No brand pays to be included. <a href="${ROOT}about.html#research">How we research</a></p>
          </div>
        </aside>
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

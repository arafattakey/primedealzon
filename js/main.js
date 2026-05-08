// Hamburger menu
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");
if (hamburger) hamburger.addEventListener("click", () => nav.classList.toggle("open"));

// Build deal cards
function buildCards(filter) {
  const grid = document.getElementById("dealsGrid");
  if (!grid) return;
  const filtered = filter === "all" ? products : products.filter(p => p.cat === filter);
  grid.innerHTML = filtered.map(p => `
    <div class="deal-card" data-cat="${p.cat}">
      <div class="deal-img">${p.emoji}</div>
      <div class="deal-body">
        <div class="deal-cat">${p.cat.replace("-", " & ")}</div>
        <div class="deal-title">${p.title}</div>
        <div class="deal-rating">${p.rating}</div>
        <div class="deal-prices">
          <span class="deal-price-now">${p.price}</span>
          <span class="deal-price-old">${p.old}</span>
          <span class="deal-save">-${p.save}</span>
        </div>
        <a class="deal-cta" href="https://www.amazon.com/dp/${p.asin}?tag=${AFFILIATE_TAG}" target="_blank" rel="nofollow noopener">View Deal on Amazon</a>
      </div>
    </div>`).join("");
}

// Filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    buildCards(btn.dataset.filter);
  });
});

buildCards("all");

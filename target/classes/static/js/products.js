/*
  products.js — Category Browsing, Search, Filter & Cart (FIXED)
*/

let currentProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  initShop();
});

// ─── MAP PRODUCT ─────────────────────────────────────────────
function mapProduct(p) {
  return {
    id: p.id,
    name: p.name || "Unnamed",
    category: p.category || "Uncategorized",
    brand: p.brand || "",
    gender: p.gender || "",
    price: p.price || 0,
    discount: p.discount || 0,
    rating: p.rating || 0,
    image: p.imageUrl || getAutoImage(p.name, p.category),
    desc: p.description || "",
    stock: p.stock || 0,
  };
}

// ─── AUTO IMAGE ──────────────────────────────────────────────
function getAutoImage(name, category) {
  const label = `${name || ""} ${category || ""}`.toLowerCase();

  if (label.includes("aviator") || label.includes("sunglass"))
    return "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=500";

  if (label.includes("computer") || label.includes("blue"))
    return "https://images.unsplash.com/photo-1577922232320-f47d4e51240a?q=80&w=500";

  if (label.includes("contact"))
    return "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=500";

  return "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=500";
}

// ─── INIT SHOP ───────────────────────────────────────────────
async function initShop() {
  try {
    const data = await window.api.getProducts();

    // ✅ SAFE ARRAY CHECK
    currentProducts = Array.isArray(data) ? data.map(mapProduct) : [];

    window.products = currentProducts;
  } catch (err) {
    console.warn("API failed, fallback to local:", err);

    currentProducts = Array.isArray(window.products) ? window.products : [];
  }

  const urlParams = new URLSearchParams(window.location.search);

  // ✅ CATEGORY FROM URL
  const categoryParam = urlParams.get("category");
  if (categoryParam) {
    const checkbox = document.querySelector(
      `input[name="category"][value="${categoryParam}"]`,
    );
    if (checkbox) checkbox.checked = true;
  }

  // ✅ SEARCH FROM URL
  const searchParam = urlParams.get("search");
  if (searchParam) {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = searchParam;
  }

  renderProducts(filterAndSort());

  // ─── EVENT LISTENERS ───
  document.querySelectorAll('input[name="category"]').forEach((cb) => {
    cb.addEventListener("change", () => renderProducts(filterAndSort()));
  });

  const priceRange = document.getElementById("priceRange");
  if (priceRange) {
    priceRange.addEventListener("input", (e) => {
      const el = document.getElementById("priceValue");
      if (el) el.innerText = `₹${e.target.value}`;
      renderProducts(filterAndSort());
    });
  }

  const sortEl = document.getElementById("sort");
  if (sortEl) {
    sortEl.addEventListener("change", () => renderProducts(filterAndSort()));
  }

  const searchEl = document.getElementById("searchInput");
  if (searchEl) {
    searchEl.addEventListener("input", () => renderProducts(filterAndSort()));
  }
}

// ─── FILTER + SORT ───────────────────────────────────────────
function filterAndSort() {
  const checkedCats = Array.from(
    document.querySelectorAll('input[name="category"]:checked'),
  ).map((cb) => cb.value);

  const priceRange = document.getElementById("priceRange");
  const maxPrice = priceRange ? parseInt(priceRange.value) : Infinity;

  const searchEl = document.getElementById("searchInput");
  const searchTerm = searchEl ? searchEl.value.toLowerCase().trim() : "";

  let filtered = currentProducts.filter((p) => {
    const catMatch =
      checkedCats.length === 0 || checkedCats.includes(p.category);
    const priceMatch = p.price <= maxPrice;
    const searchMatch =
      !searchTerm || p.name.toLowerCase().includes(searchTerm);

    return catMatch && priceMatch && searchMatch;
  });

  const sortEl = document.getElementById("sort");
  const sortValue = sortEl ? sortEl.value : "default";
  if (sortValue === "low-high") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === "high-low") {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    filtered.sort((a, b) => b.rating - a.rating);
  }
  return filtered;
}

// ─── RENDER PRODUCTS ─────────────────────────────────────────
function renderProducts(items) {
  const grid = document.getElementById("product-grid");
  const countLabel = document.getElementById("result-count");

  if (!grid) return;

  if (countLabel) countLabel.innerText = `Showing ${items.length} products`;

  if (items.length === 0) {
    grid.innerHTML =
      '<p style="grid-column:1/-1;text-align:center;padding:40px;color:#888;">No products found.</p>';
    return;
  }

  grid.innerHTML = items
    .map(
      (product) => `
        <div class="product-card fade-in">
            <div class="product-img-wrapper" onclick="goToProduct('${product.id}')">
                <img src="${product.image}" class="product-img">

                <div class="product-actions">
                    <button class="action-btn" onclick="addToCartFromGrid(event, '${product.id}')">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>

                    <button class="action-btn" onclick="goToProduct('${product.id}')">
                        <i class="fa-regular fa-eye"></i>
                    </button>
                </div>
            </div>

            <div class="product-info" style="padding:15px;">
                <h3>${product.name}</h3>
                <div style="color:#888;font-size:0.8rem;">
                    ${product.brand} · ${product.category}
                </div>

                <div class="flex justify-between" style="margin:10px 0;">
                    <span>₹${product.price}</span>
                    <span style="color:#f59e0b;">
                        ${product.rating} ★
                    </span>
                </div>

                <button onclick="buyNow('${product.id}')" class="btn-buy-now">
                    Buy Now
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

// ─── NAVIGATION ──────────────────────────────────────────────
function goToProduct(id) {
  window.location.href = window.location.pathname.includes("/pages/")
    ? `product.html?id=${id}`
    : `pages/product.html?id=${id}`;
}

// ─── ADD TO CART ─────────────────────────────────────────────
window.addToCartFromGrid = async function (e, id) {
  if (e) e.stopPropagation();

  if (!window.api.isLoggedIn()) {
    window.location.href = window.location.pathname.includes("/pages/")
      ? "login.html"
      : "pages/login.html";
    return;
  }

  const product = currentProducts.find((p) => String(p.id) === String(id));
  if (!product) return;

  try {
    await window.api.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image,
    });

    updateCartCount();
    showToast(`✓ ${product.name} added`);
  } catch (err) {
    console.error(err);
    showToast("Error adding to cart");
  }
};

// ─── BUY NOW ────────────────────────────────────────────────
window.buyNow = function (id) {
  if (!window.api.isLoggedIn()) {
    window.location.href = window.location.pathname.includes("/pages/")
      ? "login.html"
      : "pages/login.html";
    return;
  }

  const product = currentProducts.find((p) => String(p.id) === String(id));
  if (!product) return;

  window.api
    .addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image,
    })
    .then(() => {
      window.location.href = "checkout.html";
    });
};

// ─── TOAST ──────────────────────────────────────────────────
function showToast(text) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText =
      "position:fixed;bottom:30px;right:30px;background:#00e5ff;color:#000;padding:14px 24px;border-radius:30px;z-index:9999;";
    document.body.appendChild(toast);
  }

  toast.innerText = text;
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 3000);
}

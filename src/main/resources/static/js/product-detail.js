/* 
   Product Detail Logic
*/

document.addEventListener("DOMContentLoaded", () => {
  loadProductDetails();
});

function loadProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (window.api && window.api.getProductById) {
    window.api
      .getProductById(productId)
      .then((p) => {
        const mapped = mapBackendProduct(p);
        renderProductView(mapped);
        loadReviews(mapped.id); // ✅ FIX
        renderRelated(mapped);
      })
      .catch(() => {
        const product = (window.products || [])[0];
        renderProductView(product);
        loadReviews(product.id); // ✅ FIX
        renderRelated(product);
      });
    return;
  }

  const product =
    products.find((p) => String(p.id) === String(productId)) || products[0];

  if (!product) {
    document.getElementById("product-container").innerHTML =
      "<h2>Product not found</h2>";
    return;
  }

  renderProductView(product);
  loadReviews(product.id); // ✅ IMPORTANT
  renderRelated(product);
}

function mapBackendProduct(p) {
  if (!p) return null;
  return {
    id: p.id || p._id || p.id,
    name: p.name || p.title || "Unnamed",
    category: p.category || "Uncategorized",
    brand: p.brand || "",
    gender: p.gender || "",
    price: p.price || p.amount || 0,
    discount: p.discount || 0,
    description: p.description,
    rating: p.rating || 0,
    image: p.imageUrl || p.image || "/static/placeholder.png",
    desc: p.description || p.desc || "",
    stock: p.stock || 0,
    createdAt: p.createdAt || p.date,
  };
}

function renderProductView(product) {
  const container = document.getElementById("product-container");

  container.innerHTML = `
  <div style="
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:60px;
    padding:40px;
    color:#fff;
    font-family:Outfit, sans-serif;
  ">

    <!-- LEFT IMAGE -->
    <div>
      <div id="mainImgBox"
        onmousemove="zoomImage(event)"
        onmouseleave="resetZoom()"
        style="
          background:radial-gradient(circle,#1a1a1a,#0a0a0a);
          border-radius:20px;
          padding:40px;
          text-align:center;
        ">
        <img src="${product.image}" id="mainImg"
          style="width:80%; transition:0.3s;">
      </div>

      <div style="display:flex; gap:15px; margin-top:20px;">
        <img src="${product.image}" onclick="changeImage('${product.image}', this)"
          style="width:70px;border-radius:10px;cursor:pointer;border:2px solid #d9ff00;">
        <img src="${product.image}" onclick="changeImage('${product.image}', this)"
          style="width:70px;border-radius:10px;cursor:pointer;opacity:.6;filter:hue-rotate(90deg);">
        <img src="${product.image}" onclick="changeImage('${product.image}', this)"
          style="width:70px;border-radius:10px;cursor:pointer;opacity:.6;filter:hue-rotate(180deg);">
      </div>
    </div>

    <!-- RIGHT INFO -->
    <div>

      <span style="color:#d9ff00;font-weight:600;">${product.brand || "Premium Brand"}</span>

      <h1 style="font-size:40px;margin:10px 0;">${product.name}</h1>

      <!-- RATING -->
      <div style="display:flex;align-items:center;gap:10px;color:gold;">
        ${getStarRating(product.rating)}
        <span id="reviewCountText" style="color:#aaa;">(${product.rating}/5)</span>
      </div>

      <!-- PRICE -->
      <div style="display:flex;align-items:center;gap:15px;margin:15px 0;">
        <h2 style="font-size:32px;">₹${product.price}</h2>
        <span style="text-decoration:line-through;color:#777;">
          ₹${Math.round(product.price * 1.2)}
        </span>
      </div>

      <p style="color:#aaa; line-height:1.6;">
        ${product.description}
      </p>

      <!-- DIVIDER -->
      <div style="
        height:1px;
        background:linear-gradient(to right,transparent,#333,transparent);
        margin:25px 0;
      "></div>

      <!-- QTY -->
      <div style="display:flex;align-items:center;gap:15px;">
        <span>Quantity:</span>
        <div style="
          display:flex;
          align-items:center;
          gap:15px;
          background:#111;
          padding:10px 15px;
          border-radius:50px;
        ">
          <button onclick="updateQty(-1)" style="background:none;border:none;color:#fff;font-size:18px;">−</button>
          <span id="qtyVal">1</span>
          <button onclick="updateQty(1)" style="background:none;border:none;color:#fff;font-size:18px;">+</button>
        </div>
      </div>

      <!-- ACTIONS -->
      <div style="display:flex;gap:15px;margin-top:25px;">
        <button onclick="addToCartDetail(${product.id})"
          style="
            flex:1;
            padding:15px;
            background:#fff;
            color:#000;
            border:none;
            border-radius:10px;
            font-weight:600;
            cursor:pointer;
          ">
          Add to Cart
        </button>

        <button onclick="toggleWishlist(${product.id}, this)"
          style="
            width:50px;
            border-radius:10px;
            border:1px solid #333;
            background:transparent;
            color:#fff;
            cursor:pointer;
          ">
          ♥
        </button>
      </div>

      <!-- TABS -->
      <div style="margin-top:40px;">

        <div style="
          display:flex;
          gap:30px;
          border-bottom:1px solid #222;
        ">
          <button class="tab-btn"
            onclick="openTab('desc', this)"
            style="
              background:none;
              border:none;
              color:#fff;
              padding:10px;
              position:relative;
              cursor:pointer;
            ">
            Description
            <span class="active-line" style="
              position:absolute;
              bottom:-1px;
              left:0;
              width:100%;
              height:2px;
              background:#d9ff00;
              box-shadow:0 0 8px #d9ff00;
            "></span>
          </button>

          <button class="tab-btn"
            onclick="openTab('reviews', this)"
            style="
              background:none;
              border:none;
              color:#888;
              padding:10px;
              position:relative;
              cursor:pointer;
            ">
            Reviews
          </button>
        </div>

        <!-- DESC -->
        <div id="desc-tab" style="margin-top:20px;">
  <p style="color:#aaa;">
    ${product.description || "No description available"}
  </p>
</div>

        <!-- REVIEWS -->
        <div id="reviews-tab" style="display:none;margin-top:20px;">

  <!-- ADD REVIEW -->
  <div style="
    background:#0f0f0f;
    padding:20px;
    border-radius:15px;
    display:flex;
    flex-direction:column;
    gap:10px;
    margin-bottom:20px;
  ">
    <input id="reviewName" placeholder="Your name"
      style="background:#111;border:none;padding:10px;color:#fff;border-radius:8px;">

    <select id="reviewRating"
      style="background:#111;border:none;padding:10px;color:#fff;border-radius:8px;">
      <option value="5">⭐⭐⭐⭐⭐</option>
      <option value="4">⭐⭐⭐⭐</option>
      <option value="3">⭐⭐⭐</option>
      <option value="2">⭐⭐</option>
      <option value="1">⭐</option>
    </select>

    <textarea id="reviewText" placeholder="Write review..."
      style="background:#111;border:none;padding:10px;color:#fff;border-radius:8px;"></textarea>

    <button onclick="submitReview('${product.id}')"
      style="background:#d9ff00;border:none;padding:12px;border-radius:10px;font-weight:bold;">
      Submit Review
    </button>
  </div>

  <!-- REVIEW LIST -->
  <div id="reviewsList"></div>

</div>
      </div>

    </div>
  </div>
  `;

  // animation
  gsap.from("#product-container > div > div", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
  });
}

function openTab(tab, btn) {
  document.querySelectorAll("#desc-tab, #reviews-tab").forEach((el) => {
    el.style.display = "none";
    el.style.opacity = 0;
  });

  const activeTab = document.getElementById(tab + "-tab");
  activeTab.style.display = "block";

  setTimeout(() => {
    activeTab.style.opacity = 1;
  }, 50);

  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.style.color = "#888";
    const line = b.querySelector(".active-line");
    if (line) line.remove();
  });

  btn.style.color = "#fff";

  const line = document.createElement("span");
  line.className = "active-line";
  line.style.cssText = `
    position:absolute;
    bottom:-1px;
    left:0;
    width:100%;
    height:2px;
    background:#d9ff00;
    box-shadow:0 0 8px #d9ff00;
  `;
  btn.appendChild(line);
}

function renderRelated(currentProduct) {
  const related = products
    .filter(
      (p) =>
        p.category === currentProduct.category && p.id !== currentProduct.id,
    )
    .slice(0, 4);
  const container = document.getElementById("related-products");

  if (related.length === 0) {
    container.innerHTML = "<p>No related products found.</p>";
    return;
  }

  related.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.onclick = () =>
      (window.location.href = `product.html?id=${product.id}`);
    card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="flex justify-between">
                    <span class="product-price">₹${product.price}</span>
                </div>
            </div>
        `;
    container.appendChild(card);
  });
}

// Interactivity Functions
function changeImage(src, btn) {
  const mainImg = document.getElementById("mainImg");
  // Basic fade
  mainImg.style.opacity = 0;
  setTimeout(() => {
    mainImg.src = src;
    mainImg.style.opacity = 1;
  }, 200);

  document
    .querySelectorAll(".thumb-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}

function zoomImage(e) {
  const box = document.getElementById("mainImgBox");
  const img = document.getElementById("mainImg");

  const x = e.clientX - box.getBoundingClientRect().left;
  const y = e.clientY - box.getBoundingClientRect().top;

  img.style.transformOrigin = `${x}px ${y}px`;
  img.style.transform = "scale(2)";
}

function resetZoom() {
  const img = document.getElementById("mainImg");
  img.style.transform = "scale(1)";
}

function updateQty(change) {
  const el = document.getElementById("qtyVal");
  let val = parseInt(el.innerText);
  val += change;
  if (val < 1) val = 1;
  el.innerText = val;
}

function getStarRating(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) stars += '<i class="fa-solid fa-star"></i>';
    else if (i - 0.5 <= rating)
      stars += '<i class="fa-solid fa-star-half-stroke"></i>';
    else stars += '<i class="fa-regular fa-star"></i>';
  }
  return stars;
}

function addToCartDetail(id) {
  const qty = parseInt(document.getElementById("qtyVal").innerText);
  // find product in window.products or use API
  const product = (window.products || []).find(
    (p) => String(p.id) === String(id),
  );

  if (window.api && window.api.addToCart) {
    window.api
      .addToCart({ productId: id, quantity: qty })
      .then(() => {
        updateCartCount();
        showToast(`Added ${qty} x ${product ? product.name : "item"} to cart`);
      })
      .catch(() => {
        // fallback local
        fallbackLocalAdd();
      });
    return;
  }

  fallbackLocalAdd();

  function fallbackLocalAdd() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => String(item.id) === String(id));

    if (existing) existing.quantity += qty;
    else
      cart.push({
        ...(product || { id, name: "Item", price: 0 }),
        quantity: qty,
      });

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    const toast = document.getElementById("toast");
    toast.innerText = `Added ${qty} x ${product ? product.name : "item"} to cart`;
    toast.classList.remove("hidden");
    toast.style.opacity = 1;
    setTimeout(() => {
      toast.style.opacity = 0;
      setTimeout(() => toast.classList.add("hidden"), 300);
    }, 3000);
  }
}
async function submitReview(productId) {
  const name = document.getElementById("reviewName").value.trim();
  const rating = parseInt(document.getElementById("reviewRating").value);
  const text = document.getElementById("reviewText").value.trim();

  if (!name || !text) {
    alert("Please fill all fields");
    return;
  }

  // ✅ BACKEND CALL
  if (window.api && window.api.addReview) {
    try {
      await window.api.addReview({
        productId: productId,
        rating: rating,
        comment: text,
      });

      // clear
      document.getElementById("reviewName").value = "";
      document.getElementById("reviewText").value = "";

      loadReviews(productId);

      // switch tab
      document.querySelectorAll(".tab-btn")[1].click();

      return;
    } catch (err) {
      console.error("Review API failed", err);
    }
  }

  // 🔁 FALLBACK LOCAL
  const newReview = {
    name,
    rating,
    text,
    date: new Date().toLocaleDateString(),
  };

  const key = "reviews_" + productId;
  let reviews = JSON.parse(localStorage.getItem(key)) || [];

  reviews.unshift(newReview);
  localStorage.setItem(key, JSON.stringify(reviews));

  loadReviews(productId);
}

async function loadReviews(productId) {
  const list = document.getElementById("reviewsList");
  if (!list) return;

  // ✅ TRY BACKEND FIRST
  if (window.api && window.api.getReviewsByProduct) {
    try {
      const reviews = await window.api.getReviewsByProduct(productId);

      if (!reviews || reviews.length === 0) {
        list.innerHTML = `<p style="color:#888;">No reviews yet</p>`;
        return;
      }

      list.innerHTML = reviews
        .map(
          (r) => `
        <div style="
          background:#0f0f0f;
          padding:20px;
          border-radius:15px;
          margin-bottom:15px;
        ">
          <div style="display:flex;justify-content:space-between;">
            <strong>${r.username}</strong>
            <span style="color:#aaa;font-size:12px;">
              ${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Now"}
            </span>
          </div>

          <div style="color:gold;margin:6px 0;">
            ${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}
          </div>

          <p style="color:#aaa;">${r.comment}</p>
        </div>
      `,
        )
        .join("");

      // ✅ update count
      if (window.updateReviewCount) {
        updateReviewCount(productId, reviews.length);
      }

      return;
    } catch (err) {
      console.warn("Backend reviews failed, fallback local");
    }
  }

  // 🔁 FALLBACK LOCAL STORAGE
  const reviews =
    JSON.parse(localStorage.getItem("reviews_" + productId)) || [];

  if (reviews.length === 0) {
    list.innerHTML = `<p style="color:#888;">No reviews yet</p>`;
    return;
  }

  list.innerHTML = reviews
    .map(
      (r) => `
    <div style="
      background:#0f0f0f;
      padding:20px;
      border-radius:15px;
      margin-bottom:15px;
    ">
      <strong>${r.name}</strong>
      <div style="color:gold;">
        ${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}
      </div>
      <p>${r.text}</p>
    </div>
  `,
    )
    .join("");
}

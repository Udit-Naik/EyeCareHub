/* 
   Main JS - Global Logic
*/

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  updateCartCount();
  initTheme();
  initSearch();
  initUserUI();
  const productId = new URLSearchParams(window.location.search).get("id");

  if (productId) {
    loadReviews(productId);
    updateReviewCount(productId);
  }
  const notiBtn = document.getElementById("notificationBtn");

  if (notiBtn) {
    notiBtn.addEventListener("click", showNotifications);
  }
});

function initUserUI() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("jwtToken");

  const loginLink = document.getElementById("loginLink");
  const avatar = document.getElementById("userAvatar");
  const dropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!loginLink || !avatar) return;

  if (user && token) {
    // Show avatar
    loginLink.style.display = "none";
    avatar.style.display = "block";

    avatar.src = `https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`;

    // Toggle dropdown
    avatar.onclick = () => {
      dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
    };

    // Logout
    logoutBtn.onclick = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("jwtToken");

      window.location.href = window.location.pathname.includes("/pages/")
        ? "login.html"
        : "pages/login.html";
    };

    // Close dropdown outside click
    document.addEventListener("click", (e) => {
      if (!document.getElementById("userSection").contains(e.target)) {
        dropdown.style.display = "none";
      }
    });
  } else {
    loginLink.style.display = "block";
    avatar.style.display = "none";
  }
}
// Theme Logic
function initTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "light") {
    document.body.classList.add("light-theme");
  }

  // Insert toggle button if not exists (usually in nav)
  // For now assuming we might add a toggle button or just expose function
  // Let's add a floating toggle for demo
  const toggle = document.createElement("button");
  toggle.className = "icon-btn";
  toggle.innerHTML =
    theme === "light"
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  toggle.style.position = "fixed";
  toggle.style.bottom = "20px";
  toggle.style.right = "20px";
  toggle.style.background = "var(--bg-card)";
  toggle.style.padding = "15px";
  toggle.style.borderRadius = "50%";
  toggle.style.zIndex = "9999";
  toggle.style.border = "1px solid var(--border-color)";
  toggle.style.cursor = "pointer";

  toggle.onclick = () => {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    toggle.innerHTML = isLight
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  };

  document.body.appendChild(toggle);
}

// Search Logic
function initSearch() {
  // Create Modal
  const modal = document.createElement("div");
  modal.className = "search-modal";
  modal.innerHTML = `
        <div class="close-search"><i class="fa-solid fa-xmark"></i></div>
        <div class="search-box">
            <input type="text" class="search-input" placeholder="Search products..." id="searchInput">
        </div>
    `;
  document.body.appendChild(modal);

  const triggers = document.querySelectorAll(".search-trigger"); // Add this class to nav search icon
  const close = modal.querySelector(".close-search");
  const input = modal.querySelector("#searchInput");

  triggers.forEach((t) =>
    t.addEventListener("click", () => {
      modal.classList.add("active");
      setTimeout(() => document.getElementById("searchInput").focus(), 100);
    }),
  );

  close.addEventListener("click", () => modal.classList.remove("active"));

  // Search functionality
  document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = e.target.value;
      // Redirect to category page with search (simulated)
      // Ideally we'd filter by name, but for now just redirect
      if (window.location.href.includes("pages/")) {
        window.location.href = `categories.html?search=${query}`;
      } else {
        window.location.href = `pages/categories.html?search=${query}`;
      }
    }
  });

  // Handle Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.classList.remove("active");
  });
}

// Navbar Scroll Effect
function initNavbar() {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// Cart count badge — tries backend first, falls back to localStorage
// ─── CART COUNT ─────────────────────────
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  if (window.api && window.api.isLoggedIn && window.api.isLoggedIn()) {
    // Try backend first
    window.api
      .getCart()
      .then((serverCart) => {
        const items = serverCart && serverCart.items ? serverCart.items : [];
        const total = items.reduce(
          (acc, item) => acc + (item.quantity || 0),
          0,
        );
        cartCount.innerText = total;
      })
      .catch(() => {
        // fallback to localStorage
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartCount.innerText = cart.reduce(
          (acc, item) => acc + (item.quantity || 1),
          0,
        );
      });
  } else {
    // fallback if user not logged in
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartCount.innerText = cart.reduce(
      (acc, item) => acc + (item.quantity || 1),
      0,
    );
  }
}

// ─── LOAD REVIEWS ─────────────────────────
function loadReviews(productId) {
  const list = document.getElementById("reviewsList");
  if (!list) return;

  // Try backend if available
  if (window.api && window.api.getReviewsByProduct) {
    window.api
      .getReviewsByProduct(productId)
      .then((reviews) => {
        if (!reviews || reviews.length === 0) {
          list.innerHTML = `<p style="color:#888;">No reviews yet</p>`;
          updateReviewCount(productId, 0);
          return;
        }
        renderReviews(list, reviews, productId);
      })
      .catch(() => {
        // fallback localStorage
        renderLocalReviews(list, productId);
      });
  } else {
    renderLocalReviews(list, productId);
  }
}

// ─── RENDER REVIEWS HELPER ───────────────
function renderReviews(container, reviews, productId) {
  // Sort latest first
  reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  container.innerHTML = reviews
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

  updateReviewCount(productId, reviews.length);
}

// ─── LOCAL STORAGE FALLBACK ─────────────
function renderLocalReviews(container, productId) {
  const reviews =
    JSON.parse(localStorage.getItem("reviews_" + productId)) || [];

  if (reviews.length === 0) {
    container.innerHTML = `<p style="color:#888;">No reviews yet</p>`;
    updateReviewCount(productId, 0);
    return;
  }

  container.innerHTML = reviews
    .map(
      (r) => `
    <div style="
      background:#0f0f0f;
      padding:20px;
      border-radius:15px;
      margin-bottom:15px;
    ">
      <div style="display:flex;justify-content:space-between;">
        <strong>${r.name}</strong>
        <span style="color:#aaa;font-size:12px;">${r.date}</span>
      </div>
      <div style="color:gold;margin:6px 0;">
        ${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}
      </div>
      <p style="color:#aaa;">${r.text}</p>
    </div>
  `,
    )
    .join("");

  updateReviewCount(productId, reviews.length);
}

// ─── SUBMIT REVIEW ───────────────────────

async function submitReview(productId) {
  const name = document.getElementById("reviewName").value.trim();
  const rating = parseInt(document.getElementById("reviewRating").value);
  const text = document.getElementById("reviewText").value.trim();

  if (!name || !text) {
    alert("Please fill all fields");
    return;
  }

  try {
    if (window.api && window.api.addReview) {
      await window.api.addReview(productId, {
        rating: rating,
        comment: text,
      });
    }

    document.getElementById("reviewName").value = "";
    document.getElementById("reviewText").value = "";

    loadReviews(productId);

    document.querySelectorAll(".tab-btn")[1]?.click();
  } catch (err) {
    console.error("Review API failed", err);
  }
}
// ─── GLOBAL FUNCTIONS ───────────────────
window.updateCartCount = updateCartCount;
window.updateReviewCount = function (productId, count) {
  const reviews =
    count !== undefined
      ? count
      : JSON.parse(localStorage.getItem("reviews_" + productId))?.length || 0;

  const reviewBtn = document.querySelector(
    `button[onclick*="openTab('reviews'"]`,
  );

  if (reviewBtn) {
    reviewBtn.innerText = `Reviews (${reviews})`;
  }
};

// api.js — Central API helper for EyeCareHub
const BASE = "http://localhost:8080";

// ─── Helpers ─────────────────────────────────────────
function authHeaders(additional = {}) {
  const token = localStorage.getItem("jwtToken");
  const headers = { "Content-Type": "application/json", ...additional };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function fetchJson(url, options = {}) {
  options.headers = { ...options.headers, ...authHeaders() };

  const res = await fetch(BASE + url, options);

  if (res.status === 401) {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    window.location.href = "/pages/login.html";
    return;
  }

  if (!res.ok) {
    let errorText;
    try {
      errorText = JSON.stringify(await res.json());
    } catch {
      errorText = await res.text();
    }
    throw new Error(`${res.status}: ${errorText}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ─── Auth APIs ──────────────────────────────────────
async function signin(email, password) {
  const data = await fetchJson("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // ✅ SAVE TOKEN HERE
  const token = data.accessToken || data.token;

  if (!token) {
    throw new Error("Token not received from server");
  }

  localStorage.setItem("jwtToken", token);
  localStorage.setItem("user", JSON.stringify(data));

  return data;
}

async function signup(data) {
  return fetchJson("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function getCurrentUser() {
  return fetchJson("/api/auth/me");
}

// ─── Auth Helpers ───────────────────────────────────
function isLoggedIn() {
  return !!localStorage.getItem("jwtToken");
}

function getStoredUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = "/pages/login.html";
  }
}

function logout() {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
  window.location.href = "/pages/login.html";
}

// ─── Products ───────────────────────────────────────────────────────────
async function getProducts() {
  return fetchJson("/api/products");
}
async function getProductById(id) {
  return fetchJson(`/api/products/${id}`);
}
async function getProductsByCategory(category) {
  return fetchJson(`/api/products/category/${encodeURIComponent(category)}`);
}
async function searchProducts(name) {
  return fetchJson(`/api/products/search?name=${encodeURIComponent(name)}`);
}
async function filterProductsByPrice(min, max) {
  return fetchJson(`/api/products/filter?min=${min}&max=${max}`);
}

// Admin product endpoints
async function getProducts() {
  return fetchJson("/api/products");
}

// ✅ PAGINATION (IMPORTANT)
async function getProductsPage(page = 0, size = 5) {
  return fetchJson(`/api/products/page?page=${page}&size=${size}`);
}

// CREATE
async function createProduct(product) {
  return fetchJson("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

// UPDATE
async function updateProduct(id, product) {
  return fetchJson(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

// DELETE
async function deleteProduct(id) {
  return fetchJson(`/api/products/${id}`, {
    method: "DELETE",
  });
}
// ─── Cart ───────────────────────────────────────────────────────────────
async function getCart() {
  return fetchJson("/api/cart");
}
async function addToCart(cartItem) {
  return fetchJson("/api/cart/add", {
    method: "POST",
    body: JSON.stringify(cartItem),
  });
}
async function removeFromCart(productId) {
  return fetchJson(`/api/cart/remove/${productId}`, { method: "DELETE" });
}
async function updateCartQuantity(productId, quantity) {
  // safer: send JSON body instead of query param
  return fetchJson(`/api/cart/update/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

// ─── Orders ─────────────────────────────────────────────────────────────
async function placeOrder(paymentType) {
  return fetchJson(`/api/orders`, {
    method: "POST",
    body: JSON.stringify({ paymentType }),
  });
}
async function getUserOrders() {
  return fetchJson("/api/orders");
}

// Admin order endpoints
async function getAllOrders() {
  return fetchJson("/api/orders/all");
}
async function updateOrderStatus(orderId, status) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You are not logged in. Please login first.");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:8080/api/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ correct format
        },
        body: JSON.stringify({ status }),
      },
    );

    // ✅ Handle 401 clearly
    if (res.status === 401) {
      alert("Unauthorized! Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/login.html";
      return;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Failed to update status");
    }

    return data;
  } catch (err) {
    console.error("Error updating order:", err);
    alert(err.message);
  }
}

// ─── Admin ──────────────────────────────────────────────────────────────
// ─── GET ALL USERS ─────────────────────────
async function getAllUsers() {
  return fetchJson("/api/admin/users");
}

// ─── ADD USER ─────────────────────────────
async function addUser(userData) {
  return fetchJson("/api/admin/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// ─── UPDATE USER ──────────────────────────
async function updateUser(userId, userData) {
  return fetchJson(`/api/admin/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}

// ─── DELETE USER ──────────────────────────
async function deleteUser(userId) {
  return fetchJson(`/api/admin/users/${userId}`, {
    method: "DELETE",
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────
function isLoggedIn() {
  return !!localStorage.getItem("jwtToken");
}
function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (e) {
    return {};
  }
}
function requireLogin(redirectTo) {
  if (!isLoggedIn()) {
    window.location.href = redirectTo || "/pages/login.html";
    return false;
  }
  return true;
}
// ================= SETTINGS =================

async function getSettings() {
  const token = localStorage.getItem("token");

  return await fetchJson("/api/settings", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: "Bearer " + token }),
    },
  });
}

async function saveSettings(settings) {
  const token = localStorage.getItem("token");

  return await fetchJson("/api/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: "Bearer " + token }),
    },
    body: JSON.stringify(settings),
  });
}

async function addReview(productId, review) {
  const token = localStorage.getItem("jwtToken");

  const res = await fetch(`${BASE}/api/reviews/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token, // 🔥 important
    },
    body: JSON.stringify(review),
  });

  if (!res.ok) {
    throw new Error("Failed to add review");
  }

  return res.json();
}

// Get reviews for a product
async function getReviews(productId) {
  const res = await fetch(`${BASE}/api/reviews/${productId}`);
  return res.json();
}
//get all reviews
async function getAllReviews() {
  return fetchJson("/api/reviews/allreviews");
}
// ─── Expose API ──────────────────────────────────────────────────────────
window.api = {
  // Auth
  signin,
  signup,
  getCurrentUser,
  logout,
  isLoggedIn,
  getStoredUser,
  requireLogin,
  // Products
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  filterProductsByPrice,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsPage,
  // Cart
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  // Orders
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  // Admin
  getAllUsers,
  deleteUser,
  addUser,
  updateUser,
  // Settings
  getSettings,
  saveSettings,
  //reviews
  addReview,
  getReviews,
  getAllReviews,
};

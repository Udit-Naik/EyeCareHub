/* admin.js — Admin Panel, fully wired to EyeCareHub backend API */

// document.addEventListener('DOMContentLoaded', async () => {

//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!user || !user.roles.includes("ROLE_ADMIN")) {
//         window.location.href = "/pages/login.html";
//     }

//     // ❌ Not logged in
//     if (!user) {
//         window.location.href = '../pages/login.html';
//         return;
//     }

//     // ❌ Not admin
//     if (!user.roles || !user.roles.includes("ROLE_ADMIN")) {
//         alert("Access Denied - Admin Only");
//         window.location.href = '../index.html';
//         return;
//     }

//     // ✅ Admin allowed → load data
//     if (document.getElementById('total-users')) loadDashboardStats();
//     if (document.getElementById('users-table-body')) loadUsersTable();
//     if (document.getElementById('products-table-body')) loadProductsTable();
//     if (document.getElementById('orders-table-body')) loadOrdersTable();
// });

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ Not logged in OR not admin
  if (!user || !user.roles || !user.roles.includes("ROLE_ADMIN")) {
    forceLogout();
    return;
  }

  // ✅ Dashboard
  loadDashboardStats();
  setInterval(loadDashboardStats, 3000);

  updateSystemStatus();
  setInterval(updateSystemStatus, 5000);

  // ✅ Tables
  if (document.getElementById("users-table-body")) {
    loadUsersTable();
  }

  if (document.getElementById("products-table-body")) {
    loadProductsTable();
  }

  if (document.getElementById("orders-table-body")) {
    loadOrdersTable();
  }
  if (document.getElementById("siteName")) {
    loadSettingsPage();
  }

  // SAVE BUTTON (optional if using onclick)
  const saveBtn = document.querySelector(".btn-clean");
  if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveSettings);
  }
  // ✅ USER FORM
  const form = document.getElementById("user-form");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const id = document.getElementById("user-id").value;
      const roleValue = document.getElementById("role").value;

      const userData = {
        username: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        roles: ["ROLE_" + roleValue.toUpperCase()],
      };

      try {
        if (id) {
          await window.api.updateUser(id, userData);
          alert("User updated successfully ✅");
        } else {
          await window.api.addUser(userData);
          alert("User added successfully ✅");
        }

        closeModal();

        if (document.getElementById("users-table-body")) {
          loadUsersTable();
        }
      } catch (err) {
        alert("Error: " + err.message);
      }
    });
  }

  // 🔥 ✅ ADD THIS PART (YOUR FIX)
  document.addEventListener("change", function (e) {
    if (e.target.classList.contains("status-dropdown")) {
      const orderId = e.target.dataset.id;
      const newStatus = e.target.value;

      console.log("Dropdown changed:", orderId, newStatus);

      handleUpdateOrderStatus(orderId, newStatus);
    }
  });
});
async function updateSystemStatus() {
  const textEl = document.getElementById("system-status-text");
  const barEl = document.getElementById("system-status-bar");

  if (!textEl || !barEl) return;

  try {
    // Try calling APIs
    const users = await window.api.getAllUsers();
    const orders = await window.api.getAllOrders();

    // ✅ If APIs respond → system OK
    textEl.innerText = "All systems operational ✅";
    barEl.style.width = "100%";
    barEl.style.background = "limegreen";
  } catch (err) {
    console.error("System check failed:", err);

    // ❌ If API fails → system down
    textEl.innerText = "System issues detected ⚠️";
    barEl.style.width = "60%";
    barEl.style.background = "red";
  }
}

function forceLogout() {
  // Clear everything
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  sessionStorage.clear();

  // Redirect to login
  window.location.href = "/pages/login.html";
}

function adminLogout() {
  forceLogout();
}
// ─── ADMIN AVATAR ─────────────────────────────────────────

const user = JSON.parse(localStorage.getItem("user"));
if (user && user.username) {
  const avatar = document.getElementById("adminAvatar");
  if (avatar) {
    avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=1a1a1a&color=00e5ff&bold=true`;
    avatar.style.display = "block";
  }
  const nameEl = document.getElementById("adminName");

  if (user && nameEl) {
    nameEl.innerText = user.username;
  }
}
/* ─── DASHBOARD STATS ─────────────────────────────────────── */
let lastStats = {
  users: 0,
  orders: 0,
  revenue: 0,
};
async function loadDashboardStats() {
  try {
    const users = await window.api.getAllUsers();
    const orders = await window.api.getAllOrders();

    const revenue = (orders || []).reduce(
      (acc, o) => acc + (o.totalPrice || 0),
      0,
    );

    const stats = {
      users: users.length,
      orders: orders.length,
      revenue: Math.round(revenue),
    };

    animateValue("total-users", lastStats.users, stats.users, 500);
    animateValue("total-orders", lastStats.orders, stats.orders, 500);
    animateValue("total-revenue", lastStats.revenue, stats.revenue, 800, "₹");

    lastStats = stats;
  } catch (err) {
    console.error("Dashboard Error:", err);
  }
}
function animateValue(id, start, end, duration, prefix = "") {
  const el = document.getElementById(id);
  if (!el) {
    console.error("Missing element:", id);
    return;
  }

  let startTime = null;

  function animate(time) {
    if (!startTime) startTime = time;

    const progress = Math.min((time - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);

    el.innerHTML = prefix + value.toLocaleString();

    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
// ─── GLOBAL STATE ────────────────────────────
let currentPage = 0;
let pageSize = 5;
let totalPages = 1;

window._allUsers = [];

// ─── LOAD USERS ─────────────────────────────
async function loadUsersTable() {
  const tbody = document.getElementById("users-table-body");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6">Loading...</td></tr>`;

  try {
    const users = (await window.api.getAllUsers()) || [];

    if (users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6">No users found</td></tr>`;
      return;
    }

    window._allUsers = users;

    totalPages = Math.max(1, Math.ceil(users.length / pageSize));

    if (currentPage >= totalPages) {
      currentPage = totalPages - 1;
    }

    const start = currentPage * pageSize;
    const paginatedUsers = users.slice(start, start + pageSize);

    tbody.innerHTML = paginatedUsers
      .map(
        (u) => `
            <tr>
                <td>${u.username}</td>
                <td>${u.email}</td>
                <td>${formatRole(u.roles)}</td>
                <td>${formatDate(u.createdAt)}</td>
                <td>
                    <button onclick="openEditUser('${u.id}')">✏️</button>
                    <button onclick="handleDeleteUser('${u.id}')">🗑️</button>
                </td>
            </tr>
        `,
      )
      .join("");

    renderPagination();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6">Error: ${err.message}</td></tr>`;
  }
}

// ─── PAGINATION ─────────────────────────────
function renderPagination() {
  const container = document.getElementById("pagination");
  if (!container) return;

  let buttons = "";

  for (let i = 0; i < totalPages; i++) {
    buttons += `
            <button onclick="goToPage(${i})"
                style="margin:5px;padding:8px 12px;
                background:${i === currentPage ? "#00e5ff" : "#222"};
                color:${i === currentPage ? "#000" : "#fff"};
                border:none;border-radius:5px;cursor:pointer;">
                ${i + 1}
            </button>
        `;
  }

  container.innerHTML = buttons;
}

function goToPage(page) {
  currentPage = page;
  loadUsersTable();
}

// ─── MODAL HANDLING ─────────────────────────

// OPEN ADD
window.openAddUser = function (e) {
  if (e) e.stopPropagation(); // ✅ STOP bubbling

  const modal = document.getElementById("user-modal");

  document.getElementById("modal-title").textContent = "Add New User";
  document.getElementById("user-form").reset();
  document.getElementById("user-id").value = "";

  modal.classList.add("open");
};
// OPEN EDIT
window.openEditUser = function (id) {
  const user = window._allUsers.find((u) => String(u.id) === String(id));
  if (!user) return;

  const modal = document.getElementById("user-modal");

  document.getElementById("modal-title").textContent = "Edit User";

  document.getElementById("user-id").value = user.id;
  document.getElementById("name").value = user.username || "";
  document.getElementById("email").value = user.email || "";

  const role =
    user.roles && user.roles.length
      ? user.roles[0].replace("ROLE_", "")
      : "USER";

  document.getElementById("role").value = role;

  modal.classList.add("open");
};

// CLOSE MODAL
window.closeModal = function () {
  const modal = document.getElementById("user-modal");
  modal.classList.remove("open");
};
// CLOSE ON OUTSIDE CLICK (FIXED)
window.addEventListener("click", function (e) {
  const modal = document.getElementById("user-modal");

  // Only close if clicking backdrop
  if (e.target === modal) {
    closeModal();
  }
});

// ─── DELETE USER ────────────────────────────
window.handleDeleteUser = async function (userId) {
  if (!confirm("Delete this user? This cannot be undone.")) return;

  try {
    showToast("Deleting user...");

    await window.api.deleteUser(userId);

    await loadUsersTable();

    showToast("User deleted 👤");
  } catch (err) {
    console.error(err);
    showToast("Error: " + err.message, true);
  }
};

// ─── HELPERS ────────────────────────────────
function formatRole(roles) {
  if (!roles || roles.length === 0) return "USER";
  return roles.map((r) => r.replace("ROLE_", "")).join(", ");
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN");
}
/* ─── PRODUCTS TABLE ──────────────────────────────────────── */ // ───────── LOAD PRODUCTS ─────────
async function loadProductsTable() {
  const tbody = document.getElementById("products-table-body");
  tbody.innerHTML = `<tr><td colspan="6">Loading...</td></tr>`;

  try {
    const res = await window.api.getProductsPage(currentPage, pageSize);

    const products = res.content;
    totalPages = res.totalPages;

    window._adminProducts = products;

    if (!products.length) {
      tbody.innerHTML = `<tr><td colspan="6">No products</td></tr>`;
      return;
    }

    tbody.innerHTML = products
      .map(
        (p) => `
            <tr>
                <td><img src="${p.imageUrl}" width="40" style="border-radius:6px;"></td>
                <td>${p.name}</td>
                <td>${p.category}</td>
               <td>
                ${
                  p.discount
                    ? `<span style="text-decoration:line-through;color:gray;">₹${p.price}</span>
                        <br><b>₹${(p.price - (p.price * p.discount) / 100).toFixed(0)}</b>
                        <br><small style="color:green;">-${p.discount}%</small>`
                    : `₹${p.price}`
                }
                </td>
                <td>${p.stock}</td>
                <td>
                    <button onclick="openEditProduct('${p.id}')">Edit</button>
                    <button onclick="handleDeleteProduct('${p.id}')">Delete</button>
                </td>
            </tr>
        `,
      )
      .join("");

    renderPagination();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6">Error: ${err.message}</td></tr>`;
  }
}

// ───────── PAGINATION ─────────
function renderPagination() {
  const container = document.getElementById("pagination");
  if (!container) return;

  let html = "";

  const maxVisible = 5; // how many page buttons to show
  let start = Math.max(0, currentPage - 2);
  let end = Math.min(totalPages, start + maxVisible);

  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible);
  }

  // PREV BUTTON
  html += `
        <button class="page-btn"
            onclick="changePage(${currentPage - 1})"
            ${currentPage === 0 ? "disabled" : ""}>
            ←
        </button>
    `;

  // FIRST PAGE + DOTS
  if (start > 0) {
    html += `<button class="page-btn" onclick="changePage(0)">1</button>`;
    if (start > 1) html += `<span class="dots">...</span>`;
  }

  // MAIN PAGES
  for (let i = start; i < end; i++) {
    html += `
            <button class="page-btn ${i === currentPage ? "active" : ""}"
                onclick="changePage(${i})">
                ${i + 1}
            </button>
        `;
  }

  // LAST PAGE + DOTS
  if (end < totalPages) {
    if (end < totalPages - 1) html += `<span class="dots">...</span>`;
    html += `<button class="page-btn" onclick="changePage(${totalPages - 1})">${totalPages}</button>`;
  }

  // NEXT BUTTON
  html += `
        <button class="page-btn"
            onclick="changePage(${currentPage + 1})"
            ${currentPage === totalPages - 1 ? "disabled" : ""}>
            →
        </button>
    `;

  container.innerHTML = html;
}

window.changePage = function (page) {
  if (page < 0 || page >= totalPages) return;
  currentPage = page;
  loadProductsTable();
};

// ───────── MODAL ─────────
window.openAddProductModal = function () {
  document.getElementById("product-form").reset();
  document.getElementById("product-id").value = "";
  document.getElementById("product-modal-title").innerText = "Add Product";
  document.getElementById("product-modal").classList.add("open");
};

window.closeProductModal = function () {
  document.getElementById("product-modal").classList.remove("open");
};

// ───────── EDIT ─────────
window.openEditProduct = function (id) {
  const p = window._adminProducts.find((x) => x.id === id);
  if (!p) return;

  document.getElementById("product-id").value = p.id;
  document.getElementById("product-name").value = p.name;
  document.getElementById("product-category").value = p.category;
  document.getElementById("product-brand").value = p.brand;
  document.getElementById("product-gender").value = p.gender;
  document.getElementById("product-price").value = p.price;
  document.getElementById("product-stock").value = p.stock;
  document.getElementById("product-image").value = p.imageUrl;

  document.getElementById("product-discount").value = p.discount || 0;
  document.getElementById("product-description").value = p.description || "";

  document.getElementById("product-modal-title").innerText = "Edit Product";
  document.getElementById("product-modal").classList.add("open");
};

// ───────── DELETE ─────────
window.handleDeleteProduct = async function (id) {
  if (!confirm("Delete this product?")) return;

  try {
    showToast("Deleting product...");

    await window.api.deleteProduct(id);

    if (currentPage > 0 && window._adminProducts.length === 1) {
      currentPage--;
    }

    await loadProductsTable();

    showToast("Product deleted 🗑️");
  } catch (err) {
    console.error(err);
    showToast("Error: " + err.message, true);
  }
};

// ───────── FORM SUBMIT ─────────
document
  .getElementById("product-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("product-id").value;

    const product = {
      name: document.getElementById("product-name").value,
      category: document.getElementById("product-category").value,
      brand: document.getElementById("product-brand").value || "Generic",
      gender: document.getElementById("product-gender").value || "Unisex",
      price: Number(document.getElementById("product-price").value),
      stock: Number(document.getElementById("product-stock").value),
      discount: Number(document.getElementById("product-discount").value || 0),
      description: document.getElementById("product-description").value || "",
      imageUrl: document.getElementById("product-image").value,
      rating: 0,
    };

    try {
      showToast(id ? "Updating product..." : "Creating product...");

      if (id) {
        await window.api.updateProduct(id, product);
        showToast("Product updated successfully ✅");
      } else {
        await window.api.createProduct(product);
        showToast("Product created successfully ✅");
      }

      closeProductModal();
      await loadProductsTable();
    } catch (err) {
      console.error(err);
      showToast("Error: " + (err.message || "Something went wrong"), true);
    }
  });

// Close modal on outside click
window.addEventListener("click", (e) => {
  const modal = document.getElementById("product-modal");
  if (e.target === modal) {
    closeProductModal();
  }
});

/* ─── ORDERS TABLE ────────────────────────────────────────── */

// ─── LOAD TABLE ─────────────────────────────
async function loadOrdersTable() {
  const tbody = document.getElementById("orders-table-body");
  if (!tbody) return;

  tbody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;color:#888;padding:20px;">
                Loading...
            </td>
        </tr>
    `;

  try {
    const orders = await window.api.getAllOrders();
    console.log("Orders:", orders);

    if (!orders || orders.length === 0) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;color:#888;padding:20px;">
                        No orders found
                    </td>
                </tr>
            `;
      return;
    }

    tbody.innerHTML = orders
      .map((order) => {
        const status = (order.status || "PENDING").toUpperCase();

        const statusColors = {
          PENDING: "rgba(250,204,21,0.2);color:#facc15",
          CONFIRMED: "rgba(0,229,255,0.15);color:#00e5ff",
          SHIPPED: "rgba(96,165,250,0.2);color:#60a5fa",
          DELIVERED: "rgba(74,222,128,0.2);color:#4ade80",
          CANCELLED: "rgba(248,113,113,0.2);color:#f87171",
        };

        const date = order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("en-IN")
          : "N/A";

        return `
                <tr>
                    <td>#${order.id?.slice(0, 6)}</td>
                    <td>${order.username || order.userId || "N/A"}</td>
                    <td>${date}</td>
                    <td>₹${order.totalPrice || 0}</td>

                    <td>
                        <span style="
                            padding:5px 12px;
                            border-radius:20px;
                            font-size:0.75rem;
                            font-weight:600;
                            ${statusColors[status] || "color:#fff"}
                        ">
                            ${status}
                        </span>
                    </td>

                   <td>
                        <select class="status-dropdown" data-id="${order.id}"
                            style="background:#1a1a1a;color:#fff;border:1px solid #333;padding:6px 10px;border-radius:6px;">
                            
                            ${[
                              "PENDING",
                              "CONFIRMED",
                              "SHIPPED",
                              "DELIVERED",
                              "CANCELLED",
                            ]
                              .map(
                                (s) =>
                                  `<option value="${s}" ${s === status ? "selected" : ""}>${s}</option>`,
                              )
                              .join("")}
                        </select>
                    </td>
                </tr>
            `;
      })
      .join("");
  } catch (err) {
    console.error(err);

    tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;color:red;padding:20px;">
                    Failed to load orders
                </td>
            </tr>
        `;
  }
}

// ─── UPDATE STATUS ──────────────────────────
async function handleUpdateOrderStatus(orderId, newStatus) {
  console.log("Updating order:", orderId, newStatus);

  try {
    showToast("Updating...", false);

    await window.api.updateOrderStatus(orderId, newStatus);

    showToast(`Order updated to ${newStatus} ✅`);

    await loadOrdersTable(); // ✅ ensure reload finishes
  } catch (err) {
    console.error(err);

    if (err.message.includes("Unauthorized")) {
      showToast("Session expired. Please login again.", true);
      window.location.href = "/login.html";
      return;
    }

    showToast("Error: " + (err.message || "Could not update order"), true);
  }
}

/* ─── SHARED HELPERS ──────────────────────────────────────── */
window.adminLogout = function () {
  if (window.api && window.api.logout) window.api.logout();
  else {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    window.location.href = "../pages/login.html";
  }
};

// ─── TOAST HELPER ─────────────────────────
function showToast(msg, isError = false) {
  const toast = document.createElement("div");

  toast.style.cssText = `
        position: fixed;
        bottom: 25px;
        right: 25px;
        background: ${isError ? "#f87171" : "#00e5ff"};
        color: #000;
        padding: 14px 28px;
        border-radius: 30px;
        font-weight: 600;
        font-size: 0.9rem;
        z-index: 9999;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    `;

  toast.innerText = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 50);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);

  return toast; // ✅ ADD THIS
}

// LOAD SETTINGS
async function loadSettingsPage() {
  try {
    const data = await window.api.getSettings();

    console.log("SETTINGS:", data); // debug

    document.getElementById("siteName").value = data.siteName || "";
    document.getElementById("supportEmail").value = data.supportEmail || "";
    document.getElementById("maintenanceMode").checked =
      data.maintenanceMode || false;
  } catch (err) {
    console.error("Load settings error:", err);
    showToast("Failed to load settings", true);
  }
}

// SAVE SETTINGS
async function handleSaveSettings() {
  try {
    const settings = {
      siteName: document.getElementById("siteName").value,
      supportEmail: document.getElementById("supportEmail").value,
      maintenanceMode: document.getElementById("maintenanceMode").checked,
    };

    console.log("Saving:", settings); // debug

    await window.api.saveSettings(settings);

    showToast("Settings Saved!");
  } catch (err) {
    console.error("Save error:", err);
    showToast("Error saving settings", true);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("notificationBtn");

  if (!btn) {
    console.error("❌ Notification button not found");
    return;
  }

  btn.addEventListener("click", showNotifications);
});
async function showNotifications() {
  console.log("🔔 clicked"); // ✅ now WILL show

  const dropdown = document.getElementById("notificationDropdown");
  const list = document.getElementById("notificationList");
  const count = document.getElementById("notificationCount");

  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";

  if (dropdown.style.display === "none") return;

  list.innerHTML = "<p>Loading...</p>";

  try {
    const reviews = await getAllReviews();

    count.innerText = reviews.length;

    list.innerHTML = "";

    reviews.forEach((r) => {
      list.innerHTML += `
        <div class="notification-item">
          <b>${r.username}</b> ⭐ (${r.rating})
        </div>
      `;
    });
  } catch (err) {
    console.error(err);
    list.innerHTML = "<p style='color:red;'>Failed</p>";
  }
}
window.onload = function () {
  const btn = document.getElementById("notificationBtn");

  if (!btn) {
    console.error("❌ Button NOT found");
    return;
  }

  console.log("✅ Button found");

  btn.addEventListener("click", showNotifications);
};

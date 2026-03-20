/* admin.js — Admin Panel, fully wired to EyeCareHub backend API */

document.addEventListener('DOMContentLoaded', async () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.roles.includes("ROLE_ADMIN")) {
        window.location.href = "/pages/login.html";
    }

    // ❌ Not logged in
    if (!user) {
        window.location.href = '../pages/login.html';
        return;
    }

    // ❌ Not admin
    if (!user.roles || !user.roles.includes("ROLE_ADMIN")) {
        alert("Access Denied - Admin Only");
        window.location.href = '../index.html';
        return;
    }

    // ✅ Admin allowed → load data
    if (document.getElementById('total-users')) loadDashboardStats();
    if (document.getElementById('users-table-body')) loadUsersTable();
    if (document.getElementById('products-table-body')) loadProductsTable();
    if (document.getElementById('orders-table-body')) loadOrdersTable();
});

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
async function loadDashboardStats() {
    try {
        const [users, orders, products] = await Promise.all([
            window.api.getAllUsers().catch(() => []),
            window.api.getAllOrders().catch(() => []),
            window.api.getProducts().catch(() => [])
        ]);
        const revenue = (orders || []).reduce((acc, o) => acc + (o.totalPrice || 0), 0);
        animateValue('total-users', 0, (users || []).length, 1000);
        animateValue('total-orders', 0, (orders || []).length, 1500);
        animateValue('total-revenue', 0, Math.round(revenue), 2000, '₹');
        animateValue('total-products', 0, (products || []).length, 1200);
    } catch (err) {
        console.error('Dashboard stats error', err);
    }
}

function animateValue(id, start, end, duration, prefix = '') {
    const el = document.getElementById(id);
    if (!el) return;
    let startTs = null;
    const step = ts => {
        if (!startTs) startTs = ts;
        const progress = Math.min((ts - startTs) / duration, 1);
        el.innerHTML = prefix + Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

/* ─── USERS TABLE ─────────────────────────────────────────── */
async function loadUsersTable() {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;padding:20px;">Loading...</td></tr>';

    try {
        const users = await window.api.getAllUsers();
        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;padding:20px;">No users found</td></tr>';
            return;
        }
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>#${user.id || ''}</td>
                <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:34px;height:34px;background:#1a1a1a;border:1px solid #333;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.85rem;font-weight:600;">
                            ${(user.username || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        ${user.username || '—'}
                    </div>
                </td>
                <td>${user.email || '—'}</td>
                <td>
                    ${(user.roles || []).map(r =>
            `<span style="padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:600;background:${r === 'ROLE_ADMIN' ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.08)'};color:${r === 'ROLE_ADMIN' ? '#00e5ff' : '#888'};">${r.replace('ROLE_', '')}</span>`
        ).join(' ')}
                </td>
                <td>
                    <button class="action-btn btn-delete" onclick="handleDeleteUser('${user.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#f87171;padding:20px;">Error: ${err.message || 'Could not load users'}</td></tr>`;
    }
}

window.handleDeleteUser = async function (userId) {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
        await window.api.deleteUser(userId);
        showToast('User deleted successfully');
        loadUsersTable();
    } catch (err) {
        showToast('Error: ' + (err.message || 'Could not delete user'), true);
    }
};

/* ─── PRODUCTS TABLE ──────────────────────────────────────── */
async function loadProductsTable() {
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888;padding:20px;">Loading...</td></tr>';

    try {
        const products = await window.api.getProducts();
        if (!products || products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888;padding:20px;">No products found</td></tr>';
            return;
        }
        tbody.innerHTML = products.map(p => {
            const img = p.imageUrl || getAutoImage(p.name, p.category);
            return `
                <tr>
                    <td><img src="${img}" style="width:42px;height:42px;border-radius:8px;object-fit:cover;"></td>
                    <td>${p.name || '—'}</td>
                    <td>${p.category || '—'}</td>
                    <td>₹${p.price || 0}</td>
                    <td><span style="color:${(p.stock || 0) < 5 ? '#f87171' : '#4ade80'};">${p.stock || 0}</span></td>
                    <td>
                        <button class="action-btn" onclick="openEditProduct('${p.id}')"><i class="fa-solid fa-pen"></i></button>
                        <button class="action-btn btn-delete" onclick="handleDeleteProduct('${p.id}')"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
        // Store for edit modal
        window._adminProducts = products;
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#f87171;padding:20px;">Error: ${err.message}</td></tr>`;
    }
}

function getAutoImage(name, category) {
    const label = `${name || ''} ${category || ''}`.toLowerCase();
    if (label.includes('sunglass') || label.includes('aviator')) return 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=200';
    if (label.includes('computer')) return 'https://images.unsplash.com/photo-1577922232320-f47d4e51240a?q=80&w=200';
    if (label.includes('contact')) return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=200';
    return 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=200';
}

window.openAddProductModal = function () {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    document.getElementById('product-modal-title').innerText = 'Add New Product';
    document.getElementById('product-id').value = '';
    document.getElementById('product-form').reset();
    modal.classList.add('open');
};

window.closeProductModal = function () {
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.remove('open');
};

window.openEditProduct = function (id) {
    const products = window._adminProducts || [];
    const p = products.find(x => String(x.id) === String(id));
    if (!p) return;
    document.getElementById('product-modal-title').innerText = 'Edit Product';
    document.getElementById('product-id').value = p.id;
    document.getElementById('product-name').value = p.name || '';
    document.getElementById('product-category').value = p.category || '';
    document.getElementById('product-brand').value = p.brand || '';
    document.getElementById('product-price').value = p.price || '';
    document.getElementById('product-stock').value = p.stock || '';
    document.getElementById('product-image').value = p.imageUrl || '';
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.add('open');
};

window.handleDeleteProduct = async function (id) {
    if (!confirm('Delete this product?')) return;
    try {
        await window.api.deleteProduct(id);
        showToast('Product deleted');
        loadProductsTable();
    } catch (err) {
        showToast('Error: ' + (err.message || 'Could not delete product'), true);
    }
};

const productModal = document.getElementById('product-modal');
if (productModal) {
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('product-id').value;
            const productData = {
                name: document.getElementById('product-name').value,
                category: document.getElementById('product-category').value,
                brand: document.getElementById('product-brand') ? document.getElementById('product-brand').value : '',
                gender: document.getElementById('product-gender') ? document.getElementById('product-gender').value : 'Unisex',
                price: Number(document.getElementById('product-price').value),
                stock: Number(document.getElementById('product-stock').value),
                imageUrl: document.getElementById('product-image').value || getAutoImage(document.getElementById('product-name').value, document.getElementById('product-category').value),
                discount: 0,
                rating: 0
            };
            try {
                if (id) {
                    await window.api.updateProduct(id, productData);
                    showToast('Product updated');
                } else {
                    await window.api.createProduct(productData);
                    showToast('Product created');
                }
                window.closeProductModal();
                loadProductsTable();
            } catch (err) {
                showToast('Error: ' + (err.message || 'Could not save product'), true);
            }
        });
    }
}

/* ─── ORDERS TABLE ────────────────────────────────────────── */
async function loadOrdersTable() {
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888;padding:20px;">Loading...</td></tr>';

    try {
        const orders = await window.api.getAllOrders();
        if (!orders || orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888;padding:20px;">No orders found</td></tr>';
            return;
        }
        tbody.innerHTML = orders.map(order => {
            const st = (order.status || 'PENDING').toUpperCase();
            const stColors = {
                PENDING: 'rgba(250,204,21,0.2);color:#facc15',
                CONFIRMED: 'rgba(0,229,255,0.15);color:#00e5ff',
                SHIPPED: 'rgba(96,165,250,0.2);color:#60a5fa',
                DELIVERED: 'rgba(74,222,128,0.2);color:#4ade80',
                CANCELLED: 'rgba(248,113,113,0.2);color:#f87171'
            };
            const stStyle = stColors[st] || 'rgba(255,255,255,0.1);color:#fff';
            const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—';
            return `
                <tr>
                    <td>#${(order.id || '').substring(0, 8)}...</td>
                    <td>${order.userId || '—'}</td>
                    <td>${date}</td>
                    <td>₹${order.totalPrice || 0}</td>
                    <td><span style="padding:5px 12px;border-radius:20px;font-size:0.75rem;font-weight:600;background:${stStyle};">${st}</span></td>
                    <td>
                        <select onchange="handleUpdateOrderStatus('${order.id}', this.value)"
                            style="background:#1a1a1a;color:#fff;border:1px solid #333;padding:6px 10px;border-radius:6px;cursor:pointer;">
                            <option value="PENDING" ${st === 'PENDING' ? 'selected' : ''}>PENDING</option>
                            <option value="CONFIRMED" ${st === 'CONFIRMED' ? 'selected' : ''}>CONFIRMED</option>
                            <option value="SHIPPED" ${st === 'SHIPPED' ? 'selected' : ''}>SHIPPED</option>
                            <option value="DELIVERED" ${st === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
                            <option value="CANCELLED" ${st === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
                        </select>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#f87171;padding:20px;">Error: ${err.message}</td></tr>`;
    }
}

window.handleUpdateOrderStatus = async function (orderId, newStatus) {
    try {
        await window.api.updateOrderStatus(orderId, newStatus);
        showToast(`Order updated to ${newStatus}`);
        loadOrdersTable();
    } catch (err) {
        showToast('Error: ' + (err.message || 'Could not update order'), true);
    }
};

/* ─── SHARED HELPERS ──────────────────────────────────────── */
window.adminLogout = function () {
    if (window.api && window.api.logout) window.api.logout();
    else {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        window.location.href = '../pages/login.html';
    }
};

function showToast(msg, isError = false) {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:25px;right:25px;background:${isError ? '#f87171' : '#00e5ff'};color:#000;padding:14px 28px;border-radius:30px;font-weight:600;font-size:0.9rem;z-index:9999;`;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

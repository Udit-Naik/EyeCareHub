// api.js — Central API helper for EyeCareHub
const BASE = 'http://localhost:8080';

// ─── Helpers ─────────────────────────────────────────
function authHeaders(additional = {}) {
    const token = localStorage.getItem('jwtToken');
    const headers = { 'Content-Type': 'application/json', ...additional };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
}

async function fetchJson(url, options = {}) {
    options.headers = { ...options.headers, ...authHeaders() };

    const res = await fetch(BASE + url, options);

    if (res.status === 401) {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        window.location.href = '/pages/login.html';
        return;
    }

    if (!res.ok) {
        let errorText;
        try { errorText = JSON.stringify(await res.json()); }
        catch { errorText = await res.text(); }
        throw new Error(`${res.status}: ${errorText}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

// ─── Auth APIs ──────────────────────────────────────
async function signin(email, password) {
    return fetchJson('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

async function signup(data) {
    return fetchJson('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

async function getCurrentUser() {
    return fetchJson('/api/auth/me');
}

// ─── Auth Helpers ───────────────────────────────────
function isLoggedIn() {
    return !!localStorage.getItem('jwtToken');
}

function getStoredUser() {
    return JSON.parse(localStorage.getItem('user'));
}

function requireLogin() {
    if (!isLoggedIn()) {
        window.location.href = '/pages/login.html';
    }
}

function logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    window.location.href = '/pages/login.html';
}

// ─── Products ───────────────────────────────────────────────────────────
async function getProducts() { return fetchJson('/api/products'); }
async function getProductById(id) { return fetchJson(`/api/products/${id}`); }
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
async function createProduct(product) { return fetchJson('/api/products', { method: 'POST', body: JSON.stringify(product) }); }
async function updateProduct(id, product) { return fetchJson(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }); }
async function deleteProduct(id) { return fetchJson(`/api/products/${id}`, { method: 'DELETE' }); }

// ─── Cart ───────────────────────────────────────────────────────────────
async function getCart() { return fetchJson('/api/cart'); }
async function addToCart(cartItem) { return fetchJson('/api/cart/add', { method: 'POST', body: JSON.stringify(cartItem) }); }
async function removeFromCart(productId) { return fetchJson(`/api/cart/remove/${productId}`, { method: 'DELETE' }); }
async function updateCartQuantity(productId, quantity) {
    // safer: send JSON body instead of query param
    return fetchJson(`/api/cart/update/${productId}`, { method: 'PUT', body: JSON.stringify({ quantity }) });
}

// ─── Orders ─────────────────────────────────────────────────────────────
async function placeOrder(paymentType) {
    return fetchJson(`/api/orders`, { method: 'POST', body: JSON.stringify({ paymentType }) });
}
async function getUserOrders() { return fetchJson('/api/orders'); }

// Admin order endpoints
async function getAllOrders() { return fetchJson('/api/orders/all'); }
async function updateOrderStatus(orderId, status) {
    return fetchJson(`/api/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
}

// ─── Admin ──────────────────────────────────────────────────────────────
async function getAllUsers() { return fetchJson('/api/admin/users'); }
async function deleteUser(userId) { return fetchJson(`/api/admin/users/${userId}`, { method: 'DELETE' }); }

// ─── Helpers ─────────────────────────────────────────────────────────────
function isLoggedIn() { return !!localStorage.getItem('jwtToken'); }
function getStoredUser() {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch (e) { return {}; }
}
function requireLogin(redirectTo) {
    if (!isLoggedIn()) {
        window.location.href = redirectTo || '/pages/login.html';
        return false;
    }
    return true;
}

// ─── Expose API ──────────────────────────────────────────────────────────
window.api = {
    // Auth
    signin, signup, getCurrentUser, logout, isLoggedIn, getStoredUser, requireLogin,
    // Products
    getProducts, getProductById, getProductsByCategory, searchProducts, filterProductsByPrice,
    createProduct, updateProduct, deleteProduct,
    // Cart
    getCart, addToCart, removeFromCart, updateCartQuantity,
    // Orders
    placeOrder, getUserOrders, getAllOrders, updateOrderStatus,
    // Admin
    getAllUsers, deleteUser
};
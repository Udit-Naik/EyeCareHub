// Frontend API helpers. Uses JWT from localStorage if available.

function authHeaders() {
    const token = localStorage.getItem('jwtToken');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
}

async function fetchJson(url, options = {}) {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(res.status + ' ' + text);
        }
        return await res.json();
    } catch (err) {
        console.warn('fetchJson error', url, err);
        throw err;
    }
}

// Products
async function getProducts() { return fetchJson('/api/products', { headers: authHeaders() }); }
async function getProductById(id) { return fetchJson(`/api/products/${id}`, { headers: authHeaders() }); }

// Auth
async function getCurrentUser() { return fetchJson('/api/auth/me', { headers: authHeaders() }); }
async function signin(email, password) {
    return fetchJson('/api/auth/signin', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ email, password }) });
}
async function signup(data) { return fetchJson('/api/auth/signup', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }); }

// Cart
async function getCart() { return fetchJson('/api/cart', { headers: authHeaders() }); }
async function addToCart(cartItem) { return fetchJson('/api/cart/add', { method: 'POST', headers: authHeaders(), body: JSON.stringify(cartItem) }); }
async function removeFromCart(productId) { return fetchJson(`/api/cart/remove/${productId}`, { method: 'DELETE', headers: authHeaders() }); }
async function updateCartQuantity(productId, quantity) { return fetchJson(`/api/cart/update/${productId}?quantity=${quantity}`, { method: 'PUT', headers: authHeaders() }); }

// Orders
async function getUserOrders() { return fetchJson('/api/orders', { headers: authHeaders() }); }
async function placeOrder(paymentType) { return fetchJson(`/api/orders?paymentType=${encodeURIComponent(paymentType)}`, { method: 'POST', headers: authHeaders() }); }

// Expose API helpers
window.api = Object.assign(window.api || {}, {
    getProducts,
    getProductById,
    getCurrentUser,
    signin,
    signup,
    getCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getUserOrders,
    placeOrder
});

// Usage notes: these methods throw on network errors; callers should handle rejections and provide UI fallbacks.

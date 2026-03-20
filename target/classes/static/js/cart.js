/*
  cart.js — Cart & Checkout logic, fully wired to backend API
*/

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-container')) {
        renderCart();
    }
    if (document.getElementById('checkout-form')) {
        renderCheckoutSummary();
        initCheckoutForm();
    }
});

/* ──────────────────────────── CART PAGE ──────────────────────────── */

async function renderCart() {
    const container = document.getElementById('cart-container');
    if (!container) return;

    container.innerHTML = '<div style="text-align:center;padding:40px;color:#888;">Loading cart...</div>';

    if (window.api && window.api.isLoggedIn()) {
        try {
            const serverCart = await window.api.getCart();
            // serverCart = { id, userId, items: [{productId, productName, price, quantity, imageUrl}], totalPrice }
            renderCartFromItems(serverCart && serverCart.items ? serverCart.items : [], true);
            return;
        } catch (err) {
            console.warn('Could not load server cart, falling back to localStorage', err);
        }
    }

    // Fallback: localStorage cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    renderCartFromItems(cart, false);
}

function renderCartFromItems(items, isServer) {
    const container = document.getElementById('cart-container');
    if (!items || items.length === 0) {
        container.innerHTML = `
            <div class="empty-cart fade-in" style="text-align:center;padding:80px 20px;">
                <i class="fa-solid fa-cart-arrow-down" style="font-size:3rem;color:#444;margin-bottom:20px;"></i>
                <h3 style="margin-bottom:10px;">Your cart is empty</h3>
                <p style="color:#888;">Looks like you haven't added anything yet.</p>
                <a href="categories.html" class="btn btn-primary" style="margin-top:20px;display:inline-block;">Start Shopping</a>
            </div>
        `;
        return;
    }

    let subtotal = 0;
    const itemsHtml = items.map(item => {
        const id = item.productId || item.id || '';
        const name = item.productName || item.name || 'Item';
        const price = item.price || 0;
        const qty = item.quantity || 1;
        const img = item.imageUrl || item.image || 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=200';
        subtotal += price * qty;
        return `
            <div class="cart-item fade-in" data-id="${id}">
                <img src="${img}" alt="${name}" class="cart-img" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">
                <div class="cart-details" style="flex:1;padding:0 15px;">
                    <h3 class="cart-title" style="font-size:1rem;margin-bottom:5px;">${name}</h3>
                    <div class="cart-price" style="color:#00e5ff;font-weight:600;">₹${price}</div>
                </div>
                <div class="cart-actions" style="display:flex;align-items:center;gap:10px;">
                    <div class="quantity-selector" style="display:flex;align-items:center;gap:8px;background:#1a1a1a;border-radius:20px;padding:5px 12px;">
                        <button class="qty-btn" onclick="changeQty('${id}', ${qty - 1}, ${isServer})" style="background:none;border:none;color:#fff;font-size:1.1rem;cursor:pointer;">−</button>
                        <span style="min-width:20px;text-align:center;">${qty}</span>
                        <button class="qty-btn" onclick="changeQty('${id}', ${qty + 1}, ${isServer})" style="background:none;border:none;color:#fff;font-size:1.1rem;cursor:pointer;">+</button>
                    </div>
                    <button onclick="removeItem('${id}', ${isServer})" style="background:rgba(255,0,0,0.15);border:none;color:#f87171;padding:8px 14px;border-radius:8px;cursor:pointer;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
                <div style="font-weight:600;min-width:80px;text-align:right;">₹${price * qty}</div>
            </div>
        `;
    }).join('');

    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + tax;

    container.innerHTML = `
        <div class="cart-layout" style="display:grid;grid-template-columns:1fr 320px;gap:30px;align-items:start;">
            <div class="cart-items" style="display:flex;flex-direction:column;gap:15px;">
                ${itemsHtml}
            </div>
            <div class="summary-box" style="background:#111;border:1px solid #222;border-radius:12px;padding:25px;position:sticky;top:100px;">
                <h3 style="margin-bottom:20px;">Order Summary</h3>
                <div class="summary-row" style="display:flex;justify-content:space-between;margin-bottom:12px;">
                    <span>Subtotal</span><span>₹${subtotal}</span>
                </div>
                <div class="summary-row" style="display:flex;justify-content:space-between;margin-bottom:12px;">
                    <span>Tax (8%)</span><span>₹${tax}</span>
                </div>
                <div class="summary-row" style="display:flex;justify-content:space-between;margin-bottom:12px;">
                    <span>Shipping</span><span style="color:#4ade80;">Free</span>
                </div>
                <hr style="border-color:#333;margin:15px 0;">
                <div class="summary-row total" style="display:flex;justify-content:space-between;font-size:1.1rem;font-weight:700;margin-bottom:20px;">
                    <span>Total</span><span>₹${total}</span>
                </div>
                <a href="checkout.html" class="btn btn-primary" style="display:block;width:100%;text-align:center;">Proceed to Checkout</a>
                <a href="categories.html" style="display:block;text-align:center;margin-top:15px;font-size:0.85rem;color:#888;">← Continue Shopping</a>
            </div>
        </div>
    `;
    updateCartCount();
}

window.changeQty = async function (productId, newQty, isServer) {
    if (isServer && window.api.isLoggedIn()) {
        try {
            await window.api.updateCartQuantity(productId, newQty);
            renderCart();
        } catch (err) {
            console.error('updateCartQuantity failed', err);
        }
    } else {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart.find(p => String(p.id) === String(productId));
        if (item) {
            if (newQty <= 0) cart = cart.filter(p => String(p.id) !== String(productId));
            else item.quantity = newQty;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        renderCart();
        updateCartCount();
    }
};

window.removeItem = async function (productId, isServer) {
    if (isServer && window.api.isLoggedIn()) {
        try {
            await window.api.removeFromCart(productId);
            renderCart();
        } catch (err) {
            console.error('removeFromCart failed', err);
        }
    } else {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(p => String(p.id) !== String(productId) && String(p.productId) !== String(productId));
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
};

/* ──────────────────────────── CHECKOUT PAGE ──────────────────────────── */

async function renderCheckoutSummary() {
    const summaryList = document.getElementById('checkout-items');
    const totalEl = document.getElementById('checkout-total');
    if (!summaryList) return;

    let items = [];
    let totalPrice = 0;

    if (window.api && window.api.isLoggedIn()) {
        try {
            const serverCart = await window.api.getCart();
            items = serverCart && serverCart.items ? serverCart.items : [];
            totalPrice = serverCart && serverCart.totalPrice ? serverCart.totalPrice : 0;
        } catch (e) {}
    }

    if (items.length === 0) {
        // Fallback to localStorage
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        if (localCart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }
        items = localCart.map(i => ({ productName: i.name, price: i.price, quantity: i.quantity }));
        totalPrice = localCart.reduce((s, i) => s + i.price * i.quantity, 0);
    }

    summaryList.innerHTML = items.map(item => {
        const name = item.productName || item.name || 'Item';
        const lineTotal = (item.price || 0) * (item.quantity || 1);
        return `
            <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                <span>${item.quantity || 1} × ${name}</span>
                <span>₹${lineTotal}</span>
            </div>
        `;
    }).join('');

    const tax = Math.round(totalPrice * 0.08);
    if (totalEl) totalEl.innerText = `₹${totalPrice + tax}`;
}

function initCheckoutForm() {
    // Payment Method Toggle
    document.querySelectorAll('.payment-card').forEach(m => {
        m.addEventListener('click', () => {
            document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active'));
            m.classList.add('active');
        });
    });

    document.getElementById('checkout-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate required fields
        const inputs = e.target.querySelectorAll('input[required]');
        let valid = true;
        inputs.forEach(i => {
            if (!i.value) { i.style.borderColor = '#f87171'; valid = false; }
            else i.style.borderColor = 'var(--border-color, #333)';
        });
        if (!valid) return;

        const activePayment = document.querySelector('.payment-card.active');
        const paymentType = activePayment ? (activePayment.dataset.type || 'COD') : 'COD';

        const btn = e.target.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.innerText = 'Placing Order...'; }

        // Show loader
        const loader = document.createElement('div');
        loader.className = 'loader-overlay active';
        loader.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;';
        loader.innerHTML = `
            <div class="spinner-ring" style="width:60px;height:60px;border:4px solid #333;border-top-color:#00e5ff;border-radius:50%;animation:spin 0.8s linear infinite;margin-bottom:20px;"></div>
            <div style="color:#fff;font-size:1.1rem;">Processing Order...</div>
            <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
        `;
        document.body.appendChild(loader);

        try {
            let orderId = '';
            if (window.api && window.api.isLoggedIn()) {
                const order = await window.api.placeOrder(paymentType);
                orderId = order ? (order.id || '') : '';
            } else {
                localStorage.removeItem('cart');
            }

            // Success UI
            loader.innerHTML = `
                <div style="width:70px;height:70px;background:#4ade80;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
                    <i class="fa-solid fa-check" style="font-size:2rem;color:#000;"></i>
                </div>
                <div style="color:#fff;font-size:1.1rem;">Order Placed Successfully!</div>
            `;

            setTimeout(() => {
                document.body.removeChild(loader);
                const cc = document.querySelector('.checkout-container');
                if (cc) {
                    cc.innerHTML = `
                        <div style="text-align:center;padding:100px 20px;animation:fadeIn 1s;">
                            <div style="width:80px;height:80px;background:#4ade80;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 25px;">
                                <i class="fa-solid fa-check" style="font-size:2.5rem;color:#000;"></i>
                            </div>
                            <h1 style="font-size:2.5rem;margin-bottom:15px;">Order Confirmed!</h1>
                            <p style="color:#888;font-size:1.1rem;">
                                Thank you for your purchase.${orderId ? ' Order ID: #' + orderId : ''}
                            </p>
                            <div style="display:flex;gap:15px;justify-content:center;margin-top:40px;">
                                <a href="../index.html" class="btn btn-primary">Back to Home</a>
                                <a href="dashboard.html" class="btn btn-outline">View Orders</a>
                            </div>
                        </div>
                    `;
                }
            }, 2000);

        } catch (err) {
            document.body.removeChild(loader);
            if (btn) { btn.disabled = false; btn.innerText = 'Place Order'; }
            alert('Order failed: ' + (err.message || 'Please try again.'));
        }
    });
}

/*
   Cart & Checkout Logic
*/

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on Cart Page
    if (document.getElementById('cart-container')) {
        renderCart();
    }

    // Check if we are on Checkout Page
    if (document.getElementById('checkout-form')) {
        renderCheckoutSummary();
        initCheckoutForm();
    }
});

function renderCart() {
    const container = document.getElementById('cart-container');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart fade-in">
                <i class="fa-solid fa-cart-arrow-down"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything yet.</p>
                <a href="categories.html" class="btn btn-primary" style="margin-top: 20px;">Start Shopping</a>
            </div>
        `;
        return;
    }

    let subtotal = 0;

    const itemsHtml = cart.map((item, index) => {
        subtotal += item.price * item.quantity;
        return `
            <div class="cart-item fade-in">
                <img src="${item.image}" alt="${item.name}" class="cart-img">
                <div class="cart-details">
                    <h3 class="cart-title">${item.name}</h3>
                    <div class="cart-price">₹${item.price}</div>
                </div>
                <div class="cart-actions">
                    <div class="quantity-selector">
                        <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
                        <span class="qty-input">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
                <div style="font-weight: 600; min-width: 80px; text-align: right;">
                    $${item.price * item.quantity}
                </div>
            </div>
        `;
    }).join('');

    const tax = Math.round(subtotal * 0.08); // 8% tax
    const total = subtotal + tax;

    container.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items">
                ${itemsHtml}
            </div>
            <div class="summary-box">
                <h3 style="margin-bottom: 20px;">Order Summary</h3>
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>₹${subtotal}</span>
                </div>
                <div class="summary-row">
                    <span>Tax (8%)</span>
                    <span>$${tax}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>₹${total}</span>
                </div>
                <a href="checkout.html" class="btn btn-primary" style="width: 100%;">Proceed to Checkout</a>
                <a href="categories.html" style="display: block; text-align: center; margin-top: 15px; font-size: 0.9rem; text-decoration: underline;">Continue Shopping</a>
            </div>
        </div>
    `;
}

function updateCartQty(id, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(p => p.id === id);

    if (item) {
        item.quantity += change;
        if (item.quantity < 1) item.quantity = 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(p => p.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

/* CHECKOUT LOGIC */

function renderCheckoutSummary() {
    const summaryList = document.getElementById('checkout-items');
    const totalEl = document.getElementById('checkout-total');
    if (!summaryList) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    summaryList.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="flex justify-between" style="margin-bottom: 10px;">
                <span>${item.quantity} x ${item.name}</span>
                <span>$${item.price * item.quantity}</span>
            </div>
        `;
    }).join('');

    const tax = Math.round(total * 0.08);
    totalEl.innerText = `₹${total + tax}`;
}

function initCheckoutForm() {
    // Payment Method Toggle
    const methods = document.querySelectorAll('.payment-card');
    methods.forEach(m => {
        m.addEventListener('click', () => {
            methods.forEach(c => c.classList.remove('active'));
            m.classList.add('active');
        });
    });

    // Form Submit
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();

        // Validation
        const inputs = e.target.querySelectorAll('input[required]');
        let valid = true;
        inputs.forEach(i => {
            if (!i.value) {
                i.style.borderColor = 'red';
                valid = false;
            } else {
                i.style.borderColor = 'var(--border-color)';
            }
        });

        if (valid) {
            // Show Loader
            const loader = document.createElement('div');
            loader.className = 'loader-overlay active';
            loader.innerHTML = `
                <div class="spinner-ring"></div>
                <div class="loader-text">Processing Payment...</div>
                <div class="checkmark-circle">
                    <i class="fa-solid fa-check"></i>
                </div>
            `;
            document.body.appendChild(loader);

            // Simulate Processing
            setTimeout(() => {
                const ring = loader.querySelector('.spinner-ring');
                const text = loader.querySelector('.loader-text');
                const check = loader.querySelector('.checkmark-circle');

                ring.style.display = 'none';
                text.innerText = 'Payment Successful!';
                check.style.display = 'flex';

                setTimeout(() => {
                    localStorage.removeItem('cart');
                    document.querySelector('.checkout-container').innerHTML = `
                        <div style="text-align: center; padding: 100px; animation: fadeIn 1s;">
                            <div class="checkmark-circle" style="display: flex; margin: 0 auto 30px;">
                                <i class="fa-solid fa-check"></i>
                            </div>
                            <h1 style="font-size: 3rem; margin-bottom: 20px;">Order Confirmed!</h1>
                            <p style="font-size: 1.2rem; color: #888;">Thank you for your purchase. Your order #7829 has been received.</p>
                            <a href="../index.html" class="btn btn-primary" style="margin-top: 40px;">Back to Home</a>
                        </div>
                    `;
                    document.body.removeChild(loader);
                }, 2000);
            }, 3000);
        }
    });
}

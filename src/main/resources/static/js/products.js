/*
   Products.js - Category & Filtering Logic
*/

let currentProducts = []; // Copy of global data
    initShop();
function mapBackendProduct(p) {
    return {
        id: p.id || p._id || p.id,
        name: p.name || p.title || 'Unnamed',
        category: p.category || 'Uncategorized',
        brand: p.brand || '',
        gender: p.gender || '',
        price: p.price || p.amount || 0,
        discount: p.discount || 0,
        rating: p.rating || 0,
        image: p.imageUrl || p.image || '/static/placeholder.png',
        desc: p.description || p.desc || '',
        stock: p.stock || 0
    };
}

async function initShop() {

let currentProducts = [...products]; // Copy of global data

function initShop() {
    // Check for URL query params (e.g. ?category=electronics)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');

    if (categoryParam) {
        // Pre-check the checkbox
        const checkboxes = document.querySelectorAll(`input[name="category"][value="${capitalize(categoryParam)}"]`);
        checkboxes.forEach(cb => {
            cb.checked = true;
            // Also simpler logic to just filter immediately
        });
        filterProducts();
    } else {
        renderProducts(currentProducts);
    }

    // Event Listeners
    document.querySelectorAll('input[name="category"]').forEach(cb => {
        cb.addEventListener('change', filterProducts);
    });

    document.getElementById('priceRange').addEventListener('input', (e) => {
        document.getElementById('priceValue').innerText = `₹${e.target.value}`;
        filterProducts();
    });
function filterProducts() {
    const checkedCats = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(cb => cb.value);

    const maxPrice = parseInt(document.getElementById('priceRange').value);

    currentProducts = (window.products || currentProducts).filter(p => {
        const catMatch = checkedCats.length === 0 || checkedCats.includes(p.category);
        const priceMatch = p.price <= maxPrice;
        return catMatch && priceMatch;
    });

    sortProducts(false);
    });

    // 4. Sort (maintain current sort order)
    sortProducts(false); // don't trigger event, just reuse logic
}

function sortProducts(isEvent = true) {
    const sortValue = document.getElementById('sort').value;

    if (sortValue === 'low-high') {
        currentProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'high-low') {
        currentProducts.sort((a, b) => b.price - a.price);
    }
    // 'default' leaves it as filtered order (or id based if stable)

    renderProducts(currentProducts);
}

function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    const countLabel = document.getElementById('result-count');

    if (!grid) return;

    grid.innerHTML = '';
    countLabel.innerText = `Showing ${items.length} products`;

    if (items.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found.</p>';
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in';
                    <button class="action-btn" onclick="addToCart(event, '${product.id}')" title="Add to Cart"><i class="fa-solid fa-plus"></i></button>
            <div class="product-img-wrapper" onclick="window.location.href='product.html?id=${product.id}'">
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <div class="product-actions">
                    <button class="action-btn" onclick="addToCart(event, ${product.id})" title="Add to Cart"><i class="fa-solid fa-plus"></i></button>
                    <button class="action-btn" onclick="window.location.href='product.html?id=${product.id}'" title="View Details"><i class="fa-regular fa-eye"></i></button>
                </div>
            </div>
            <div class="product-info" style="padding: 15px;">
                <h3 style="font-size: 1.1rem; margin-bottom: 5px;">${product.name}</h3>
                <div class="flex justify-between" style="margin-bottom: 10px;">
                    <span class="product-price">₹${product.price}</span>
                    <span style="font-size: 0.8rem; color: #666;">${product.rating} <i class="fa-solid fa-star" style="color: gold;"></i></span>
                </div>
                <button class="btn-buy-now" onclick="buyNow(${product.id})">Buy Now</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function capitalize(str) {
window.addToCart = async function (e, id) {
    if (e) e.stopPropagation();

    const product = (window.products || currentProducts).find(p => String(p.id) === String(id));
    if (!product) return;

    // Try backend cart API first
    if (window.api && window.api.addToCart) {
        try {
            await window.api.addToCart({ productId: product.id, quantity: 1 });
            updateCartCount();
            showToast(`Added ${product.name} to cart`);
            return;
        } catch (err) {
            console.warn('addToCart API failed, falling back to localStorage', err);
        }
    }

    // Fallback localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => String(item.id) === String(id));

    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`Added ${product.name} to cart`);
}

function showToast(text) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = text;
    toast.classList.remove('hidden');
    toast.style.opacity = 1;
    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
    toast.style.opacity = 1;
    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
}

// Buy Now function
window.buyNow = function (id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // Add 1 to cart if not present, then redirect
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === id);

    if (!existing) {
        cart.push({ ...product, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    window.location.href = 'checkout.html';
}

/*
  products.js — Category Browsing, Search, Filter & Cart
*/

let currentProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    initShop();
});

// Map backend product fields to local format
function mapProduct(p) {
    return {
        id: p.id,
        name: p.name || 'Unnamed',
        category: p.category || 'Uncategorized',
        brand: p.brand || '',
        gender: p.gender || '',
        price: p.price || 0,
        discount: p.discount || 0,
        rating: p.rating || 0,
        image: p.imageUrl || getAutoImage(p.name, p.category),
        desc: p.description || '',
        stock: p.stock || 0
    };
}

function getAutoImage(name, category) {
    const label = `${name || ''} ${category || ''}`.toLowerCase();
    if (label.includes('aviator') || label.includes('sunglass')) return 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=500&auto=format&fit=crop';
    if (label.includes('computer') || label.includes('blue')) return 'https://images.unsplash.com/photo-1577922232320-f47d4e51240a?q=80&w=500&auto=format&fit=crop';
    if (label.includes('contact') || label.includes('acuvue')) return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=500&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=500&auto=format&fit=crop';
}

async function initShop() {
    // Load products from backend
    try {
        const data = await window.api.getProducts();
        currentProducts = (data || []).map(mapProduct);
        window.products = currentProducts; // expose globally
    } catch (err) {
        console.warn('Could not load products from server:', err);
        currentProducts = typeof window.products !== 'undefined' ? window.products : [];
    }

    // URL query filter (e.g. ?category=Sunglasses)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        const checkbox = document.querySelector(`input[name="category"][value="${categoryParam}"]`);
        if (checkbox) checkbox.checked = true;
    }

    renderProducts(filterAndSort());

    // ── Event Listeners ──
    document.querySelectorAll('input[name="category"]').forEach(cb => {
        cb.addEventListener('change', () => renderProducts(filterAndSort()));
    });

    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            const el = document.getElementById('priceValue');
            if (el) el.innerText = `₹${e.target.value}`;
            renderProducts(filterAndSort());
        });
    }

    const sortEl = document.getElementById('sort');
    if (sortEl) {
        sortEl.addEventListener('change', () => renderProducts(filterAndSort()));
    }

    const searchEl = document.getElementById('searchInput');
    if (searchEl) {
        searchEl.addEventListener('input', () => renderProducts(filterAndSort()));
    }
}

function filterAndSort() {
    const checkedCats = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(cb => cb.value);

    const priceRange = document.getElementById('priceRange');
    const maxPrice = priceRange ? parseInt(priceRange.value) : Infinity;

    const searchEl = document.getElementById('searchInput');
    const searchTerm = searchEl ? searchEl.value.toLowerCase().trim() : '';

    let filtered = currentProducts.filter(p => {
        const catMatch = checkedCats.length === 0 || checkedCats.includes(p.category);
        const priceMatch = p.price <= maxPrice;
        const searchMatch = !searchTerm || p.name.toLowerCase().includes(searchTerm);
        return catMatch && priceMatch && searchMatch;
    });

    const sortEl = document.getElementById('sort');
    const sortValue = sortEl ? sortEl.value : 'default';
    if (sortValue === 'low-high') filtered.sort((a, b) => a.price - b.price);
    else if (sortValue === 'high-low') filtered.sort((a, b) => b.price - a.price);
    else if (sortValue === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    return filtered;
}

function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    const countLabel = document.getElementById('result-count');
    if (!grid) return;

    if (countLabel) countLabel.innerText = `Showing ${items.length} products`;

    if (items.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">No products found.</p>';
        return;
    }

    grid.innerHTML = items.map(product => `
        <div class="product-card fade-in">
            <div class="product-img-wrapper" onclick="window.location.href='product.html?id=${product.id}'">
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <div class="product-actions">
                    <button class="action-btn" onclick="addToCartFromGrid(event, '${product.id}')" title="Add to Cart">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                    <button class="action-btn" onclick="window.location.href='product.html?id=${product.id}'" title="View Details">
                        <i class="fa-regular fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info" style="padding: 15px;">
                <h3 style="font-size: 1rem; margin-bottom: 4px;">${product.name}</h3>
                <div style="font-size: 0.8rem; color: #888; margin-bottom: 8px;">${product.brand} · ${product.category}</div>
                <div class="flex justify-between" style="margin-bottom: 12px; align-items: center;">
                    <span class="product-price">₹${product.price}</span>
                    <span style="font-size: 0.8rem; color: #f59e0b;">${product.rating} <i class="fa-solid fa-star"></i></span>
                </div>
                <button class="btn-buy-now" onclick="buyNow('${product.id}')">Buy Now</button>
            </div>
        </div>
    `).join('');
}

window.addToCartFromGrid = async function (e, id) {
    if (e) e.stopPropagation();
    if (!window.api.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    const product = currentProducts.find(p => String(p.id) === String(id));
    if (!product) return;

    try {
        await window.api.addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            imageUrl: product.image
        });
        updateCartCount();
        showToast(`✓ ${product.name} added to cart`);
    } catch (err) {
        console.error('addToCart failed:', err);
        showToast('Could not add to cart. Please sign in.');
    }
};

window.buyNow = function (id) {
    if (!window.api.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    const product = currentProducts.find(p => String(p.id) === String(id));
    if (!product) return;
    window.api.addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.image
    }).then(() => {
        window.location.href = 'checkout.html';
    }).catch(() => {
        window.location.href = 'checkout.html';
    });
};

function showToast(text) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:#00e5ff;color:#000;padding:14px 24px;border-radius:30px;font-weight:600;font-size:0.9rem;z-index:9999;opacity:0;transition:opacity 0.3s;';
        document.body.appendChild(toast);
    }
    toast.innerText = text;
    toast.style.opacity = '1';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

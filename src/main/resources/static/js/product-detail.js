/* 
   Product Detail Logic
*/

document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
});

function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id')); // Default to 1 if testing

    // Find product
    const product = products.find(p => p.id === productId) || products[0];

    if (!product) {
        document.getElementById('product-container').innerHTML = '<h2>Product not found</h2>';
        return;
    }

    // Render Main Content
    renderProductView(product);

    // Render Related (Same category, exclude current)
    renderRelated(product);
}

function renderProductView(product) {
    const container = document.getElementById('product-container');

    container.innerHTML = `
        <div class="product-detail-grid">
            <!-- Gallery -->
            <div class="gallery-wrapper">
                <div class="main-image-box" id="mainImgBox" onmousemove="zoomImage(event)" onmouseleave="resetZoom()">
                    <img src="${product.image}" id="mainImg" class="main-image" alt="${product.name}">
                </div>
                <div class="thumbnails">
                    <button class="thumb-btn active" onclick="changeImage('${product.image}', this)">
                        <img src="${product.image}" alt="View 1">
                    </button>
                    <!-- Mock additional images -->
                    <button class="thumb-btn" onclick="changeImage('${product.image}', this)">
                        <img src="${product.image}" alt="View 2" style="filter: hue-rotate(90deg);">
                    </button>
                    <button class="thumb-btn" onclick="changeImage('${product.image}', this)">
                        <img src="${product.image}" alt="View 3" style="filter: hue-rotate(180deg);">
                    </button>
                </div>
            </div>

            <!-- Info -->
            <div class="product-info-col">
                <span class="product-brand">${product.brand || 'Nexus Brand'}</span>
                <h1 class="product-title-large">${product.name}</h1>
                
                <div class="rating-box">
                    ${getStarRating(product.rating)}
                    <span class="rating-text">(${product.rating} / 5.0) &bull; 124 Reviews</span>
                </div>

                <div class="price-box">
                    <span class="current-price">₹${product.price}</span>
                    <!-- Mock old price -->
                    <span style="text-decoration: line-through; color: var(--text-muted); font-size: 1.2rem;">₹${Math.round(product.price * 1.2)}</span>
                </div>

                <p style="margin-bottom: 30px; color: var(--text-muted);">${product.desc} Experience the ultimate quality with our premium collection. Designed for those who appreciate fine details and superior performance.</p>

                <!-- Controls -->
                <div class="product-controls">
                    <div class="control-group">
                        <span style="min-width: 80px;">Quantity:</span>
                        <div class="quantity-wrapper">
                            <button class="qty-btn" onclick="updateQty(-1)"><i class="fa-solid fa-minus"></i></button>
                            <span class="qty-val" id="qtyVal">1</span>
                            <button class="qty-btn" onclick="updateQty(1)"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    </div>
                    
                    <div class="flex" style="gap: 20px; margin-top: 30px;">
                        <button class="btn btn-primary" onclick="addToCartDetail(${product.id})" style="flex: 1;">
                            Add to Cart
                        </button>
                        <button class="icon-btn" style="border: 1px solid var(--border-color); width: 50px; height: 50px; border-radius: 50%; display: flex; alignItems: center; justifyContent: center;">
                            <i class="fa-regular fa-heart"></i>
                        </button>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="product-tabs">
                    <div class="tab-headers">
                        <button class="tab-link active" onclick="openTab('desc', this)">Description</button>
                        <button class="tab-link" onclick="openTab('reviews', this)">Reviews (124)</button>
                    </div>
                    <div id="desc-tab" class="tab-pane active">
                        <p>Detailed description of ${product.name}. Features include high durability, premium finish, and ergonomic design. Perfect for everyday use.</p>
                        <ul style="list-style: disc; margin-left: 20px; margin-top: 10px; color: #aaa;">
                            <li>Premium build quality</li>
                            <li>2-year warranty</li>
                            <li>Eco-friendly materials</li>
                        </ul>
                    </div>
                    <div id="reviews-tab" class="tab-pane">
                        <div class="review-item" style="margin-bottom: 20px;">
                            <div class="flex" style="gap: 10px; margin-bottom: 5px;">
                                <strong>John Doe</strong>
                                <span style="color: gold; font-size: 0.8rem;"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></span>
                            </div>
                            <p>"Absolutely amazing product! Worth every penny."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Animate in
    gsap.from('.product-detail-grid > div', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });
}

function renderRelated(currentProduct) {
    const related = products.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 4);
    const container = document.getElementById('related-products');

    if (related.length === 0) {
        container.innerHTML = '<p>No related products found.</p>';
        return;
    }

    related.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => window.location.href = `product.html?id=${product.id}`;
        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="flex justify-between">
                    <span class="product-price">₹${product.price}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Interactivity Functions
function changeImage(src, btn) {
    const mainImg = document.getElementById('mainImg');
    // Basic fade
    mainImg.style.opacity = 0;
    setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = 1;
    }, 200);

    document.querySelectorAll('.thumb-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function zoomImage(e) {
    const box = document.getElementById('mainImgBox');
    const img = document.getElementById('mainImg');

    const x = e.clientX - box.getBoundingClientRect().left;
    const y = e.clientY - box.getBoundingClientRect().top;

    img.style.transformOrigin = `${x}px ${y}px`;
    img.style.transform = "scale(2)";
}

function resetZoom() {
    const img = document.getElementById('mainImg');
    img.style.transform = "scale(1)";
}

function updateQty(change) {
    const el = document.getElementById('qtyVal');
    let val = parseInt(el.innerText);
    val += change;
    if (val < 1) val = 1;
    el.innerText = val;
}

function openTab(tabName, btn) {
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(b => b.classList.remove('active'));

    document.getElementById(`${tabName}-tab`).classList.add('active');
    btn.classList.add('active');
}

function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) stars += '<i class="fa-solid fa-star"></i>';
        else if (i - 0.5 <= rating) stars += '<i class="fa-solid fa-star-half-stroke"></i>';
        else stars += '<i class="fa-regular fa-star"></i>';
    }
    return stars;
}

function addToCartDetail(id) {
    const qty = parseInt(document.getElementById('qtyVal').innerText);
    const product = products.find(p => p.id === id);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({ ...product, quantity: qty });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Toast
    const toast = document.getElementById('toast');
    toast.innerText = `Added ${qty} x ${product.name} to cart`;
    toast.classList.remove('hidden');
    toast.style.opacity = 1;
    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
}

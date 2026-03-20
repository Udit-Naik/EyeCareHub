/* 
   Home Page Animations & Logic 
*/

document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    renderFeaturedProducts();
});

function initHeroAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline();

    // Hero Text Reveal
    tl.from('.reveal-text', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out"
    })
        // Description & Buttons
        .from('.fade-in', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.8")
        // Hero Image slide in
        .from('.hero-image', {
            x: 100,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out"
        }, "-=1");

    // Scroll Animations for Category Cards
    gsap.utils.toArray('.category-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power2.out"
        });
    });
}

function renderFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    // Try backend first
    if (window.api && window.api.getProducts) {
        window.api.getProducts().then(data => {
            const list = Array.isArray(data) ? data.slice(0, 8) : [];
            list.forEach(p => appendCard(container, p));
        }).catch(() => {
            (window.products || []).forEach(p => appendCard(container, p));
        });
        return;
    }

    // Fallback to local products
    (window.products || []).forEach(p => appendCard(container, p));

    function appendCard(container, product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${product.image || product.imageUrl}" alt="${product.name}" class="product-img">
                <div class="product-actions">
                    <button class="action-btn" title="Add to Cart"><i class="fa-solid fa-plus"></i></button>
                    <button class="action-btn" title="Quick View"><i class="fa-regular fa-eye"></i></button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="flex justify-between">
                    <span class="product-price">₹${product.price}</span>
                    <span style="font-size: 0.8rem; color: #666;">${product.category || ''}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    }
}

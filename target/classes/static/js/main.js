/* 
   Main JS - Global Logic
*/

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    updateCartCount();
    initTheme();
    initSearch();
});

// Theme Logic
function initTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    }

    // Insert toggle button if not exists (usually in nav)
    // For now assuming we might add a toggle button or just expose function
    // Let's add a floating toggle for demo
    const toggle = document.createElement('button');
    toggle.className = 'icon-btn';
    toggle.innerHTML = theme === 'light' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    toggle.style.position = 'fixed';
    toggle.style.bottom = '20px';
    toggle.style.right = '20px';
    toggle.style.background = 'var(--bg-card)';
    toggle.style.padding = '15px';
    toggle.style.borderRadius = '50%';
    toggle.style.zIndex = '9999';
    toggle.style.border = '1px solid var(--border-color)';
    toggle.style.cursor = 'pointer';

    toggle.onclick = () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        toggle.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    };

    document.body.appendChild(toggle);
}

// Search Logic
function initSearch() {
    // Create Modal
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
        <div class="close-search"><i class="fa-solid fa-xmark"></i></div>
        <div class="search-box">
            <input type="text" class="search-input" placeholder="Search products..." id="searchInput">
        </div>
    `;
    document.body.appendChild(modal);

    const triggers = document.querySelectorAll('.search-trigger'); // Add this class to nav search icon
    const close = modal.querySelector('.close-search');
    const input = modal.querySelector('searchInput');

    triggers.forEach(t => t.addEventListener('click', () => {
        modal.classList.add('active');
        setTimeout(() => document.getElementById('searchInput').focus(), 100);
    }));

    close.addEventListener('click', () => modal.classList.remove('active'));

    // Search functionality
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value;
            // Redirect to category page with search (simulated)
            // Ideally we'd filter by name, but for now just redirect
            if (window.location.href.includes('pages/')) {
                window.location.href = `categories.html?search=${query}`;
            } else {
                window.location.href = `pages/categories.html?search=${query}`;
            }
        }
    });

    // Handle Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') modal.classList.remove('active');
    });
}


// Navbar Scroll Effect
function initNavbar() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Mock Cart Logic for badge
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartCount) {
        cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
    }
}

// Sample Product Data handled in data.js

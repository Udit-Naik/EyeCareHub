/*
   Custom Cursor Logic (FIXED VERSION)
*/

document.addEventListener('DOMContentLoaded', () => {

    if ('ontouchstart' in window) return; // disable on mobile

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';

    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    // Move dot instantly
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // Smooth outline
    function animateCursor() {
        const dt = 0.15;

        cursorX += (mouseX - cursorX) * dt;
        cursorY += (mouseY - cursorY) * dt;

        cursorOutline.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(${cursorOutline.dataset.scale || 1})`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // ─── HOVER EFFECT ─────────────────────
    document.addEventListener('mouseover', (e) => {

        // ❗ Ignore modal (VERY IMPORTANT)
        if (e.target.closest('#user-modal')) return;

        if (e.target.closest('a, button, .product-card')) {
            cursorOutline.dataset.scale = "1.5";
            cursorOutline.style.backgroundColor = 'rgba(219, 242, 39, 0.1)';
            cursorOutline.style.borderColor = 'transparent';
        }
    });

    document.addEventListener('mouseout', (e) => {

        if (e.target.closest('#user-modal')) return;

        if (e.target.closest('a, button, .product-card')) {
            cursorOutline.dataset.scale = "1";
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderColor = 'var(--accent-color)';
        }
    });

    // ─── CLICK EFFECT ─────────────────────
    document.addEventListener('mousedown', () => {
        cursorOutline.dataset.scale = "0.8";
    });

    document.addEventListener('mouseup', () => {
        cursorOutline.dataset.scale = "1";
    });

});
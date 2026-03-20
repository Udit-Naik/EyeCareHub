/* 
   Custom Cursor Logic 
*/

document.addEventListener('DOMContentLoaded', () => {

    if ('ontouchstart' in window) return; // ❗ disable on mobile

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';

    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateCursor() {
        const dt = 0.15;

        cursorX += (mouseX - cursorX) * dt;
        cursorY += (mouseY - cursorY) * dt;

        cursorOutline.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .product-card, input')) {
            cursorOutline.style.transform += ' scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(219, 242, 39, 0.1)';
            cursorOutline.style.borderColor = 'transparent';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .product-card, input')) {
            cursorOutline.style.transform = cursorOutline.style.transform.replace(' scale(1.5)', '');
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderColor = 'var(--accent-color)';
        }
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        cursorOutline.style.transform += ' scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        cursorOutline.style.transform = cursorOutline.style.transform.replace(' scale(0.8)', '');
    });
});

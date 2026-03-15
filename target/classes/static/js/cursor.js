/* 
   Custom Cursor Logic 
*/

document.addEventListener('DOMContentLoaded', () => {
    // Create cursor elements
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';

    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    // Mouse Movement
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Dot follows instantly
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

        // Keyframe animation for dot (optional, keeping it simple for now)
    });

    // Outline follows with delay (Lerp)
    function animateCursor() {
        const dt = 0.15; // smoothness factor

        cursorX += (mouseX - cursorX) * dt;
        cursorY += (mouseY - cursorY) * dt;

        cursorOutline.style.left = `${cursorX}px`;
        cursorOutline.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover Effects
    const interactables = document.querySelectorAll('a, button, .product-card, input');

    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(219, 242, 39, 0.1)';
            cursorOutline.style.borderColor = 'transparent';
        });

        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderColor = 'var(--accent-color)';
        });
    });
});

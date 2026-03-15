# NEXUS - Antigravity E-Commerce

**NEXUS** is a cutting-edge, premium e-commerce platform designed with a futuristic "Antigravity" aesthetic. It features massive typography, physics-based floating elements, modular Bento-grid layouts, and advanced micro-interactions.

## 🚀 Key Features

### 🎨 Design & Experience
-   **Antigravity Theme**: Deep black backgrounds (`#0a0a0a`), glassmorphism effects, and vibrant neon accents (`#dbf227`).
-   **Custom Cursor**: A magnetic "Ball-inside-Ball" cursor that snaps to interactive elements.
-   **Cinematic Preloader**: A smooth curtain-reveal loading animation.
-   **Responsive Layouts**: Fully adaptive designs, including modular Bento grids for product categories.
-   **Animations**: Built with **GSAP** (ScrollTrigger) and custom CSS keyframes for floating, pulsing, and shining effects.

### 🛒 Functionality
-   **Dynamic Product Listing**: Filter by category, price range, and sort by price/popularity.
-   **Seamless Cart & Checkout**:
    -   Real-time cart calculations.
    -   Realistic "Payment Processing" animation using CSS loaders.
    -   Persistent data using `localStorage`.
-   **User Dashboard**:
    -   Address Management (Add/Edit).
    -   Order History with detailed modals.
    -   Wishlist interactions.
-   **Authentication**: Mock Login/Register flows with validation.

## 🛠️ Tech Stack
-   **HTML5**: Semantic and accessible markup.
-   **CSS3**: Modern variables, Grid/Flexbox, and keyframe animations.
-   **JavaScript (ES6+)**: Vanilla JS for logic, DOM manipulation, and state management.
-   **GSAP by GreenSock**: Professional-grade scroll animations and timeline control.
-   **Font Awesome**: Icons.
-   **Google Fonts**: *Outfit* (Geometric Sans) for headings.

## 📂 Project Structure
```
/
├── css/
│   ├── style.css       # Core styles (variables, reset)
│   ├── components.css  # Buttons, Cards, Inputs, Navbar
│   ├── utils.css       # Utility classes (flex, grid, spacing)
│   ├── animations.css  # Keyframes and loaders
│   ├── antigravity.css # Theme-specific overrides (Bento, Hero)
│   └── [pages].css     # Page-specific styles (cart, dashboard, etc.)
├── js/
│   ├── main.js         # Global logic (Nav, Cart Count)
│   ├── cursor.js       # Custom cursor logic
│   ├── products.js     # Product rendering and filtering
│   ├── cart.js         # Cart and Checkout logic
│   ├── dashboard.js    # User account management
│   ├── auth.js         # Login/Register validation
│   └── data.js         # Mock data (Products, Users)
├── pages/              # Inner HTML pages (Shop, Cart, Auth, etc.)
└── index.html          # Main Landing Page
```

## 📦 How to Run
1.  **Clone or Download** the repository.
2.  Open the folder in VS Code.
3.  Use the **Live Server** extension (recommended) to launch `index.html`.
    -   *Note: Directly opening the HTML file might block module scripts or local storage in some browsers due to CORS policies.*

## 📸 Credits
-   **Images**: Unsplash (Royalty-free).
-   **Icons**: Font Awesome Free.

---
*Defy Gravity. Experience the Future of Sound.*

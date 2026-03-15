/* Admin Logic */

// Mock Data if empty - Users
if (!localStorage.getItem('admin_users')) {
    const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', joinDate: '2023-01-15' },
        { id: 2, name: 'Alice Smith', email: 'alice@example.com', role: 'User', joinDate: '2023-02-20' },
        { id: 3, name: 'Bob Johnson', email: 'bob@tech.com', role: 'User', joinDate: '2023-03-10' },
        { id: 4, name: 'Emma Wilson', email: 'emma@design.com', role: 'Editor', joinDate: '2023-04-05' }
    ];
    localStorage.setItem('admin_users', JSON.stringify(mockUsers));
}

// Mock Data if empty - Orders
if (!localStorage.getItem('admin_orders')) {
    const mockOrders = [
        { id: 1001, customer: 'Alice Smith', date: '2023-10-25', total: 99999, status: 'Completed' },
        { id: 1002, customer: 'Bob Johnson', date: '2023-10-26', total: 20999, status: 'Processing' },
        { id: 1003, customer: 'John Doe', date: '2023-10-27', total: 7399, status: 'Shipped' },
        { id: 1004, customer: 'Emma Wilson', date: '2023-10-28', total: 37499, status: 'Pending' }
    ];
    localStorage.setItem('admin_orders', JSON.stringify(mockOrders));
}

// Ensure Products exist (from data.js or generic fallback)
if (!localStorage.getItem('products')) {
    // If data.js loaded `products` variable, use it. Otherwise mock.
    if (typeof products !== 'undefined') {
        localStorage.setItem('products', JSON.stringify(products));
    } else {
        // Fallback mock
        const fallbackProducts = [
            { id: 1, name: 'Sony WH-1000XM5', category: 'Audio', price: 349, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=500', stock: 45 },
            { id: 2, name: 'MacBook Air M2', category: 'Electronics', price: 1199, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=500', stock: 12 }
        ];
        localStorage.setItem('products', JSON.stringify(fallbackProducts));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Determine Page
    if (document.getElementById('total-users')) loadDashboardStats();
    if (document.getElementById('users-table-body')) loadUsersTable();
    if (document.getElementById('products-table-body')) loadProductsTable();
    if (document.getElementById('orders-table-body')) loadOrdersTable();
});

// --- Dashboard Functions ---
function loadDashboardStats() {
    const users = JSON.parse(localStorage.getItem('admin_users')) || [];
    const orders = JSON.parse(localStorage.getItem('admin_orders')) || [];

    // Revenue Calculation (Mock)
    const revenue = orders.reduce((acc, order) => acc + order.total, 0);

    animateValue("total-users", 0, users.length, 1000);
    animateValue("total-orders", 0, orders.length, 1500);
    animateValue("total-revenue", 0, revenue, 2000, "₹");
}

function animateValue(id, start, end, duration, prefix = "") {
    const obj = document.getElementById(id);
    if (!obj) return;

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        obj.innerHTML = prefix + value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// --- User CRUD Functions ---
function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem('admin_users')) || [];
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${user.id}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 30px; height: 30px; background: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">${user.name.charAt(0)}</div>
                    ${user.name}
                </div>
            </td>
            <td>${user.email}</td>
            <td><span style="padding: 5px 10px; background: rgba(255,255,255,0.1); border-radius: 20px; font-size: 0.8rem;">${user.role}</span></td>
            <td>${user.joinDate}</td>
            <td>
                <button class="action-btn" onclick="editUser(${user.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn btn-delete" onclick="deleteUser(${user.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.deleteUser = function (id) {
    if (confirm('Are you sure you want to delete this user?')) {
        let users = JSON.parse(localStorage.getItem('admin_users'));
        users = users.filter(u => u.id !== id);
        localStorage.setItem('admin_users', JSON.stringify(users));
        loadUsersTable();
        showToast('User deleted successfully');
    }
}

// User Modal DOM Elements
const userModal = document.getElementById('user-modal');
if (userModal) {
    const userForm = document.getElementById('user-form');

    window.openAddUserModal = function () {
        document.getElementById('modal-title').innerText = 'Add New User';
        document.getElementById('user-id').value = '';
        userForm.reset();
        userModal.classList.add('open');
    }

    window.closeModal = function () {
        userModal.classList.remove('open');
    }

    window.editUser = function (id) {
        const users = JSON.parse(localStorage.getItem('admin_users'));
        const user = users.find(u => u.id === id);
        if (user) {
            document.getElementById('modal-title').innerText = 'Edit User';
            document.getElementById('user-id').value = user.id;
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('role').value = user.role;
            userModal.classList.add('open');
        }
    }

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('user-id').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const role = document.getElementById('role').value;

        let users = JSON.parse(localStorage.getItem('admin_users'));

        if (id) {
            const index = users.findIndex(u => u.id == id);
            if (index !== -1) users[index] = { ...users[index], name, email, role };
        } else {
            users.push({ id: Date.now(), name, email, role, joinDate: new Date().toISOString().split('T')[0] });
        }

        localStorage.setItem('admin_users', JSON.stringify(users));
        loadUsersTable();
        closeModal();
        showToast('User saved successfully');
    });
}

// --- Product CRUD Functions ---
function loadProductsTable() {
    // Try to get from localStorage first (edited data), else fallback to data.js variable if available
    let products = JSON.parse(localStorage.getItem('products'));
    if (!products && typeof window.products !== 'undefined') {
        products = window.products;
    }

    const tbody = document.getElementById('products-table-body');
    if (!tbody || !products) return;

    tbody.innerHTML = '';
    products.forEach(p => {
        const displayImage = getAutoImageForProduct(p.title || p.name, p.category, p.image);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${displayImage}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;"></td>
            <td>${p.title || p.name}</td>
            <td>${p.category}</td>
            <td>₹${p.price}</td>
            <td>${p.stock || Math.floor(Math.random() * 50) + 1}</td>
            <td>
                <button class="action-btn" onclick="editProduct(${p.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn btn-delete" onclick="deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function getAutoImageForProduct(name, category, imageInput) {
    const trimmed = (imageInput || '').trim();
    if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) return trimmed;

    const label = `${name || ''} ${category || ''}`.toLowerCase();
    if (label.includes('aviator')) return 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1760&auto=format&fit=crop';
    if (label.includes('oakley') || label.includes('sunglass')) return 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1760&auto=format&fit=crop';
    if (label.includes('computer') || label.includes('blue')) return 'https://images.unsplash.com/photo-1577922232320-f47d4e51240a?q=80&w=1740&auto=format&fit=crop';
    if (label.includes('contact') || label.includes('acuvue') || label.includes('disposable')) return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1740&auto=format&fit=crop';
    if (label.includes('wayfarer') || label.includes('eyeglass') || label.includes('frame')) return 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=1740&auto=format&fit=crop';

    return 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1740&auto=format&fit=crop';
}

const productModal = document.getElementById('product-modal');
if (productModal) {
    const productForm = document.getElementById('product-form');

    window.openAddProductModal = function () {
        document.getElementById('product-modal-title').innerText = 'Add New Product';
        document.getElementById('product-id').value = '';
        productForm.reset();
        productModal.classList.add('open');
    }

    window.closeProductModal = function () {
        productModal.classList.remove('open');
    }

    window.editProduct = function (id) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        const p = products.find(i => i.id == id);
        if (p) {
            document.getElementById('product-modal-title').innerText = 'Edit Product';
            document.getElementById('product-id').value = p.id;
            document.getElementById('product-name').value = p.title || p.name;
            document.getElementById('product-category').value = p.category;
            document.getElementById('product-price').value = p.price;
            document.getElementById('product-stock').value = p.stock || 10;
            document.getElementById('product-image').value = p.image;
            productModal.classList.add('open');
        }
    }

    window.deleteProduct = function (id) {
        if (confirm('Delete this product?')) {
            let products = JSON.parse(localStorage.getItem('products')) || [];
            products = products.filter(p => p.id != id);
            localStorage.setItem('products', JSON.stringify(products));
            loadProductsTable();
            showToast('Product deleted');
        }
    }

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('product-id').value;
        const name = document.getElementById('product-name').value;
        const category = document.getElementById('product-category').value;
        const price = Number(document.getElementById('product-price').value);
        const stock = Number(document.getElementById('product-stock').value);
        const image = getAutoImageForProduct(name, category, document.getElementById('product-image').value);

        let products = JSON.parse(localStorage.getItem('products')) || [];

        if (id) {
            const index = products.findIndex(p => p.id == id);
            if (index !== -1) {
                products[index] = { ...products[index], title: name, name: name, category, price, stock, image };
            }
        } else {
            products.push({
                id: Date.now(),
                title: name,
                name: name,
                category,
                price,
                stock,
                image
            });
        }

        localStorage.setItem('products', JSON.stringify(products));
        loadProductsTable();
        closeProductModal();
        showToast('Product saved');
    });
}

// --- Order Management Functions ---
function loadOrdersTable() {
    const orders = JSON.parse(localStorage.getItem('admin_orders')) || [];
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    orders.forEach(order => {
        const tr = document.createElement('tr');
        // Status Colors
        let statusStyle = 'background: rgba(255,255,255,0.1); color: #fff;';
        if (order.status === 'Completed') statusStyle = 'background: rgba(0,255,0,0.2); color: #4ade80;';
        if (order.status === 'Pending') statusStyle = 'background: rgba(255,255,0,0.2); color: #facc15;';
        if (order.status === 'Shipped') statusStyle = 'background: rgba(0,0,255,0.2); color: #60a5fa;';

        tr.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>₹${order.total}</td>
            <td><span style="padding: 5px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; ${statusStyle}">${order.status}</span></td>
            <td>
                <select onchange="updateOrderStatus(${order.id}, this.value)" style="background: #222; color: #fff; border: 1px solid #444; padding: 5px; border-radius: 4px;">
                    <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.updateOrderStatus = function (id, newStatus) {
    let orders = JSON.parse(localStorage.getItem('admin_orders'));
    const index = orders.findIndex(o => o.id == id);
    if (index !== -1) {
        orders[index].status = newStatus;
        localStorage.setItem('admin_orders', JSON.stringify(orders));
        loadOrdersTable(); // Refresh to update colors
        showToast(`Order #${id} updated to ${newStatus}`);
    }
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = 'var(--accent-color)';
    toast.style.color = '#000';
    toast.style.padding = '15px 30px';
    toast.style.borderRadius = '30px';
    toast.style.fontWeight = '600';
    toast.style.zIndex = '9999';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

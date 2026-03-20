// ─── INIT ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});


// ─── LOGIN ─────────────────────────────────────────
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const btn = e.target.querySelector('button');
    btn.innerText = 'Signing In...';
    btn.disabled = true;

    try {
        const resp = await window.api.signin(email, password);

        // Save token
        localStorage.setItem('jwtToken', resp.token);

        // Save user
        localStorage.setItem('user', JSON.stringify({
            id: resp.id,
            username: resp.username,
            email: resp.email,
            roles: resp.roles
        }));

        // Redirect
        // 🔥 ADD THIS LOGIC
        if (resp.roles && resp.roles.includes("ROLE_ADMIN")) {
            window.location.href = "/admin/index.html";
        } else {
            window.location.href = "/index.html";
        }

    } catch (err) {
        alert('Login failed: ' + (err.message || err));
        btn.innerText = 'Sign In';
        btn.disabled = false;
    }
}


// ─── REGISTER ─────────────────────────────────────
async function handleRegister(e) {
    e.preventDefault();

    clearErrors();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let isValid = true;

    // NAME
    if (name.length < 3) {
        showError('nameError', 'Name must be at least 3 characters');
        isValid = false;
    }

    // EMAIL
    if (!validateEmail(email)) {
        showError('emailError', 'Invalid email format');
        isValid = false;
    }

    // MOBILE
    if (!/^[0-9]{10}$/.test(mobile)) {
        showError('mobileError', 'Enter valid 10-digit mobile');
        isValid = false;
    }

    // PASSWORD
    if (!validateStrongPassword(password)) {
        showError('passwordError', 'Min 6 chars, 1 uppercase, 1 number');
        isValid = false;
    }

    // CONFIRM PASSWORD
    if (password !== confirmPassword) {
        showError('confirmError', 'Passwords do not match');
        isValid = false;
    }

    if (!isValid) return;

    const payload = {
        username: name,
        email: email,
        mobile: mobile,
        password: password
    };

    try {
        await window.api.signup(payload);
        alert("Signup successful!");
        window.location.href = "login.html";
    } catch (err) {
        alert("Signup failed: " + (err.message || err));
    }
}


// ─── HELPERS ──────────────────────────────────────

// Show error message
function showError(id, message) {
    const el = document.getElementById(id);

    if (!el) {
        console.error("Missing element:", id);
        return;
    }

    el.innerText = message;
    el.style.display = 'block';
}

// Clear all errors
function clearErrors() {
    const errors = document.querySelectorAll('.error-msg');
    errors.forEach(e => {
        e.innerText = '';
        e.style.display = 'none';
    });
}

// Email validation
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Strong password validation
function validateStrongPassword(password) {
    return /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
}

// Toggle password visibility
function togglePassword(id) {
    const input = document.getElementById(id);

    if (!input) return;

    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}
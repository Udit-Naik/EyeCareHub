/* 
   Auth Logic
*/

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

function handleLogin(e) {
    e.preventDefault();
    let isValid = true;

    // Email
    const email = document.getElementById('email');
    if (!validateEmail(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
    } else {
        clearError(email);
    }

    // Password
    const password = document.getElementById('password');
    if (password.value.length < 6) {
        showError(password, 'Password must be at least 6 characters');
        isValid = false;
    } else {
        clearError(password);
    }

    if (isValid) {
        const btn = e.target.querySelector('button');
        btn.innerText = 'Signing In...';
        btn.disabled = true;

        // Use backend auth when available
        if (window.api && window.api.signin) {
            window.api.signin(email.value, password.value).then(resp => {
                // JwtResponse: token, id, username, email, roles
                localStorage.setItem('jwtToken', resp.token || resp.accessToken || resp.token);
                localStorage.setItem('user', JSON.stringify({ id: resp.id, username: resp.username, email: resp.email }));
                window.location.href = '../index.html';
            }).catch(err => {
                btn.innerText = 'Sign In';
                btn.disabled = false;
                alert('Sign in failed: ' + (err.message || err));
            });
        } else {
            // Fallback simulation
            const user = { name: 'Demo User', email: email.value };
            localStorage.setItem('user', JSON.stringify(user));
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 500);
        }
    }
}

function handleRegister(e) {
    e.preventDefault();
    let isValid = true;

    // Name
    const name = document.getElementById('name');
    if (name.value.trim().length < 2) {
        showError(name, 'Name is required');
        isValid = false;
    } else {
        clearError(name);
    }

    // Email
    const email = document.getElementById('email');
    if (!validateEmail(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
    } else {
        clearError(email);
    }

    // Mobile
    const mobile = document.getElementById('mobile');
    if (mobile.value.trim().length < 10) {
        showError(mobile, 'Enter valid mobile number');
        isValid = false;
    } else {
        clearError(mobile);
    }

    // Password
    const password = document.getElementById('password');
    if (!validateStrongPassword(password.value)) {
        showError(password, 'Weak password (Min 8 chars, 1 Uppercase, 1 Number)');
        isValid = false;
    } else {
        clearError(password);
    }

    // Confirm
    const confirm = document.getElementById('confirmPassword');
    if (confirm.value !== password.value) {
        showError(confirm, 'Passwords do not match');
        isValid = false;
    } else {
        clearError(confirm);
    }

    if (isValid) {
        const btn = e.target.querySelector('button');
        btn.innerText = 'Creating Account...';
        btn.disabled = true;

        const payload = {
            username: name.value,
            email: email.value,
            password: password.value,
            // roles omitted; default user role will be assigned by backend
        };

        if (window.api && window.api.signup) {
            window.api.signup(payload).then(() => {
                alert('Account created successfully. Please sign in.');
                window.location.href = 'login.html';
            }).catch(err => {
                btn.innerText = 'Create Account';
                btn.disabled = false;
                alert('Signup failed: ' + (err.message || err));
            });
        } else {
            // Fallback simulation
            const user = { name: name.value, email: email.value, mobile: mobile.value };
            localStorage.setItem('user', JSON.stringify(user));
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 500);
        }
    }
}

// Helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateStrongPassword(password) {
    // Min 8, 1 Upper, 1 Number
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
}

function showError(input, message) {
    input.classList.add('error');
    const msgDiv = input.parentElement.querySelector('.error-msg');
    if (msgDiv) {
        msgDiv.innerText = message;
        msgDiv.style.display = 'block';
    }
}

function clearError(input) {
    input.classList.remove('error');
    const msgDiv = input.parentElement.querySelector('.error-msg');
    if (msgDiv) {
        msgDiv.style.display = 'none';
    }
}

function togglePassword(id) {
    const input = document.getElementById(id);
    const icon = input.parentElement.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

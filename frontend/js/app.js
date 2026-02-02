// Globals
let products = [];
let editingId = null;

// DOM Elements
const form = document.getElementById('product-form');
const productModal = document.getElementById('product-modal');
const modalTitle = document.getElementById('modal-title');
const container = document.getElementById('view-container');

// Auth DOM
const authModal = document.getElementById('auth-modal');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const toggleAuthBtn = document.getElementById('toggle-auth');
let isLoginMode = true;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initNavigation();
    setupModal();
    setupAuth();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        authModal.classList.remove('hidden');
        authModal.style.display = 'flex'; // Ensure flex
    } else {
        authModal.classList.add('hidden');
        authModal.style.display = 'none';
        const email = localStorage.getItem('email');
        if (email) {
            document.querySelector('.user-profile img').title = email;
            // Optionally update UI to show user name
        }
        loadView('dashboard');
    }
}

function initNavigation() {
    const navItems = document.querySelectorAll('nav li');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Load view
            const view = item.dataset.view;
            loadView(view);
        });
    });
}

function setupAuth() {
    toggleAuthBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            authTitle.textContent = 'Login';
            authForm.querySelector('button').textContent = 'Login';
            toggleAuthBtn.textContent = 'Need an account? Sign Up';
        } else {
            authTitle.textContent = 'Sign Up';
            authForm.querySelector('button').textContent = 'Sign Up';
            toggleAuthBtn.textContent = 'Already have an account? Login';
        }
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        const btn = authForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Processing...';
        btn.disabled = true;

        try {
            if (isLoginMode) {
                const data = await api.login(email, password);
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', data.email);
                checkAuth();
            } else {
                await api.register(email, password);
                alert('Registration successful! Please login.');
                // Switch to login mode
                isLoginMode = true;
                toggleAuthBtn.click();
            }
        } catch (err) {
            alert(err.message);
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

function setupModal() {
    const closeBtns = document.querySelectorAll('.close-modal');
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

    // Close on click outside (only product modal)
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeModal();
    });

    // Form Submit
    form.addEventListener('submit', handleFormSubmit);
}

function openModal(product = null) {
    productModal.classList.remove('hidden');
    if (product) {
        editingId = product.id;
        modalTitle.textContent = 'Edit Product';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
    } else {
        editingId = null;
        modalTitle.textContent = 'Add Product';
        form.reset();
        document.getElementById('product-id').value = '';
    }
}

function closeModal() {
    productModal.classList.add('hidden');
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    location.reload();
}

async function loadView(viewName) {
    container.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;

    try {
        if (viewName === 'dashboard') {
            await renderDashboard();
        } else if (viewName === 'products') {
            await renderProducts();
        } else if (viewName === 'settings') {
            renderSettings();
        }
    } catch (err) {
        console.error(err);
        if (err.message.includes('401')) {
            logout(); // Auto logout if unauthorized
        } else {
            container.innerHTML = `<div style="color:var(--danger)">Error loading data: ${err.message}. Make sure the backend is running.</div>`;
        }
    }
}

// --- Views ---

async function renderDashboard() {
    // Fetch fresh data
    products = await api.getProducts();

    const count = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStock = products.filter(p => p.stock < 5).length;

    container.innerHTML = `
        <div class="flex-space-between mb-4">
            <h2>Dashboard Overview</h2>
            <button class="btn btn-primary" onclick="openModal()">
                <i class="fa-solid fa-plus"></i> Add Product
            </button>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Products</h3>
                <div class="value">${count}</div>
            </div>
            <div class="stat-card">
                <h3>Total Inventory Value</h3>
                <div class="value">$${totalValue.toLocaleString()}</div>
            </div>
            <div class="stat-card">
                <h3>Low Stock Items</h3>
                <div class="value">${lowStock}</div>
            </div>
        </div>

        <h3>Recent Products</h3>
        <div class="products-grid mt-4">
            ${products.slice(0, 3).map(p => createProductCard(p)).join('')}
        </div>
    `;
}

async function renderProducts() {
    products = await api.getProducts();

    container.innerHTML = `
        <div class="flex-space-between mb-4">
            <h2>Product Management</h2>
            <button class="btn btn-primary" onclick="window.openModal()">
                <i class="fa-solid fa-plus"></i> Add Product
            </button>
        </div>
        
        <div class="products-grid">
            ${products.map(p => createProductCard(p)).join('')}
        </div>
    `;
}

function renderSettings() {
    container.innerHTML = `
        <h2>Settings</h2>
        <div class="card" style="padding: 1rem; margin-top: 1rem; background: var(--card-bg);">
            <p style="margin-bottom: 1rem;">Logged in as: <strong>${localStorage.getItem('email')}</strong></p>
            <button class="btn btn-danger" onclick="window.logout()">
                <i class="fa-solid fa-sign-out-alt"></i> Logout
            </button>
        </div>
    `;
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image-placeholder">
                <i class="fa-solid fa-box"></i>
            </div>
            <div class="product-info">
                <div class="product-name">${escapeHtml(product.name)}</div>
                <div class="product-meta">
                    <span class="product-price">$${product.price}</span>
                    <span class="product-stock">${product.stock} in stock</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-secondary btn-sm" onclick="window.editProduct(${product.id})">
                        <i class="fa-solid fa-pen"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="window.deleteProduct(${product.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// --- Actions ---

async function handleFormSubmit(e) {
    e.preventDefault();

    const productData = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;

    try {
        if (editingId) {
            productData.id = editingId;
            await api.updateProduct(editingId, productData);
        } else {
            await api.createProduct(productData);
        }

        closeModal();
        // Refresh current view
        const currentView = document.querySelector('nav li.active').dataset.view;
        loadView(currentView);

    } catch (err) {
        alert(err.message);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

window.editProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (product) openModal(product);
};

window.deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        await api.deleteProduct(id);
        const currentView = document.querySelector('nav li.active').dataset.view;
        loadView(currentView);
    } catch (err) {
        alert(err.message);
    }
};

window.logout = logout;
window.window.openModal = openModal;

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

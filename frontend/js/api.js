const API_BASE_URL = 'https://localhost:7109/api/products'; // Adjust if needed

function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

const api = {
    async getProducts() {
        // GET can be public or private, let's keep it public for now or private if needed
        // For Dashboard we might want it protected, but for Storefront public.
        // Let's send token if available.
        const response = await fetch(API_BASE_URL, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    },

    async getProduct(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch product');
        return await response.json();
    },

    async createProduct(product) {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(product),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to create product');
        }
        return await response.json();
    },

    async updateProduct(id, product) {
        if (id != product.id) throw new Error('ID mismatch');

        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(product),
        });

        if (!response.ok && response.status !== 204) {
            const error = await response.text();
            throw new Error(error || 'Failed to update product');
        }
        return true;
    },

    async deleteProduct(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return true;
    },

    // Auth
    async login(email, password) {
        const response = await fetch('https://localhost:7109/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error('Login failed');
        return await response.json();
    },

    async register(email, password) {
        const response = await fetch('https://localhost:7109/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            const err = await response.json();
            if (Array.isArray(err)) throw new Error(err.map(e => e.description).join('\n'));
            throw new Error('Registration failed');
        }
        return await response.json();
    }
};

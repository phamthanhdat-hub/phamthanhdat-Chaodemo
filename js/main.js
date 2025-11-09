// API Configuration
const API_URL = 'http://localhost:3000/api';

// Global State
let cart = [];
let products = [];
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCart();
    initModals();
    checkUserSession();
});

// Modal Handlers
function initModals() {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const cartModal = document.getElementById('cartModal');
    
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const cartBtn = document.getElementById('cartBtn');
    
    // Open modals
    if (loginBtn) {
        loginBtn.onclick = () => loginModal.style.display = 'block';
    }
    
    if (registerBtn) {
        registerBtn.onclick = () => registerModal.style.display = 'block';
    }
    
    if (cartBtn) {
        cartBtn.onclick = () => {
            cartModal.style.display = 'block';
            renderCart();
        };
    }
    
    // Close modals
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(btn => {
        btn.onclick = function() {
            this.closest('.modal').style.display = 'none';
        };
    });
    
    // Close on outside click
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
    
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.onsubmit = handleLogin;
    }
    
    if (registerForm) {
        registerForm.onsubmit = handleRegister;
    }
}

// Authentication
async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentUser = result.user;
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('token', result.token);
            document.getElementById('loginModal').style.display = 'none';
            updateUserUI();
            showNotification('Đăng nhập thành công!', 'success');
        } else {
            showNotification(result.message || 'Đăng nhập thất bại!', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Lỗi kết nối!', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        fullname: formData.get('fullname'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('registerModal').style.display = 'none';
            showNotification('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
            document.getElementById('loginModal').style.display = 'block';
        } else {
            showNotification(result.message || 'Đăng ký thất bại!', 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showNotification('Lỗi kết nối!', 'error');
    }
}

function checkUserSession() {
    const user = localStorage.getItem('user');
    if (user) {
        currentUser = JSON.parse(user);
        updateUserUI();
    }
}

function updateUserUI() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (currentUser) {
        loginBtn.textContent = currentUser.fullname;
        registerBtn.textContent = 'Đăng Xuất';
        registerBtn.onclick = handleLogout;
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    location.reload();
}

// Products
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const result = await response.json();
        
        if (result.success) {
            products = result.data;
            renderProducts();
        }
    } catch (error) {
        console.error('Load products error:', error);
        // Load sample data if API fails
        loadSampleProducts();
    }
}

function loadSampleProducts() {
    products = [
        {
            id: 1,
            name: 'Cháo Gà Rau Củ',
            description: 'Cháo gà thơm ngon với rau củ tươi',
            price: 35000,
            image: 'images/ga.jpg'
        },
        {
            id: 2,
            name: 'Cháo Bò Bí Đỏ',
            description: 'Cháo bò bổ dưỡng kết hợp bí đỏ',
            price: 40000,
            image: 'product2.jpg'
        },
        {
            id: 3,
            name: 'Cháo Cá Hồi',
            description: 'Cháo cá hồi giàu omega 3',
            price: 45000,
            image: 'product3.jpg'
        },
        {
            id: 4,
            name: 'Cháo Tôm Rau Ngót',
            description: 'Cháo tôm với rau ngót bổ dưỡng',
            price: 38000,
            image: 'product4.jpg'
        }
    ];
    renderProducts();
}

function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas fa-bowl-rice"></i>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Thêm
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Cart
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Đã thêm vào giỏ hàng!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        renderCart();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = total;
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem;">Giỏ hàng trống</p>';
        if (cartTotal) cartTotal.textContent = '0đ';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)} x ${item.quantity}</div>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <button onclick="updateQuantity(${item.id}, -1)" style="padding: 0.3rem 0.6rem; border: none; background: #e0e0e0; border-radius: 5px; cursor: pointer;">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" style="padding: 0.3rem 0.6rem; border: none; background: #e0e0e0; border-radius: 5px; cursor: pointer;">+</button>
                <button onclick="removeFromCart(${item.id})" style="padding: 0.3rem 0.6rem; border: none; background: var(--primary); color: white; border-radius: 5px; cursor: pointer; margin-left: 0.5rem;">Xóa</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = formatPrice(total);
}
// Thanh toán
async function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Giỏ hàng trống, không thể thanh toán!', 'error');
        return;
    }

    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để thanh toán!', 'error');
        document.getElementById('loginModal').style.display = 'block';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (!confirm(`Xác nhận thanh toán đơn hàng trị giá ${formatPrice(total)}?`)) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: currentUser.id,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: total
            })
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Thanh toán thành công! Cảm ơn bạn đã mua hàng 💖', 'success');
            cart = [];
            saveCart();
            renderCart();
            updateCartCount();
            document.getElementById('cartModal').style.display = 'none';
        } else {
            showNotification(result.message || 'Thanh toán thất bại!', 'error');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('Lỗi kết nối khi thanh toán!', 'error');
    }
}


// Utilities
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'var(--success)' : 'var(--primary)'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: slideInRight 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
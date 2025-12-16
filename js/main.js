// ===================== CONFIG =====================
const API_URL = "http://127.0.0.1:5000/api";

let products = [];
let cart = [];

// ------------------ Sample fallback ------------------
function loadSampleProducts() {
    products = [
        { id: 1, name: "Cháo Gà Rau Xanh", price: 45000, description: "Cháo gà tươi kết hợp rau xanh, cà rốt - tốt cho hệ tiêu hóa bé", image: "images/a2.jpg" },
        { id: 2, name: "Cháo Thịt Bò Khoai Tây", price: 55000, description: "Cháo thịt bò mềm, khoai tây bổ dưỡng - giàu protein cho bé", image: "images/bo.jpg" },
        { id: 3, name: "Cháo Cá Hồi Bông Cải", price: 65000, description: "Cá hồi tươi, bông cải xoăn - omega-3 tốt cho não bé", image: "images/ca.jpg" },
        { id: 4, name: "Cháo Gà Nấm Rơm", price: 50000, description: "Gà thơm, nấm rơm bổ dưỡng - lành tính cho dạ dày", image: "images/tom.jpg" },
        { id: 5, name: "Cháo Tôm Bí Đỏ", price: 60000, description: "Tôm sạch, bí đỏ giàu vitamin A - tốt cho mắt bé", image: "images/ga.jpg" },
        { id: 6, name: "Cháo Lợn Xương Dùi", price: 48000, description: "Lợn nạc, xương dùi nấu lâu - canxi tốt cho xương bé", image: "images/luon.jpg" }
    ];
}

// ===================== LOAD PRODUCTS =====================
async function loadProducts() {
    try {
        const res = await fetch(`${API_URL}/products`);
        const result = await res.json();

        if (!result.success) {
            console.error("API error:", result.message);
            loadSampleProducts();
            return;
        }

        products = result.data.map(p => ({
            ...p,
            image: p.image ? `images/${p.image}` : "images/ech.jpg"
        }));

        renderProducts();
    } catch (error) {
        console.error("LoadProducts error:", error);
        loadSampleProducts(); // fallback dữ liệu tĩnh nếu API lỗi
    }
}


// ===================== RENDER PRODUCTS =====================
function renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    grid.innerHTML = products.map(item => `
        <div class="product-card">
            <div class="product-image">
                <img src="${item.image}" alt="${item.name}" class="product-img">
            </div>

            <div class="product-info">
                <h3 class="product-name">${item.name}</h3>
                <p class="product-desc">${item.description}</p>

                <div class="product-footer">
                    <span class="product-price">${formatPrice(item.price)}</span>
                    <button onclick="addToCart(${item.id})" class="btn-add-cart">
                        <i class="fas fa-cart-plus"></i> Thêm
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// ===================== CART FUNCTIONS =====================
function addToCart(id) {
    let product = products.find(p => p.id === id);
    if (!product) {
        showCartNotification && showCartNotification('Sản phẩm không tìm thấy');
        return;
    }

    const existing = cart.find(p => p.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({...product, quantity:1});
    }

    updateCartCount();
    renderCart();
    // UX: animate flyer from last clicked element (if available)
    try { animateToCart(product); } catch(e){ /* ignore */ }
    showCartNotification(`${product.name} đã được thêm vào giỏ.`);
}

function updateCartCount() {
    const countEl = document.querySelector(".cart-count");
    if (countEl) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        countEl.textContent = total;
    }
}

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Giỏ hàng trống!</p>";
        cartTotal.textContent = "0đ";
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>${formatPrice(item.price * item.quantity)}</span>
            <button onclick="removeItem(${index})" class="btn-remove">X</button>
        </div>
    `).join("");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = formatPrice(total);
}

function removeItem(index) {
    cart.splice(index,1);
    updateCartCount();
    renderCart();
}

// ===================== FORMAT PRICE =====================
function formatPrice(value) {
    return value.toLocaleString("vi-VN") + "đ";
}

// ===================== MODAL CONTROL =====================
function initModals() {
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const cartBtn = document.getElementById("cartBtn");

    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");
    const cartModal = document.getElementById("cartModal");

    const closeButtons = document.querySelectorAll(".close");

    if (loginBtn && loginModal) loginBtn.onclick = () => loginModal.style.display="block";
    if (registerBtn && registerModal) registerBtn.onclick = () => registerModal.style.display="block";
    if (cartBtn && cartModal) cartBtn.onclick = () => {
        cartModal.style.display="block";
        renderCart();
    };

    closeButtons.forEach(btn => {
        btn.onclick = function() {
            if(loginModal) loginModal.style.display="none";
            if(registerModal) registerModal.style.display="none";
            if(cartModal) cartModal.style.display="none";
        };
    });

    window.onclick = function(event) {
        if(event.target === loginModal) loginModal.style.display="none";
        if(event.target === registerModal) registerModal.style.display="none";
        if(event.target === cartModal) cartModal.style.display="none";
    };
}

// ===================== LOGIN =====================
document.getElementById("loginSubmit")?.addEventListener("click", async () => {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch("auth.php", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({action:"login", username, password})
    });
    const result = await res.json();
    document.getElementById("loginMsg").textContent = result.message;
    if(result.success){
        document.getElementById("loginModal").style.display = "none";
        alert("Đăng nhập thành công!");
    }
});

// ===================== REGISTER =====================
document.getElementById("registerSubmit")?.addEventListener("click", async () => {
    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const res = await fetch("auth.php", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({action:"register", username, email, password})
    });
    const result = await res.json();
    document.getElementById("registerMsg").textContent = result.message;
    if(result.success){
        document.getElementById("registerModal").style.display = "none";
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
    }
});

// ===================== INIT =====================
document.addEventListener("DOMContentLoaded", function() {
    loadProducts();
    initModals();
});

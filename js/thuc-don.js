// Products Data
let allProducts = [];
let filteredProducts = [];
let currentCategory = 'all';

// Sample Products Data
const sampleProducts = [
    {
        id: 1,
        name: 'Cháo Gà Rau Củ',
        description: 'Cháo gà thơm ngon với rau củ tươi, cà rốt, bí đỏ',
        price: 35000,
        category: 'chao-ga',
        image: 'product1.jpg',
        nutrition: { protein: '12g', carb: '25g', fat: '5g', fiber: '3g' }
    },
    {
        id: 2,
        name: 'Cháo Bò Bí Đỏ',
        description: 'Cháo bò bổ dưỡng kết hợp bí đỏ giàu vitamin A',
        price: 40000,
        category: 'chao-bo',
        image: 'product2.jpg',
        nutrition: { protein: '15g', carb: '28g', fat: '6g', fiber: '4g' }
    },
    {
        id: 3,
        name: 'Cháo Cá Hồi',
        description: 'Cháo cá hồi giàu omega 3, DHA tốt cho não bộ',
        price: 45000,
        category: 'chao-ca',
        image: 'product3.jpg',
        nutrition: { protein: '18g', carb: '22g', fat: '8g', fiber: '2g' }
    },
    {
        id: 4,
        name: 'Cháo Tôm Rau Ngót',
        description: 'Cháo tôm với rau ngót bổ dưỡng, giàu canxi',
        price: 38000,
        category: 'chao-tom',
        image: 'product4.jpg',
        nutrition: { protein: '14g', carb: '24g', fat: '5g', fiber: '3g' }
    },
    {
        id: 5,
        name: 'Cháo Gà Nấm Hương',
        description: 'Cháo gà kết hợp nấm hương thơm ngon',
        price: 42000,
        category: 'chao-ga',
        image: 'product5.jpg',
        nutrition: { protein: '13g', carb: '26g', fat: '5g', fiber: '4g' }
    },
    {
        id: 6,
        name: 'Cháo Bò Cà Rốt',
        description: 'Cháo bò với cà rốt giàu beta-carotene',
        price: 40000,
        category: 'chao-bo',
        image: 'product6.jpg',
        nutrition: { protein: '15g', carb: '27g', fat: '6g', fiber: '3g' }
    },
    {
        id: 7,
        name: 'Cháo Cá Diêu Hồng',
        description: 'Cháo cá diêu hồng thơm ngon, giàu protein',
        price: 38000,
        category: 'chao-ca',
        image: 'product7.jpg',
        nutrition: { protein: '16g', carb: '23g', fat: '7g', fiber: '2g' }
    },
    {
        id: 8,
        name: 'Cháo Tôm Bí Xanh',
        description: 'Cháo tôm với bí xanh mát, bổ dưỡng',
        price: 40000,
        category: 'chao-tom',
        image: 'product8.jpg',
        nutrition: { protein: '14g', carb: '25g', fat: '5g', fiber: '4g' }
    },
    {
        id: 9,
        name: 'Cháo Chay Đậu Hũ',
        description: 'Cháo chay thanh đạm với đậu hũ, rau củ',
        price: 32000,
        category: 'chao-chay',
        image: 'product9.jpg',
        nutrition: { protein: '10g', carb: '30g', fat: '4g', fiber: '5g' }
    },
    {
        id: 10,
        name: 'Cháo Gà Yến Mạch',
        description: 'Cháo gà kết hợp yến mạch giàu chất xơ',
        price: 45000,
        category: 'chao-ga',
        image: 'product10.jpg',
        nutrition: { protein: '13g', carb: '28g', fat: '5g', fiber: '6g' }
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    initFilters();
    initSearch();
    initModals();
});

// Load Products
async function loadProducts() {
    try {
        // Try to load from API
        const response = await fetch(`${API_URL}/products`);
        const result = await response.json();
        
        if (result.success) {
            allProducts = result.data;
        }
    } catch (error) {
        console.log('Loading sample products...');
        allProducts = sampleProducts;
    }
    
    filteredProducts = [...allProducts];
    renderProducts();
}

// Render Products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <div class="product-image">
                <i class="fas fa-bowl-rice"></i>
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-nutrition">
                    <div class="nutrition-item">
                        <i class="fas fa-fire"></i>
                        <span>${product.nutrition?.protein || '10g'} Protein</span>
                    </div>
                    <div class="nutrition-item">
                        <i class="fas fa-leaf"></i>
                        <span>${product.nutrition?.fiber || '3g'} Chất xơ</span>
                    </div>
                </div>
                <div class="product-footer">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Thêm
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Show Product Detail
function showProductDetail(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const detail = document.getElementById('productDetail');
    
    detail.innerHTML = `
        <div class="detail-image">
            <i class="fas fa-bowl-rice"></i>
        </div>
        <div class="detail-info">
            <span class="product-category">${getCategoryName(product.category)}</span>
            <h2>${product.name}</h2>
            <p class="product-desc">${product.description}</p>
            
            <div class="detail-nutrition">
                <h4><i class="fas fa-clipboard-list"></i> Thành Phần Dinh Dưỡng</h4>
                <div class="nutrition-list">
                    <div class="nutrition-item">
                        <i class="fas fa-fire"></i> Protein: ${product.nutrition?.protein || '10g'}
                    </div>
                    <div class="nutrition-item">
                        <i class="fas fa-bread-slice"></i> Carb: ${product.nutrition?.carb || '25g'}
                    </div>
                    <div class="nutrition-item">
                        <i class="fas fa-droplet"></i> Chất béo: ${product.nutrition?.fat || '5g'}
                    </div>
                    <div class="nutrition-item">
                        <i class="fas fa-leaf"></i> Chất xơ: ${product.nutrition?.fiber || '3g'}
                    </div>
                </div>
            </div>
            
            <div class="detail-price">${formatPrice(product.price)}</div>
            
            <div class="quantity-selector">
                <button onclick="changeQuantity(-1)"><i class="fas fa-minus"></i></button>
                <span id="quantity">1</span>
                <button onclick="changeQuantity(1)"><i class="fas fa-plus"></i></button>
            </div>
            
            <button class="btn-primary full-width" onclick="addToCartWithQuantity(${product.id})">
                <i class="fas fa-cart-plus"></i> Thêm Vào Giỏ Hàng
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Change Quantity
let modalQuantity = 1;

function changeQuantity(change) {
    modalQuantity = Math.max(1, modalQuantity + change);
    document.getElementById('quantity').textContent = modalQuantity;
}

function addToCartWithQuantity(productId) {
    for (let i = 0; i < modalQuantity; i++) {
        addToCart(productId);
    }
    document.getElementById('productModal').style.display = 'none';
    modalQuantity = 1;
}

// Filters
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = this.getAttribute('data-category');
            filterProducts();
        });
    });
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredProducts = allProducts.filter(product => {
        const matchCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchSearch = product.name.toLowerCase().includes(searchTerm) || 
                          product.description.toLowerCase().includes(searchTerm);
        
        return matchCategory && matchSearch;
    });
    
    renderProducts();
}

// Search
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        filterProducts();
    });
}

// Utilities
function getCategoryName(category) {
    const categories = {
        'chao-ga': 'Cháo Gà',
        'chao-bo': 'Cháo Bò',
        'chao-ca': 'Cháo Cá',
        'chao-tom': 'Cháo Tôm',
        'chao-chay': 'Cháo Chay'
    };
    return categories[category] || 'Cháo';
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Giỏ hàng trống!', 'error');
        return;
    }
    
    if (!currentUser) {
        document.getElementById('cartModal').style.display = 'none';
        document.getElementById('loginModal').style.display = 'block';
        showNotification('Vui lòng đăng nhập để thanh toán', 'info');
        return;
    }
    
    showNotification('Tính năng đặt hàng đang được phát triển!', 'info');
}

// Modal Close
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    closeButtons.forEach(btn => {
        btn.onclick = function() {
            this.closest('.modal').style.display = 'none';
        };
    });
    
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
}
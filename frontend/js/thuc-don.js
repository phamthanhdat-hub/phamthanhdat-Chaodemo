document.addEventListener('DOMContentLoaded', () => {
    // 1. DỮ LIỆU GIẢ LẬP (Mô phỏng dữ liệu từ CSDL)
    const mockData = [
        { id: 1, name: 'Cháo Gà', description: 'Các loại cháo gà dinh dưỡng' },
        { id: 2, name: 'Cháo Bò', description: 'Cháo bò cung cấp nhiều protein' },
        { id: 3, name: 'Cháo Cá', description: 'Cháo cá bổ sung omega 3' },
        { id: 5, name: 'Cháo Chay', description: 'Cháo chay thanh đạm cho bé' }
    ];

    const mockProducts = [
        { id: 1, name: 'Cháo Gà Rau Củ', price: 35000, category_id: 1, protein: 15, carb: 20, fat: 5 },
        { id: 2, name: 'Cháo Gà Bí Đỏ', price: 37000, category_id: 1, protein: 18, carb: 22, fat: 6 },
        { id: 3, name: 'Cháo Bò Hầm', price: 42000, category_id: 2, protein: 25, carb: 30, fat: 8 },
        { id: 4, name: 'Cháo Cá Hồi', price: 45000, category_id: 3, protein: 20, carb: 18, fat: 10 },
        { id: 6, name: 'Cháo Chay Hạt Sen', price: 30000, category_id: 5, protein: 10, carb: 22, fat: 2 }
    ];

    const productListDiv = document.getElementById('product-list');

    // 2. HÀM HIỂN THỊ SẢN PHẨM
    function renderProducts() {
        productListDiv.innerHTML = ''; // Xóa nội dung "Đang tải"

        mockData.forEach(category => {
            const productsInCategory = mockProducts.filter(p => p.category_id === category.id);
            
            // Nếu không có sản phẩm trong danh mục này, bỏ qua
            if (productsInCategory.length === 0) return;

            // Tạo phần tử cho Danh mục
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            
            const categoryHeader = document.createElement('h3');
            categoryHeader.textContent = category.name;
            categorySection.appendChild(categoryHeader);

            const productsGrid = document.createElement('div');
            productsGrid.className = 'products-grid';

            // Tạo các thẻ Sản phẩm
            productsInCategory.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                
                // Hàm định dạng tiền tệ Việt Nam (ví dụ: 35,000 đ)
                const formatVND = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

                productCard.innerHTML = `
                    <h4>${product.name}</h4>
                    <p class="product-price">${formatVND(product.price)}</p>
                    <div class="product-info">
                        <p>Protein: ${product.protein}g | Carb: ${product.carb}g | Fat: ${product.fat}g</p>
                    </div>
                    <button class="btn add-to-cart" data-id="${product.id}" data-name="${product.name}">
                        Thêm vào Giỏ
                    </button>
                `;
                productsGrid.appendChild(productCard);
            });

            categorySection.appendChild(productsGrid);
            productListDiv.appendChild(categorySection);
        });
    }

    // 3. LOGIC GIỎ HÀNG ĐƠN GIẢN
    let cart = [];
    const cartCountElement = document.getElementById('cart-count');

    function updateCartCount() {
        cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Lắng nghe sự kiện thêm vào giỏ hàng
    productListDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = parseInt(event.target.dataset.id);
            const productName = event.target.dataset.name;

            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id: productId, name: productName, quantity: 1 });
            }
            
            updateCartCount();
            console.log(`Đã thêm ${productName} vào giỏ hàng.`, cart);
            alert(`Đã thêm 1 x ${productName} vào giỏ hàng!`);
        }
    });

    // 4. XỬ LÝ FORM LIÊN HỆ
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Mô phỏng gửi dữ liệu (thay vì gọi API/backend)
        console.log('Form liên hệ đã được gửi.');
        
        // Hiển thị thông báo thành công
        document.getElementById('contact-message').style.display = 'block';
        
        // Reset form sau 3 giây
        setTimeout(() => {
            contactForm.reset();
            document.getElementById('contact-message').style.display = 'none';
        }, 3000);
    });

    // Bắt đầu hiển thị sản phẩm khi DOM tải xong
    renderProducts();
});
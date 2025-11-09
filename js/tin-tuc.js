// News Data
let allNews = [];
let filteredNews = [];
let currentCategory = 'all';
let currentPage = 1;
const newsPerPage = 6;

// Sample News Data
const sampleNews = [
    {
        id: 1,
        title: 'Dinh Dưỡng Quan Trọng Trong Giai Đoạn Ăn Dặm',
        excerpt: 'Giai đoạn ăn dặm là thời kỳ vàng trong sự phát triển của trẻ. Bé cần được cung cấp đầy đủ các dưỡng chất...',
        content: 'Giai đoạn ăn dặm là thời kỳ quan trọng trong sự phát triển của trẻ. Bé cần được cung cấp đầy đủ các dưỡng chất từ protein, vitamin, khoáng chất để phát triển toàn diện cả về thể chất lẫn trí tuệ.',
        category: 'dinh-duong',
        author: 'BS. Nguyễn Văn A',
        date: '2024-11-01',
        views: 1250,
        image: 'news1.jpg',
        featured: true
    },
    {
        id: 2,
        title: 'Cách Chọn Nguyên Liệu An Toàn Cho Bé',
        excerpt: 'Việc lựa chọn nguyên liệu tươi ngon, không hóa chất là điều cực kỳ quan trọng...',
        content: 'Việc lựa chọn nguyên liệu tươi ngon, không hóa chất là điều cực kỳ quan trọng. Mẹ nên chọn các loại rau củ hữu cơ, thịt cá tươi sống từ nguồn gốc rõ ràng.',
        category: 'meo-hay',
        author: 'Chuyên gia Lê Thị B',
        date: '2024-10-28',
        views: 890,
        image: 'news2.jpg'
    },
    {
        id: 3,
        title: 'Thực Đơn Ăn Dặm Theo Độ Tuổi',
        excerpt: 'Mỗi độ tuổi của bé cần một chế độ dinh dưỡng phù hợp...',
        content: 'Mỗi độ tuổi của bé cần một chế độ dinh dưỡng phù hợp. Dưới đây là thực đơn gợi ý cho từng giai đoạn phát triển của bé.',
        category: 'thuc-don',
        author: 'BS. Trần Văn C',
        date: '2024-10-25',
        views: 1450,
        image: 'news3.jpg'
    },
    {
        id: 4,
        title: 'Chăm Sóc Bé Trong Mùa Dịch Bệnh',
        excerpt: 'Những lưu ý quan trọng khi chăm sóc bé trong mùa dịch bệnh...',
        content: 'Trong mùa dịch bệnh, việc chăm sóc và bảo vệ sức khỏe cho bé là điều vô cùng quan trọng. Mẹ cần lưu ý các điểm sau.',
        category: 'cham-soc',
        author: 'TS. Phạm Thị D',
        date: '2024-10-20',
        views: 760,
        image: 'news4.jpg'
    },
    {
        id: 5,
        title: 'Bổ Sung DHA Cho Bé Thông Minh',
        excerpt: 'DHA đóng vai trò quan trọng trong phát triển não bộ và thị lực của trẻ...',
        content: 'DHA là axit béo omega-3 đóng vai trò quan trọng trong phát triển não bộ và thị lực của trẻ. Mẹ cần biết cách bổ sung DHA đúng cách.',
        category: 'dinh-duong',
        author: 'BS. Hoàng Văn E',
        date: '2024-10-15',
        views: 1100,
        image: 'news5.jpg'
    },
    {
        id: 6,
        title: 'Làm Sao Để Bé Ăn Ngon Miệng',
        excerpt: 'Những mẹo nhỏ giúp bé ăn ngon và không biếng ăn...',
        content: 'Biếng ăn là nỗi lo của nhiều bậc phụ huynh. Dưới đây là những mẹo nhỏ giúp bé ăn ngon và phát triển tốt.',
        category: 'meo-hay',
        author: 'Chuyên gia Ngô Thị F',
        date: '2024-10-10',
        views: 980,
        image: 'news6.jpg'
    },
    {
        id: 7,
        title: 'Chế Độ Ăn Chay Cho Bé',
        excerpt: 'Những lưu ý khi cho bé ăn chay và cách đảm bảo dinh dưỡng...',
        content: 'Ăn chay có thể mang lại nhiều lợi ích cho sức khỏe, nhưng cần đảm bảo đầy đủ dinh dưỡng cho bé đang phát triển.',
        category: 'thuc-don',
        author: 'BS. Đỗ Văn G',
        date: '2024-10-05',
        views: 650,
        image: 'news7.jpg'
    },
    {
        id: 8,
        title: 'Phát Hiện Sớm Dị Ứng Thực Phẩm',
        excerpt: 'Cách nhận biết và xử lý khi bé bị dị ứng thực phẩm...',
        content: 'Dị ứng thực phẩm ở trẻ nhỏ là vấn đề cần được quan tâm. Mẹ cần biết cách nhận biết và xử lý kịp thời.',
        category: 'cham-soc',
        author: 'BS. Vũ Thị H',
        date: '2024-10-01',
        views: 820,
        image: 'news8.jpg'
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadNews();
    initFilters();
    initModals();
});

// Load News
async function loadNews() {
    try {
        const response = await fetch(`${API_URL}/news`);
        const result = await response.json();
        
        if (result.success) {
            allNews = result.data;
        }
    } catch (error) {
        console.log('Loading sample news...');
        allNews = sampleNews;
    }
    
    filteredNews = [...allNews];
    renderFeaturedNews();
    renderNews();
}

// Render Featured News
function renderFeaturedNews() {
    const featured = allNews.find(news => news.featured) || allNews[0];
    if (!featured) return;
    
    const featuredElement = document.getElementById('featuredNews');
    featuredElement.innerHTML = `
        <div class="featured-image">
            <i class="fas fa-newspaper"></i>
        </div>
        <div class="featured-content">
            <span class="featured-badge">${getCategoryName(featured.category)}</span>
            <h2>${featured.title}</h2>
            <div class="featured-meta">
                <span><i class="fas fa-user"></i> ${featured.author}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(featured.date)}</span>
                <span><i class="fas fa-eye"></i> ${featured.views} lượt xem</span>
            </div>
            <p>${featured.excerpt}</p>
            <button class="btn-read-more" onclick="showNewsDetail(${featured.id})">
                Đọc Tiếp <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
}

// Render News Grid
function renderNews() {
    const start = (currentPage - 1) * newsPerPage;
    const end = start + newsPerPage;
    const pageNews = filteredNews.slice(start, end);
    
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = pageNews.map(news => `
        <div class="news-card" onclick="showNewsDetail(${news.id})">
            <div class="news-card-image">
                <span class="news-category">${getCategoryName(news.category)}</span>
                <i class="fas fa-newspaper"></i>
            </div>
            <div class="news-card-content">
                <h3 class="news-card-title">${news.title}</h3>
                <p class="news-card-excerpt">${news.excerpt}</p>
                <div class="news-card-meta">
                    <span class="news-author">
                        <i class="fas fa-user"></i> ${news.author}
                    </span>
                    <span class="news-date">
                        <i class="fas fa-calendar"></i> ${formatDate(news.date)}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
    
    renderPagination();
}

// Render Pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredNews.length / newsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = `
        <button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    html += `
        <button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = html;
}

// Change Page
function changePage(page) {
    const totalPages = Math.ceil(filteredNews.length / newsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderNews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show News Detail
function showNewsDetail(newsId) {
    const news = allNews.find(n => n.id === newsId);
    if (!news) return;
    
    const modal = document.getElementById('newsModal');
    const detail = document.getElementById('newsDetail');
    
    detail.innerHTML = `
        <div class="news-detail-header">
            <span class="news-detail-category">${getCategoryName(news.category)}</span>
            <h1 class="news-detail-title">${news.title}</h1>
            <div class="news-detail-meta">
                <span><i class="fas fa-user"></i> ${news.author}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(news.date)}</span>
                <span><i class="fas fa-eye"></i> ${news.views} lượt xem</span>
            </div>
        </div>
        
        <div class="news-detail-image">
            <i class="fas fa-newspaper"></i>
        </div>
        
        <div class="news-detail-content">
            ${generateNewsContent(news)}
        </div>
        
        <div class="related-news">
            <h3>Bài Viết Liên Quan</h3>
            <div class="related-grid">
                ${getRelatedNews(news.id, news.category).map(related => `
                    <div class="related-item" onclick="showNewsDetail(${related.id})">
                        <div style="width: 100%; height: 150px; background: linear-gradient(135deg, var(--secondary), var(--accent)); border-radius: 10px; margin-bottom: 0.8rem; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-newspaper" style="font-size: 3rem; color: var(--primary);"></i>
                        </div>
                        <h4>${related.title}</h4>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Generate News Content
function generateNewsContent(news) {
    return `
        <p>${news.content}</p>
        
        <h3>Lợi ích chính</h3>
        <ul>
            <li>Cung cấp đầy đủ dưỡng chất cần thiết cho sự phát triển</li>
            <li>Tăng cường hệ miễn dịch cho bé</li>
            <li>Hỗ trợ phát triển não bộ và thị lực</li>
            <li>Giúp bé ăn ngon miệng và tiêu hóa tốt</li>
        </ul>
        
        <h3>Lời khuyên từ chuyên gia</h3>
        <p>
            Theo các chuyên gia dinh dưỡng, việc cung cấp đầy đủ dưỡng chất cho bé trong giai đoạn 
            ăn dặm là vô cùng quan trọng. Mẹ cần lưu ý chọn lựa thực phẩm phù hợp với từng độ tuổi 
            và tình trạng sức khỏe của bé.
        </p>
        
        <h3>Kết luận</h3>
        <p>
            Hy vọng những thông tin trên sẽ giúp ích cho các bậc phụ huynh trong việc chăm sóc 
            và nuôi dưỡng bé. Hãy luôn quan tâm đến dinh dưỡng và sức khỏe của bé để con phát 
            triển toàn diện nhất.
        </p>
    `;
}

// Get Related News
function getRelatedNews(currentId, category) {
    return allNews
        .filter(news => news.id !== currentId && news.category === category)
        .slice(0, 3);
}

// Initialize Filters
function initFilters() {
    const filterBtns = document.querySelectorAll('.tab-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = this.getAttribute('data-category');
            filterNews();
        });
    });
}

// Filter News
function filterNews() {
    if (currentCategory === 'all') {
        filteredNews = [...allNews];
    } else {
        filteredNews = allNews.filter(news => news.category === currentCategory);
    }
    
    currentPage = 1;
    renderNews();
}

// Utilities
function getCategoryName(category) {
    const categories = {
        'dinh-duong': 'Dinh Dưỡng',
        'cham-soc': 'Chăm Sóc',
        'thuc-don': 'Thực Đơn',
        'meo-hay': 'Mẹo Hay'
    };
    return categories[category] || 'Tin Tức';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Initialize Modals
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
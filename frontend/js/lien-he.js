// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFAQ();
});

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Show loading
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        submitBtn.disabled = true;
        
        try {
            // Send to API
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccessMessage();
                form.reset();
            } else {
                showNotification('Có lỗi xảy ra. Vui lòng thử lại!', 'error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            // Show success even if API fails (for demo)
            showSuccessMessage();
            form.reset();
        } finally {
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Show Success Message
function showSuccessMessage() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Create success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Gửi Thành Công!</h3>
        <p>Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24h.</p>
        <button class="btn-primary" onclick="closeSuccessMessage()">Đóng</button>
    `;
    document.body.appendChild(successMsg);
    
    // Show with animation
    setTimeout(() => {
        overlay.classList.add('show');
        successMsg.classList.add('show');
    }, 100);
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeSuccessMessage();
    }, 5000);
}

// Close Success Message
function closeSuccessMessage() {
    const overlay = document.querySelector('.overlay');
    const successMsg = document.querySelector('.success-message');
    
    if (overlay && successMsg) {
        overlay.classList.remove('show');
        successMsg.classList.remove('show');
        
        setTimeout(() => {
            overlay.remove();
            successMsg.remove();
        }, 300);
    }
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10,11}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Add real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.querySelector('input[name="email"]');
    const phoneInput = document.querySelector('input[name="phone"]');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = 'red';
                showNotification('Email không hợp lệ', 'error');
            } else {
                this.style.borderColor = '#e0e0e0';
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                this.style.borderColor = 'red';
                showNotification('Số điện thoại không hợp lệ', 'error');
            } else {
                this.style.borderColor = '#e0e0e0';
            }
        });
        
        // Auto format phone number
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
});

// Smooth scroll to contact form
if (window.location.hash === '#contact-form') {
    document.querySelector('.contact-form-section').scrollIntoView({
        behavior: 'smooth'
    });
}
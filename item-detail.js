// Item Detail Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out-sine',
        once: true,
        offset: 100
    });

    // Initialize all components
    new ItemGallery();
    new ItemCustomization();
    new TabsManager();
    new WhatsAppInquiry();
    new RelatedProducts();
    
    // Set minimum date for delivery date picker
    const deliveryDateInput = document.getElementById('delivery-date');
    if (deliveryDateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        deliveryDateInput.min = tomorrow.toISOString().split('T')[0];
        deliveryDateInput.value = tomorrow.toISOString().split('T')[0];
    }
});

// Image Gallery with Swiper
class ItemGallery {
    constructor() {
        this.initMainGallery();
        this.initThumbnailGallery();
    }

    initMainGallery() {
        this.mainSwiper = new Swiper('.main-gallery', {
            spaceBetween: 10,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            thumbs: {
                swiper: null // Will be set after thumbnail gallery initialization
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });
    }

    initThumbnailGallery() {
        this.thumbnailSwiper = new Swiper('.thumbnail-gallery', {
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
            breakpoints: {
                320: {
                    slidesPerView: 3,
                },
                768: {
                    slidesPerView: 4,
                }
            }
        });

        // Connect main gallery with thumbnails
        this.mainSwiper.thumbs.swiper = this.thumbnailSwiper;
    }
}

// Item Customization and Pricing
class ItemCustomization {
    constructor() {
        this.basePrice = 2999;
        this.currentPrice = this.basePrice;
        this.quantity = 1;
        this.selectedSize = 'regular';
        this.selectedAddons = [];
        
        this.init();
    }

    init() {
        this.initSizeSelection();
        this.initAddonSelection();
        this.initQuantityControls();
        this.updateTotalPrice();
    }

    initSizeSelection() {
        const sizeButtons = document.querySelectorAll('.size-btn');
        sizeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                sizeButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Update selected size and base price
                this.selectedSize = btn.dataset.size;
                this.basePrice = parseInt(btn.dataset.price);
                this.updateTotalPrice();
            });
        });
    }

    initAddonSelection() {
        const addonCheckboxes = document.querySelectorAll('.addon-item input[type="checkbox"]');
        addonCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const addonPrice = parseInt(checkbox.dataset.price);
                const addonName = checkbox.dataset.addon;
                
                if (checkbox.checked) {
                    this.selectedAddons.push({
                        name: addonName,
                        price: addonPrice
                    });
                } else {
                    this.selectedAddons = this.selectedAddons.filter(addon => addon.name !== addonName);
                }
                
                this.updateTotalPrice();
            });
        });
    }

    initQuantityControls() {
        const qtyInput = document.querySelector('.qty-input');
        const minusBtn = document.querySelector('.qty-btn.minus');
        const plusBtn = document.querySelector('.qty-btn.plus');

        minusBtn.addEventListener('click', () => {
            if (this.quantity > 1) {
                this.quantity--;
                qtyInput.value = this.quantity;
                this.updateTotalPrice();
            }
        });

        plusBtn.addEventListener('click', () => {
            if (this.quantity < 10) {
                this.quantity++;
                qtyInput.value = this.quantity;
                this.updateTotalPrice();
            }
        });

        qtyInput.addEventListener('change', () => {
            const value = parseInt(qtyInput.value);
            if (value >= 1 && value <= 10) {
                this.quantity = value;
                this.updateTotalPrice();
            } else {
                qtyInput.value = this.quantity;
            }
        });
    }

    updateTotalPrice() {
        // Calculate addon total
        const addonTotal = this.selectedAddons.reduce((total, addon) => total + addon.price, 0);
        
        // Calculate total price
        this.currentPrice = (this.basePrice + addonTotal) * this.quantity;
        
        // Update display
        const totalAmountElement = document.getElementById('total-amount');
        if (totalAmountElement) {
            totalAmountElement.textContent = this.currentPrice.toLocaleString('en-IN');
        }
    }

    getOrderDetails() {
        const specialMessage = document.getElementById('special-message').value;
        const deliveryDate = document.getElementById('delivery-date').value;
        
        return {
            productName: 'Premium Birthday Celebration Hamper',
            size: this.selectedSize,
            quantity: this.quantity,
            basePrice: this.basePrice,
            addons: this.selectedAddons,
            totalPrice: this.currentPrice,
            specialMessage: specialMessage,
            deliveryDate: deliveryDate
        };
    }
}

// Tabs Manager
class TabsManager {
    constructor() {
        this.init();
    }

    init() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Remove active class from all buttons and panels
                tabButtons.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked button and corresponding panel
                btn.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });

        // Load more reviews functionality
        const loadMoreBtn = document.querySelector('.load-more-reviews');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', this.loadMoreReviews);
        }

        // Check delivery availability
        const checkDeliveryLink = document.getElementById('check-delivery');
        if (checkDeliveryLink) {
            checkDeliveryLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.checkDeliveryAvailability();
            });
        }
    }

    loadMoreReviews() {
        // Simulate loading more reviews
        const reviewsList = document.querySelector('.reviews-list');
        const newReviews = [
            {
                name: 'Suresh P.',
                rating: 5,
                date: '3 weeks ago',
                text: 'Outstanding quality and presentation. The hamper made our celebration extra special. Thank you Gracias!'
            },
            {
                name: 'Meera J.',
                rating: 4,
                date: '1 month ago',
                text: 'Very good hamper with nice variety. The packaging was elegant and everything was fresh. Would recommend!'
            }
        ];

        newReviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review-item';
            reviewElement.innerHTML = `
                <div class="review-header">
                    <div class="reviewer-info">
                        <h5>${review.name}</h5>
                        <div class="review-rating">
                            ${this.generateStars(review.rating)}
                        </div>
                    </div>
                    <span class="review-date">${review.date}</span>
                </div>
                <p class="review-text">"${review.text}"</p>
            `;
            reviewsList.appendChild(reviewElement);
        });

        // Hide the load more button after loading
        document.querySelector('.load-more-reviews').style.display = 'none';
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    checkDeliveryAvailability() {
        const message = 'Hi! I would like to check delivery availability for my area. Can you please help me with this?';
        const whatsappURL = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    }
}

// WhatsApp Inquiry System
class WhatsAppInquiry {
    constructor() {
        this.customization = new ItemCustomization();
        this.init();
    }

    init() {
        const whatsappBtn = document.getElementById('whatsapp-inquiry');
        const callBtn = document.getElementById('call-inquiry');

        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => {
                this.sendWhatsAppInquiry();
            });
        }

        if (callBtn) {
            callBtn.addEventListener('click', () => {
                this.initiateCall();
            });
        }
    }

    sendWhatsAppInquiry() {
        const orderDetails = this.customization.getOrderDetails();
        const message = this.formatWhatsAppMessage(orderDetails);
        const whatsappURL = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
        
        // Show success feedback
        this.showInquiryFeedback('WhatsApp inquiry sent successfully!');
    }

    formatWhatsAppMessage(details) {
        let message = `🎁 *HAMPER INQUIRY* 🎁\n\n`;
        message += `*Product:* ${details.productName}\n`;
        message += `*Size:* ${details.size.charAt(0).toUpperCase() + details.size.slice(1)}\n`;
        message += `*Quantity:* ${details.quantity}\n`;
        message += `*Base Price:* ₹${details.basePrice.toLocaleString('en-IN')}\n`;

        if (details.addons.length > 0) {
            message += `\n*Add-ons:*\n`;
            details.addons.forEach(addon => {
                message += `• ${this.getAddonDisplayName(addon.name)} (+₹${addon.price})\n`;
            });
        }

        message += `\n*Total Amount:* ₹${details.totalPrice.toLocaleString('en-IN')}\n`;

        if (details.specialMessage) {
            message += `\n*Special Message:* ${details.specialMessage}\n`;
        }

        if (details.deliveryDate) {
            const formattedDate = new Date(details.deliveryDate).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            message += `*Preferred Delivery:* ${formattedDate}\n`;
        }

        message += `\n✨ Please confirm availability and provide further details for this hamper. Thank you!`;

        return message;
    }

    getAddonDisplayName(addonKey) {
        const addonNames = {
            'card': 'Personalized Greeting Card',
            'flowers': 'Fresh Flower Bouquet',
            'balloon': 'Birthday Balloons'
        };
        return addonNames[addonKey] || addonKey;
    }

    initiateCall() {
        // For demo purposes, we'll show a message with the phone number
        const phoneNumber = '+91XXXXXXXXXX';
        if (confirm(`Would you like to call ${phoneNumber} for inquiry?`)) {
            window.location.href = `tel:${phoneNumber}`;
        }
    }

    showInquiryFeedback(message) {
        // Create and show a temporary success message
        const feedback = document.createElement('div');
        feedback.className = 'inquiry-feedback';
        feedback.innerHTML = `
            <div class="feedback-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        feedback.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #25d366, #128c7e);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(37, 211, 102, 0.3);
            z-index: 2000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(feedback);

        // Remove after 3 seconds
        setTimeout(() => {
            feedback.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                feedback.remove();
            }, 300);
        }, 3000);
    }
}

// Related Products
class RelatedProducts {
    constructor() {
        this.init();
    }

    init() {
        const inquiryButtons = document.querySelectorAll('.related-inquiry');
        inquiryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const productName = btn.dataset.product;
                const price = btn.dataset.price;
                this.sendRelatedProductInquiry(productName, price);
            });
        });
    }

    sendRelatedProductInquiry(productName, price) {
        const message = `Hi! I'm interested in the *${productName}* (₹${parseInt(price).toLocaleString('en-IN')}). Could you please provide more details and availability? Thank you!`;
        const whatsappURL = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    }
}

// Add CSS animations for feedback
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

    .feedback-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .feedback-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);
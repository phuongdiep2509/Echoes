// Ticket Gift JavaScript - Booking Integration

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const form = document.getElementById('giftForm');
    const templateOptions = document.querySelectorAll('.template-option');
    const previewCard = document.querySelector('.preview-card');
    const recipientNameInput = document.getElementById('recipientName');
    const giftMessageInput = document.getElementById('giftMessage');

    // Preview elements
    const recipientNamePreview = document.querySelector('.recipient-name');
    const ticketNamePreview = document.querySelector('.ticket-name');
    const messagePreview = document.querySelector('.message-preview');
    const selectedTicketNameSpan = document.getElementById('selectedTicketName');
    const selectedTicketPriceSpan = document.getElementById('selectedTicketPrice');
    const totalPriceSpan = document.getElementById('totalPrice');

    // Booked ticket elements
    const bookedEventName = document.getElementById('bookedEventName');
    const bookedEventDate = document.getElementById('bookedEventDate');
    const bookedEventTime = document.getElementById('bookedEventTime');
    const bookedEventVenue = document.getElementById('bookedEventVenue');
    const bookedTicketType = document.getElementById('bookedTicketType');
    const bookedTicketPrice = document.getElementById('bookedTicketPrice');

    // Booking data (will be loaded from URL params or localStorage)
    let bookingData = null;
    const processingFee = 50000;

    // Initialize
    init();

    function init() {
        loadBookingData();
        setupEventListeners();
        updatePreview();
        updateSummary();
    }

    function loadBookingData() {
        // Try to get booking data from URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('bookingId');
        
        if (bookingId) {
            // Load from localStorage using bookingId
            const savedBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
            bookingData = savedBookings.find(booking => booking.id === bookingId);
        }
        
        // If no booking data found, try to get the latest booking
        if (!bookingData) {
            const savedBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
            bookingData = savedBookings[savedBookings.length - 1]; // Get latest booking
        }
        
        // If still no data, create demo data
        if (!bookingData) {
            bookingData = createDemoBookingData();
        }
        
        displayBookingData();
    }

    function createDemoBookingData() {
        return {
            id: 'demo_' + Date.now(),
            eventName: 'Đêm Nhạc Acoustic - Trịnh Công Sơn',
            eventDate: '25/12/2024',
            eventTime: '20:00',
            venue: 'Nhà hát Lớn Hà Nội',
            ticketType: 'VIP',
            price: 1500000,
            quantity: 1,
            timestamp: new Date().toISOString()
        };
    }

    function displayBookingData() {
        if (!bookingData) return;
        
        bookedEventName.textContent = bookingData.eventName;
        bookedEventDate.textContent = bookingData.eventDate;
        bookedEventTime.textContent = bookingData.eventTime;
        bookedEventVenue.textContent = bookingData.venue;
        bookedTicketType.textContent = bookingData.ticketType;
        bookedTicketPrice.textContent = formatPrice(bookingData.price);
        
        // Update preview with booking data
        ticketNamePreview.textContent = `${bookingData.eventName} (${bookingData.ticketType})`;
    }

    function setupEventListeners() {
        // Template selection
        templateOptions.forEach(option => {
            option.addEventListener('click', function() {
                selectTemplate(this);
            });
        });

        // Form inputs
        recipientNameInput.addEventListener('input', updatePreview);
        giftMessageInput.addEventListener('input', updatePreview);

        // Form submission
        form.addEventListener('submit', handleSubmit);

        // Message character limit
        giftMessageInput.addEventListener('input', function() {
            const maxLength = 200;
            const currentLength = this.value.length;
            
            if (currentLength > maxLength) {
                this.value = this.value.substring(0, maxLength);
            }
            
            // Update character count
            const small = this.parentNode.querySelector('small');
            if (small) {
                small.textContent = `${this.value.length}/${maxLength} ký tự`;
            }
        });
    }

    function selectTemplate(selectedOption) {
        // Remove previous selection
        templateOptions.forEach(option => {
            option.classList.remove('active');
        });

        // Add selection to clicked option
        selectedOption.classList.add('active');

        // Update preview card style
        const template = selectedOption.dataset.template;
        previewCard.className = `preview-card ${template}`;

        // Add animation
        previewCard.style.transform = 'scale(1.05)';
        setTimeout(() => {
            previewCard.style.transform = '';
        }, 300);
    }

    function updatePreview() {
        // Update recipient name
        const recipientName = recipientNameInput.value || 'Tên người nhận';
        recipientNamePreview.textContent = recipientName;

        // Update message
        const message = giftMessageInput.value || 'Lời chúc của bạn sẽ hiển thị ở đây...';
        messagePreview.textContent = message;
    }

    function updateSummary() {
        if (bookingData) {
            selectedTicketNameSpan.textContent = `${bookingData.eventName} (${bookingData.ticketType})`;
            selectedTicketPriceSpan.textContent = formatPrice(bookingData.price);
            
            const total = bookingData.price + processingFee;
            totalPriceSpan.textContent = formatPrice(total);
        } else {
            selectedTicketNameSpan.textContent = 'Không có thông tin vé';
            selectedTicketPriceSpan.textContent = '0đ';
            totalPriceSpan.textContent = formatPrice(processingFee);
        }
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price).replace('₫', 'đ');
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('.btn-gift');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '🔄 Đang xử lý...';
        submitBtn.disabled = true;

        // Prepare gift data
        const giftData = prepareGiftData();
        
        // Save gift data to localStorage
        localStorage.setItem('giftTicketData', JSON.stringify(giftData));

        // Simulate processing time
        setTimeout(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Redirect to payment page
            window.location.href = 'payment.html?type=gift';
        }, 1500);
    }

    function validateForm() {
        const recipientName = recipientNameInput.value.trim();
        const recipientEmail = document.getElementById('recipientEmail').value.trim();

        if (!recipientName) {
            showError('Vui lòng nhập tên người nhận');
            recipientNameInput.focus();
            return false;
        }

        if (!recipientEmail) {
            showError('Vui lòng nhập email người nhận');
            document.getElementById('recipientEmail').focus();
            return false;
        }

        if (!isValidEmail(recipientEmail)) {
            showError('Email không hợp lệ');
            document.getElementById('recipientEmail').focus();
            return false;
        }

        if (!bookingData) {
            showError('Không tìm thấy thông tin vé đã booking');
            return false;
        }

        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function prepareGiftData() {
        const selectedTemplate = document.querySelector('.template-option.active');
        
        return {
            type: 'gift',
            recipient: {
                name: recipientNameInput.value,
                email: document.getElementById('recipientEmail').value,
                phone: document.getElementById('recipientPhone').value || ''
            },
            booking: bookingData,
            message: giftMessageInput.value,
            template: selectedTemplate ? selectedTemplate.dataset.template : 'classic',
            pricing: {
                ticketPrice: bookingData.price,
                processingFee: processingFee,
                total: bookingData.price + processingFee
            },
            timestamp: new Date().toISOString(),
            id: 'gift_' + Date.now()
        };
    }

    function showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10001;
            box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
            animation: slideInRight 0.3s ease;
        `;

        // Add animation keyframes if not exists
        if (!document.querySelector('#errorAnimationStyle')) {
            const style = document.createElement('style');
            style.id = 'errorAnimationStyle';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(errorDiv);

        // Auto remove after 3 seconds
        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 300);
        }, 3000);
    }

    // Function to be called from booking page
    window.initGiftFromBooking = function(bookingId) {
        const urlParams = new URLSearchParams();
        urlParams.set('bookingId', bookingId);
        window.location.href = 'ticketGift.html?' + urlParams.toString();
    };
});
// ===== PAYMENT PAGE - CLEAN VERSION =====

// Configuration
const CONFIG = {
    SYSTEM_FEE: 50000,
    DEMO_MODE: true
};

// Data
const PROMOTIONS = [
    { id: 'vip20', title: 'VIP20', discount: 0.2, desc: 'Khách hàng VIP' },
    { id: 'new15', title: 'NEW15', discount: 0.15, desc: 'Khách hàng mới' },
    { id: 'member10', title: 'MEMBER10', discount: 0.1, desc: 'Thành viên thường' }
];

const PAYMENTS = [
    { id: 'momo', name: 'Ví MoMo', img: '../assets/images/bankings/momo.png' },
    { id: 'shopeepay', name: 'ShopeePay', img: '../assets/images/bankings/shopeepay.png' },
    { id: 'vnpay', name: 'VNPay', img: '../assets/images/bankings/vnpay.png' },
    { id: 'zalopay', name: 'ZaloPay', img: '../assets/images/bankings/zalopay.png' },
    { id: 'visa', name: 'Visa/Mastercard', img: 'https://img.icons8.com/color/48/visa.png' },
    { id: 'atm', name: 'Thẻ ATM', img: 'https://img.icons8.com/color/48/bank-card-back-side.png' }
];

const VOUCHERS = {
    'ECHOES50': { discount: 0.5, desc: 'Giảm 50% VIP' },
    'STUDENT15': { discount: 0.15, desc: 'Giảm 15% sinh viên' },
    'WEEKEND10': { discount: 0.1, desc: 'Giảm 10% cuối tuần' }
};

// State
let state = {
    ticket: null,
    selectedPromo: null,
    selectedPayment: null,
    customVoucher: null,
    totalAmount: 0,
    discountAmount: 0
};

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
    loadTicket();
    renderAll();
    bindEvents();
    calculate();
}

// Load ticket data
function loadTicket() {
    // Check URL parameters for booking type
    const urlParams = new URLSearchParams(window.location.search);
    const bookingType = urlParams.get('type');
    const bookingId = urlParams.get('bookingId');
    
    // Handle seat booking
    if (bookingType === 'seat-booking' && bookingId) {
        const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const booking = bookings.find(b => b.id === bookingId);
        
        if (booking) {
            state.ticket = {
                title: booking.eventName,
                location: booking.venue,
                date: booking.eventDate,
                time: booking.eventTime,
                type: booking.ticketType,
                seatSection: booking.seatSection,
                price: booking.price,
                quantity: booking.quantity,
                totalPrice: booking.totalAmount,
                img: '../assets/images/index/main_banner_1.png',
                bookingId: booking.id
            };
            return;
        }
    }
    
    // Handle regular booking
    if (bookingType === 'booking' && bookingId) {
        const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const booking = bookings.find(b => b.id === bookingId);
        
        if (booking) {
            state.ticket = {
                title: booking.eventName,
                location: booking.venue,
                date: booking.eventDate,
                time: booking.eventTime,
                type: booking.ticketType,
                price: booking.price,
                quantity: booking.quantity,
                img: '../assets/images/index/main_banner_1.png',
                bookingId: booking.id
            };
            return;
        }
    }
    
    // Try legacy selectedTicket
    const saved = localStorage.getItem('selectedTicket');
    if (saved) {
        try {
            state.ticket = JSON.parse(saved);
            return;
        } catch (e) {}
    }
    
    // Demo data
    state.ticket = {
        title: 'Echoes Concert 2024',
        location: 'Nhà hát Hòa Bình, TP.HCM',
        date: '25/12/2024',
        time: '20:00 - 22:30',
        type: 'VIP',
        price: 500000,
        quantity: 1,
        img: '../assets/images/index/main_banner_1.png'
    };
}

// Render functions
function renderAll() {
    renderTicket();
    renderPromos();
    renderPayments();
}

function renderTicket() {
    const t = state.ticket;
    document.getElementById('ticket-img').src = t.img;
    document.getElementById('ticket-title').textContent = t.title;
    document.getElementById('ticket-loc').innerHTML = `<i class="fas fa-map-marker-alt me-1"></i>${t.location}`;
    document.getElementById('ticket-time').innerHTML = `<i class="fas fa-clock me-1"></i>${t.time}`;
    document.getElementById('event-date').textContent = t.date;
    
    // Handle seat booking display
    if (t.seatSection) {
        document.getElementById('ticket-zone').textContent = `${t.quantity || 1}x Vé ${t.type} (${t.seatSection})`;
    } else {
        document.getElementById('ticket-zone').textContent = `${t.quantity || 1}x Vé ${t.type}`;
    }
    
    // Use total price for seat booking, individual price for others
    const displayPrice = t.totalPrice || (t.price * (t.quantity || 1));
    document.getElementById('ticket-price').textContent = formatMoney(displayPrice);
    document.getElementById('system-fee').textContent = formatMoney(CONFIG.SYSTEM_FEE);
}

function renderPromos() {
    const container = document.querySelector('.promotion-grid-simple');
    container.innerHTML = PROMOTIONS.map((p, i) => `
        <div class="promotion-card ${i === 0 ? 'selected' : ''}" data-id="${p.id}">
            <input type="radio" name="promo" value="${p.discount}" ${i === 0 ? 'checked' : ''}>
            <div class="promotion-title">${p.title}</div>
            <div class="promotion-desc">${p.desc}</div>
        </div>
    `).join('');
    
    state.selectedPromo = PROMOTIONS[0];
}

function renderPayments() {
    const container = document.querySelector('.payment-options-simple');
    container.innerHTML = PAYMENTS.map((p, i) => `
        <div class="payment-option ${i === 0 ? 'selected' : ''}" data-id="${p.id}">
            <input type="radio" name="payment" value="${p.id}" ${i === 0 ? 'checked' : ''}>
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://img.icons8.com/color/48/wallet.png'">
            <div class="payment-name">${p.name}</div>
        </div>
    `).join('');
    
    state.selectedPayment = PAYMENTS[0];
}

// Events
function bindEvents() {
    // Promo selection
    document.addEventListener('click', (e) => {
        const promoCard = e.target.closest('.promotion-card');
        if (promoCard) {
            document.querySelectorAll('.promotion-card').forEach(c => c.classList.remove('selected'));
            promoCard.classList.add('selected');
            promoCard.querySelector('input').checked = true;
            
            const id = promoCard.dataset.id;
            state.selectedPromo = PROMOTIONS.find(p => p.id === id);
            state.customVoucher = null;
            calculate();
        }
        
        const paymentOption = e.target.closest('.payment-option');
        if (paymentOption) {
            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
            paymentOption.classList.add('selected');
            paymentOption.querySelector('input').checked = true;
            
            const id = paymentOption.dataset.id;
            state.selectedPayment = PAYMENTS.find(p => p.id === id);
        }
    });
    
    // Custom voucher
    document.getElementById('apply-voucher-btn').addEventListener('click', applyVoucher);
    document.getElementById('custom-voucher-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyVoucher();
    });
    
    // Payment button
    document.getElementById('payment-btn').addEventListener('click', processPayment);
}

// Apply custom voucher
function applyVoucher() {
    const input = document.getElementById('custom-voucher-input');
    const code = input.value.trim().toUpperCase();
    
    if (!code) {
        showNotif('Vui lòng nhập mã giảm giá', 'warning');
        return;
    }
    
    if (VOUCHERS[code]) {
        state.customVoucher = { code, ...VOUCHERS[code] };
        state.selectedPromo = null;
        
        // Clear promo selection
        document.querySelectorAll('.promotion-card').forEach(c => c.classList.remove('selected'));
        document.querySelectorAll('input[name="promo"]').forEach(i => i.checked = false);
        
        showNotif(`Áp dụng mã ${code} thành công!`, 'success');
        calculate();
    } else {
        showNotif('Mã giảm giá không hợp lệ', 'error');
    }
}

// Calculate total
function calculate() {
    // Use total price for seat booking, calculate for others
    const basePrice = state.ticket.totalPrice || (state.ticket.price * (state.ticket.quantity || 1));
    let discount = 0;
    
    if (state.selectedPromo) {
        discount = basePrice * state.selectedPromo.discount;
    } else if (state.customVoucher) {
        discount = basePrice * state.customVoucher.discount;
    }
    
    const total = basePrice - discount + CONFIG.SYSTEM_FEE;
    
    state.discountAmount = discount;
    state.totalAmount = total;
    
    updatePriceDisplay();
}

function updatePriceDisplay() {
    const discountRow = document.getElementById('discount-row');
    const finalTotal = document.getElementById('final-total');
    
    if (state.discountAmount > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('discount-amount').textContent = `-${formatMoney(state.discountAmount)}`;
    } else {
        discountRow.style.display = 'none';
    }
    
    finalTotal.textContent = formatMoney(state.totalAmount);
}

// Process payment
function processPayment() {
    if (!state.selectedPayment) {
        showNotif('Vui lòng chọn phương thức thanh toán', 'warning');
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showSuccess();
        
        // Save payment history
        const payment = {
            id: 'PAY' + Date.now(),
            ticket: state.ticket,
            payment: state.selectedPayment,
            total: state.totalAmount,
            discount: state.discountAmount,
            timestamp: new Date().toISOString()
        };
        
        const history = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
        history.push(payment);
        localStorage.setItem('paymentHistory', JSON.stringify(history));
        
        setTimeout(() => localStorage.removeItem('selectedTicket'), 3000);
    }, 2000);
}

// Utilities
function formatMoney(amount) {
    return `${amount.toLocaleString('vi-VN')} đ`;
}

function showNotif(message, type = 'info') {
    const notif = document.createElement('div');
    notif.className = `alert alert-${type === 'error' ? 'danger' : type} position-fixed`;
    notif.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    notif.innerHTML = `${message} <button onclick="this.parentElement.remove()" class="btn-close"></button>`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

function showLoading() {
    const modal = new bootstrap.Modal(document.getElementById('loadingModal'));
    modal.show();
}

function hideLoading() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('loadingModal'));
    if (modal) modal.hide();
}

function showSuccess() {
    // Move booking from userBookings to completedBookings
    if (state.ticket && state.ticket.bookingId) {
        try {
            const userBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
            const completedBookings = JSON.parse(localStorage.getItem('completedBookings') || '[]');
            
            // Find and remove from userBookings
            const bookingIndex = userBookings.findIndex(b => b.id === state.ticket.bookingId);
            if (bookingIndex !== -1) {
                const completedBooking = userBookings.splice(bookingIndex, 1)[0];
                completedBooking.status = 'completed';
                completedBooking.paymentDate = new Date().toISOString();
                completedBooking.totalPaid = state.totalAmount;
                completedBooking.paymentTime = new Date().toLocaleString('vi-VN');
                
                // Add to completedBookings
                completedBookings.push(completedBooking);
                
                // Update localStorage
                localStorage.setItem('userBookings', JSON.stringify(userBookings));
                localStorage.setItem('completedBookings', JSON.stringify(completedBookings));
                
                // Save completed ticket to sessionStorage for immediate display
                sessionStorage.setItem('completedTicket', JSON.stringify(completedBooking));
            }
        } catch (error) {
            console.error('Error completing booking:', error);
        }
    }
    
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

// Function to view tickets after payment
window.viewMyTickets = function() {
    window.location.href = '../myTicket.html?from=payment';
};

// Export for booking page
window.proceedToPayment = function(ticketData) {
    localStorage.setItem('selectedTicket', JSON.stringify(ticketData));
    window.location.href = 'components/payment.html';
};
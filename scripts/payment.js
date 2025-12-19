// payment.js (ES Module – Professional version)

/* =========================
   DATA
========================= */
const PROMOTIONS = [
    { title: 'Giảm 50%', discount: 0.5 },
    { title: 'Giảm 15%', discount: 0.15 }
];

const PAYMENTS = [
    { name: 'Ví ShopeePay', img: '../assets/images/bankings/shopeepay.png' },
    { name: 'Ví Momo', img: '../assets/images/bankings/momo.png' }
];

/* =========================
   STATE
========================= */
const ticket = JSON.parse(localStorage.getItem('selectedTicket'));
const SYSTEM_FEE = 50000;

/* =========================
   DOM READY
========================= */
document.addEventListener('DOMContentLoaded', () => {
    if (!ticket) {
        alert('Không tìm thấy thông tin vé!');
        window.location.href = 'index.html';
        return;
    }

    renderTicketInfo();
    renderPromotions();
    renderPayments();
    updatePrice();

    bindEvents();
});

/* =========================
   RENDER FUNCTIONS
========================= */
function renderTicketInfo() {
    document.getElementById('ticket-img').src = ticket.img;
    document.getElementById('ticket-title').textContent = ticket.title;
    document.getElementById('ticket-loc').textContent = ticket.location;
    document.getElementById('ticket-zone').textContent = `1x Vé ${ticket.type}`;
    document.getElementById('ticket-price').textContent =
        `${ticket.price.toLocaleString()} đ`;
}

function renderPromotions() {
    const promoContainer = document.querySelector('.promotion-form');

    promoContainer.innerHTML = PROMOTIONS.map((promo, index) => `
        <label>
            <input 
                type="radio" 
                name="promo" 
                value="${promo.discount}" 
                ${index === 0 ? 'checked' : ''}
            >
            <div>
                <strong>${promo.title}</strong>
                <p class="small m-0">Giảm trực tiếp vào giá vé</p>
            </div>
        </label>
    `).join('');
}

function renderPayments() {
    const paymentContainer = document.querySelector('.payment-form');

    paymentContainer.innerHTML = PAYMENTS.map((method, index) => `
        <label>
            <input 
                type="radio" 
                name="payment" 
                ${index === 0 ? 'checked' : ''}
            >
            <img src="${method.img}" alt="${method.name}">
            <p>${method.name}</p>
        </label>
    `).join('');
}

/* =========================
   EVENTS
========================= */
function bindEvents() {
    document
        .querySelectorAll('input[name="promo"]')
        .forEach(input =>
            input.addEventListener('change', updatePrice)
        );

    document
        .querySelector('.btn-finish')
        .addEventListener('click', handlePayment);
}

/* =========================
   LOGIC
========================= */
function updatePrice() {
    const discountRate = getSelectedDiscount();
    const discountAmount = ticket.price * discountRate;
    const total = ticket.price - discountAmount + SYSTEM_FEE;

    document.getElementById('final-total').textContent =
        `${total.toLocaleString()} đ`;

    document.getElementById('discount-row').innerHTML = `
        <div class="d-flex justify-content-between text-success">
            <span>Khuyến mãi</span>
            <span>- ${discountAmount.toLocaleString()} đ</span>
        </div>
    `;
}

function getSelectedDiscount() {
    const checked = document.querySelector('input[name="promo"]:checked');
    return checked ? parseFloat(checked.value) : 0;
}

function handlePayment() {
    const paymentSelected =
        document.querySelector('input[name="payment"]:checked');

    if (!paymentSelected) {
        alert('Vui lòng chọn phương thức thanh toán!');
        return;
    }

    alert('Thanh toán thành công (demo)');
    localStorage.removeItem('selectedTicket');
}

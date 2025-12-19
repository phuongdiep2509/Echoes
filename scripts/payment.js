// Dữ liệu thanh toán & khuyến mãi
const promotions = [
    { title: 'Giảm 50%', discount: 0.5 },
    { title: 'Giảm 15%', discount: 0.15 }
];

const payments = [
    { name: 'Ví ShopeePay', img: '../assets/images/banking/shopeepay.png' },
    { name: 'Ví Momo', img: '../assets/images/banking/momo.png' }
];

// Lấy dữ liệu vé từ trang trước đó
const currentTicket = JSON.parse(localStorage.getItem('selectedTicket'));

document.addEventListener('DOMContentLoaded', () => {
    if (!currentTicket) {
        alert("Thông tin vé trống!");
        return;
    }
    
    renderUI();
    updatePrice();
});

function renderUI() {
    // 1. Đổ dữ liệu vé vào cột bên phải
    document.getElementById('ticket-img').src = currentTicket.img;
    document.getElementById('ticket-title').innerText = currentTicket.title;
    document.getElementById('ticket-loc').innerText = currentTicket.location;
    document.getElementById('ticket-zone').innerText = `1x Vé ${currentTicket.type}`;
    document.getElementById('ticket-price').innerText = `${currentTicket.price.toLocaleString()} đ`;

    // 2. Render Voucher
    const promoForm = document.querySelector('.promotion-form');
    promoForm.innerHTML = promotions.map((p, i) => `
        <label>
            <input type="radio" name="promo" value="${p.discount}" ${i===0?'checked':''}>
            <div>
                <strong>${p.title}</strong>
                <p class="small m-0">Giảm giá trực tiếp</p>
            </div>
        </label>
    `).join('');

    // 3. Render Phương thức thanh toán
    const payForm = document.querySelector('.payment-form');
    payForm.innerHTML = payments.map(p => `
        <label>
            <input type="radio" name="pay" checked>
            <img src="${p.img}">
            <p>${p.name}</p>
        </label>
    `).join('');

    // Lắng nghe sự kiện đổi voucher
    document.querySelectorAll('input[name="promo"]').forEach(r => {
        r.addEventListener('change', updatePrice);
    });
}

function updatePrice() {
    const basePrice = currentTicket.price;
    const fee = 50000;
    const discountRate = parseFloat(document.querySelector('input[name="promo"]:checked').value);
    
    const discountAmount = basePrice * discountRate;
    const total = basePrice - discountAmount + fee;

    document.getElementById('final-total').innerText = `${total.toLocaleString()} đ`;
    document.getElementById('discount-row').innerHTML = `
        <div class="d-flex justify-content-between text-success">
            <span>Khuyến mãi</span>
            <span>-${discountAmount.toLocaleString()} đ</span>
        </div>
    `;
}
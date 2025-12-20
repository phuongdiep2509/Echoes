import { merchandise } from './ObjectForEchoes.js';

document.addEventListener('DOMContentLoaded', function() {
    renderMerchandiseList();
});

function renderMerchandiseList() {
    const container = document.getElementById('merchandise-list-container');
    const entries = Object.entries(merchandise);

    container.innerHTML = entries.map(([id, product]) => `
        <div class="col-md-6 col-lg-3 mb-4">
            <a href="merchandiseDetail.html?id=${id}" class="product-item text-decoration-none">
                <div class="card shadow-sm h-100 ${!product.inStock ? 'out-of-stock' : ''}">
                    <div class="position-relative">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                        ${!product.inStock ? '<span class="stock-badge">Hết hàng</span>' : ''}
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title fw-bold text-dark">${product.name}</h6>
                        <p class="card-text text-muted small mb-2">${product.description}</p>
                        <div class="mt-auto">
                            <p class="card-text text-danger fw-bold mb-0">${formatPrice(product.price)}</p>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price).replace('₫', 'đ');
}
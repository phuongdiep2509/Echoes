import { merchandise } from './ObjectForEchoes.js';

// Pagination settings
const ITEMS_PER_PAGE = 8;
let currentPage = 1;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', function() {
    renderAllProducts();
    setupPagination();
});

function renderAllProducts() {
    const container = document.getElementById('all-products');
    const allProducts = Object.values(merchandise).filter(product => product.inStock);
    
    totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentProducts = allProducts.slice(startIndex, endIndex);

    container.innerHTML = currentProducts.map(product => `
        <a href="merchandiseDetail.html?id=${product.id}" class="product-wrapper">
            <div class="product-thumb">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-content">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <div class="price">${formatPrice(product.price)}</div>
            </div>
        </a>
    `).join('');
}

function setupPagination() {
    const prevBtn = document.getElementById('pagerPrev');
    const nextBtn = document.getElementById('pagerNext');
    const dotsContainer = document.getElementById('pagerDots');

    // Create dots
    dotsContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = `dot ${i === currentPage ? 'active' : ''}`;
        dot.addEventListener('click', () => goToPage(i));
        dotsContainer.appendChild(dot);
    }

    // Update button states
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // Button event listeners
    prevBtn.onclick = () => goToPage(currentPage - 1);
    nextBtn.onclick = () => goToPage(currentPage + 1);
}

function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderAllProducts();
    setupPagination();
    
    // Scroll to top of products
    document.querySelector('.title-indent').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}
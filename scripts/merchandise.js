import { merchandise } from './ObjectForEchoes.js';

// Pagination settings
const ITEMS_PER_PAGE = 8;
let currentPage = 1;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, merchandise data:', merchandise); // Debug log
    renderAllProducts();
    setupPagination();
});

function renderAllProducts() {
    const container = document.getElementById('all-products');
    if (!container) {
        console.error('Container #all-products not found');
        return;
    }
    
    const allProducts = Object.values(merchandise);
    console.log('All products:', allProducts); // Debug log
    
    totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentProducts = allProducts.slice(startIndex, endIndex);

    console.log('Current products:', currentProducts); // Debug log

    container.innerHTML = currentProducts.map(product => {
        const stockBadgeClass = product.inStock ? 'in' : 'out';
        const stockBadgeText = product.inStock ? 'CÒN HÀNG' : 'HẾT HÀNG';
        const outOfStockClass = !product.inStock ? 'out-of-stock' : '';
        
        console.log(`Product ${product.name}: inStock=${product.inStock}, class=${stockBadgeClass}`); // Debug log
        
        return `
        <a href="merchandiseDetail.html?id=${product.id}" class="product-wrapper ${outOfStockClass}">
            <div class="product-thumb">
                <img src="${product.image}" alt="${product.name}">
                <div class="stock-badge ${stockBadgeClass}">${stockBadgeText}</div>
            </div>
            <div class="product-content">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <div class="price">${formatPrice(product.price)}</div>
            </div>
        </a>
    `;
    }).join('');
    
    console.log('HTML generated and inserted'); // Debug log
}

function setupPagination() {
    const prevBtn = document.getElementById('pagerPrev');
    const nextBtn = document.getElementById('pagerNext');
    const dotsContainer = document.getElementById('pagerDots');

    if (!prevBtn || !nextBtn || !dotsContainer) {
        console.error('Pagination elements not found');
        return;
    }

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
    const titleElement = document.querySelector('.title-indent') || document.querySelector('.page-title');
    if (titleElement) {
        titleElement.scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}
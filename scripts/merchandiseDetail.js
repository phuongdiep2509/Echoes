/* ======================
   MERCHANDISE DETAIL
====================== */
// Import merchandise data
import { merchandise } from './ObjectForEchoes.js';

// Global variables
let currentProduct = null;
let qty = 1;

// Get merchandise data from URL or use default
function getMerchandiseData() {
    const urlParams = new URLSearchParams(window.location.search);
    const merchId = urlParams.get('id');
    
    console.log('Loading merchandise with ID:', merchId);
    console.log('Available merchandise:', Object.keys(merchandise));
    
    // Try to get product from ObjectForEchoes.js
    if (merchId && merchandise[merchId]) {
        const product = merchandise[merchId];
        console.log('Found product:', product);
        
        return {
            id: merchId,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            material: product.material || 'Chất liệu cao cấp',
            size: product.size || 'Kích thước tiêu chuẩn',
            category: product.category || 'Phụ kiện',
            inStock: product.inStock !== false
        };
    }
    
    // Default product data (fallback)
    console.log('Using default product data');
    return {
        id: 'castle-veil-bandana',
        name: 'Castle Veil Bandana',
        price: 105000,
        image: 'assets/images/merch/merch1.png',
        description: 'Castle Veil Bandana – "Wonder Hallows" Collection Echoes Year End 2025',
        material: 'Lụa bóng',
        size: '60 × 60 cm',
        category: 'Phụ kiện',
        inStock: true
    };
}

// Update page content with product data
function updatePageContent(product) {
    console.log('Updating page content with:', product);
    
    // Update title and breadcrumb
    document.title = `${product.name} | Echoes`;
    
    const productTitle = document.getElementById('product-title');
    const productBreadcrumb = document.getElementById('product-breadcrumb');
    
    if (productTitle) productTitle.textContent = product.name;
    if (productBreadcrumb) productBreadcrumb.textContent = product.name;
    
    // Update product info
    const productName = document.getElementById('productName');
    const productPrice = document.getElementById('productPrice');
    const productDesc = document.getElementById('productDesc');
    const productMaterial = document.getElementById('productMaterial');
    const productSize = document.getElementById('productSize');
    const productImg = document.getElementById('productImg');
    
    if (productName) productName.textContent = product.name;
    if (productPrice) productPrice.textContent = formatPrice(product.price);
    if (productDesc) productDesc.textContent = product.description;
    if (productMaterial) productMaterial.textContent = product.material;
    if (productSize) productSize.textContent = product.size;
    if (productImg) {
        productImg.src = product.image;
        productImg.alt = product.name;
    }
    
    // Update stock status
    const stockBadge = document.getElementById('stockBadge');
    const buyButton = document.getElementById('buyButton');
    
    if (stockBadge && buyButton) {
        if (product.inStock) {
            stockBadge.textContent = 'CÒN HÀNG';
            stockBadge.className = 'stock-badge-large';
            buyButton.textContent = 'MUA HÀNG';
            buyButton.disabled = false;
            buyButton.style.opacity = '1';
            buyButton.style.cursor = 'pointer';
        } else {
            stockBadge.textContent = 'HẾT HÀNG';
            stockBadge.className = 'stock-badge-large out';
            buyButton.textContent = 'HẾT HÀNG';
            buyButton.disabled = true;
            buyButton.style.opacity = '0.6';
            buyButton.style.cursor = 'not-allowed';
        }
    }
}

// Format price function
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Quantity functions
function changeQty(delta) {
    const qtyInput = document.getElementById('qty');
    if (!qtyInput) return;
    
    let currentQty = parseInt(qtyInput.value) || 1;
    let newQty = currentQty + delta;
    
    if (newQty < 1) newQty = 1;
    if (newQty > 10) newQty = 10; // Max quantity limit
    
    qtyInput.value = newQty;
    qty = newQty;
}

// Tab functions
function openTab(tabIndex) {
    const tabButtons = document.querySelectorAll('.tab-buttons button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Remove active class from all
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected
    if (tabButtons[tabIndex] && tabContents[tabIndex]) {
        tabButtons[tabIndex].classList.add('active');
        tabContents[tabIndex].classList.add('active');
    }
}

// Image modal functions
function openImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const productImg = document.getElementById('productImg');
    
    if (modal && modalImg && productImg) {
        modal.style.display = 'flex';
        modalImg.src = productImg.src;
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Buy button handler
function handleBuyClick() {
    if (!currentProduct) {
        alert('Không tìm thấy thông tin sản phẩm!');
        return;
    }
    
    if (!currentProduct.inStock) {
        alert('Sản phẩm này hiện đã hết hàng!');
        return;
    }
    
    const qtyInput = document.getElementById('qty');
    const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
    
    // Create merchandise booking data
    const merchandiseData = {
        id: 'merch_' + Date.now(),
        type: 'merchandise',
        productId: currentProduct.id,
        productName: currentProduct.name,
        productImage: currentProduct.image,
        price: currentProduct.price,
        quantity: quantity,
        totalPrice: currentProduct.price * quantity,
        date: new Date().toLocaleDateString('vi-VN'),
        time: new Date().toLocaleTimeString('vi-VN'),
        status: 'pending'
    };

    // Save to sessionStorage for payment page
    sessionStorage.setItem('currentMerchandiseData', JSON.stringify(merchandiseData));
    
    // Also save to localStorage for order history
    const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    existingOrders.push(merchandiseData);
    localStorage.setItem('userOrders', JSON.stringify(existingOrders));

    console.log('Merchandise booking created:', merchandiseData);

    // Redirect to payment page
    window.location.href = 'payment.html?type=merchandise';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    currentProduct = getMerchandiseData();
    updatePageContent(currentProduct);
    
    // Add event listeners
    const productImg = document.getElementById('productImg');
    const buyButton = document.getElementById('buyButton');
    
    if (productImg) {
        productImg.addEventListener('click', openImageModal);
    }
    
    if (buyButton) {
        buyButton.addEventListener('click', handleBuyClick);
    }
    
    // Make functions global for HTML onclick
    window.changeQty = changeQty;
    window.openTab = openTab;
    window.closeImageModal = closeImageModal;
});
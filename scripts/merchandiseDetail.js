/* ======================
   MERCHANDISE DATA
====================== */
// Import merchandise data
import { merchandise } from './ObjectForEchoes.js';

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
    const defaultProduct = {
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
    
    return defaultProduct;
}

// Update page content with product data
function updatePageContent(product) {
    console.log('Updating page content with:', product);
    
    // Update title
    document.title = `${product.name} | Echoes`;
    
    // Update breadcrumb
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `Merch / Year End 2025 / <span>${product.name}</span>`;
    }
    
    // Update product image
    const productImg = document.getElementById('productImg');
    if (productImg) {
        productImg.src = product.image;
        productImg.alt = product.name;
    }
    
    // Update product info
    const productTitle = document.querySelector('.product-info h1');
    if (productTitle) {
        productTitle.textContent = product.name;
    }
    
    const productPrice = document.querySelector('.product-info .price');
    if (productPrice) {
        productPrice.textContent = formatPrice(product.price);
    }
    
    const productDesc = document.querySelector('.product-info .desc');
    if (productDesc) {
        productDesc.textContent = product.description;
    }
    
    // Update meta information
    const metaList = document.querySelector('.product-info .meta');
    if (metaList) {
        metaList.innerHTML = `
            <li><strong>Chất liệu:</strong> ${product.material}</li>
            <li><strong>Kích thước:</strong> ${product.size}</li>
            ${!product.inStock ? '<li><strong>Tình trạng:</strong> <span style="color: red;">Hết hàng</span></li>' : ''}
        `;
    }
    
    // Update buy button state
    const buyButton = document.querySelector('.buy-now');
    if (buyButton && !product.inStock) {
        buyButton.textContent = 'HẾT HÀNG';
        buyButton.disabled = true;
        buyButton.style.backgroundColor = '#ccc';
        buyButton.style.cursor = 'not-allowed';
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price).replace('₫', 'đ');
}

/* ======================
   QUANTITY
====================== */
let qty = 1;
let currentProduct = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    currentProduct = getMerchandiseData();
    updatePageContent(currentProduct);
    
    // Setup buy button after content is loaded
    setupBuyButton();
});

function changeQty(value) {
    qty += value;
    if (qty < 1) qty = 1;
    if (qty > 10) qty = 10; // Giới hạn tối đa 10 sản phẩm
    
    const qtyInput = document.getElementById("qty");
    if (qtyInput) {
        qtyInput.value = qty;
    }
}

// Make changeQty available globally
window.changeQty = changeQty;

/* ======================
   TABS
====================== */
function openTab(index) {
    const tabs = document.querySelectorAll(".tab-content");
    const buttons = document.querySelectorAll(".tab-buttons button");

    tabs.forEach(tab => tab.classList.remove("active"));
    buttons.forEach(btn => btn.classList.remove("active"));

    if (tabs[index] && buttons[index]) {
        tabs[index].classList.add("active");
        buttons[index].classList.add("active");
    }
}

// Make openTab available globally
window.openTab = openTab;

/* ======================
   IMAGE MODAL
====================== */
const productImg = document.getElementById("productImg");
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");

productImg.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = productImg.src;
});

function closeModal() {
    modal.style.display = "none";
}

/* ======================
   BUY NOW - PROCEED TO PAYMENT
====================== */
function setupBuyButton() {
    const buyNowBtn = document.querySelector(".buy-now");
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", () => {
            // Check if product is in stock
            if (!currentProduct.inStock) {
                showToast("Sản phẩm này hiện đã hết hàng!");
                return;
            }
            
            console.log("Proceeding to payment for:", {
                product: currentProduct.name,
                quantity: qty,
                totalPrice: currentProduct.price * qty
            });

            // Create merchandise booking data
            const merchandiseData = {
                id: 'merch_' + Date.now(),
                type: 'merchandise',
                productId: currentProduct.id,
                productName: currentProduct.name,
                productImage: currentProduct.image,
                price: currentProduct.price,
                quantity: qty,
                totalAmount: currentProduct.price * qty,
                category: currentProduct.category,
                material: currentProduct.material,
                size: currentProduct.size,
                description: currentProduct.description,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };

            // Save to sessionStorage for payment page
            sessionStorage.setItem('currentMerchandiseData', JSON.stringify(merchandiseData));
            
            // Also save to localStorage for order history
            const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
            existingOrders.push(merchandiseData);
            localStorage.setItem('userOrders', JSON.stringify(existingOrders));

            // Show toast and redirect
            showToast("Đang chuyển đến trang thanh toán...");
            
            // Redirect to payment page after a short delay
            setTimeout(() => {
                window.location.href = 'payment.html?type=merchandise';
            }, 1000);
        });
    }
}

/* ======================
   TOAST
====================== */
const toast = document.createElement("div");
toast.className = "toast";
document.body.appendChild(toast);

function showToast(message = "Đang chuyển đến trang thanh toán...") {
    toast.innerHTML = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}
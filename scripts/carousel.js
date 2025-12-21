// Hàm mở Popup
    function openModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Ngăn cuộn trang chính
    }

    // Hàm đóng Popup
    function closeModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Cho phép cuộn lại
    }

    // Đóng khi click ra ngoài vùng trắng
    window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target == modal) {
        closeModal();
    }
    }
document.addEventListener('DOMContentLoaded', () => {

    const list = document.querySelector('.carousel-list');
    const slides = document.querySelectorAll('.carousel-image');
    const counterContainer = document.querySelector('.carousel-counter');
    const next = document.querySelector('.carousel-button-next');
    const prev = document.querySelector('.carousel-button-prev');

    if (!list || slides.length === 0) return;

    let index = 0;
    const total = slides.length;
    let autoSlide;

    /* ===== TẠO COUNTER TỰ ĐỘNG ===== */
    if (counterContainer) {
        updateCounter();
    }

    /* ===== HIỂN THỊ SLIDE ===== */
    function showSlide(i) {
        index = (i + total) % total;
        list.style.transform = `translateX(-${index * 100}%)`;

        // Cập nhật counter
        updateCounter();
    }

    /* ===== CẬP NHẬT COUNTER ===== */
    function updateCounter() {
        if (counterContainer) {
            counterContainer.textContent = `${index + 1} / ${total}`;
        }
    }
    
    /* ===== AUTO SLIDE ===== */
    function startAutoSlide() {
        autoSlide = setInterval(() => {
            showSlide(index + 1);
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlide);
        startAutoSlide();
    }

    /* ===== PREV / NEXT ===== */
    next?.addEventListener('click', () => {
        showSlide(index + 1);
        resetAutoSlide();
    });

    prev?.addEventListener('click', () => {
        showSlide(index - 1);
        resetAutoSlide();
    });

    /* ===== INIT ===== */
    showSlide(0);
    startAutoSlide();
});
window.addEventListener('message', (event) => {
    // Kiểm tra origin nếu cần (cho an toàn, ví dụ: if (event.origin !== 'http://yourdomain.com') return;)
    if (event.data.action === 'closeModalAndRedirect') {
        closeModal(); // Đóng modal
        window.location.href = event.data.url; // Redirect trang chính
    }
});
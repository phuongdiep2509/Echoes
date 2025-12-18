document.addEventListener('DOMContentLoaded', () => {

    const list = document.querySelector('.carousel-list');
    const slides = document.querySelectorAll('.carousel-image');
    const dotsContainer = document.querySelector('.carousel-dots');
    const next = document.querySelector('.carousel-button-next');
    const prev = document.querySelector('.carousel-button-prev');

    if (!list || slides.length === 0) return;

    let index = 0;
    const total = slides.length;
    let autoSlide;

    /* ===== TẠO DOTS TỰ ĐỘNG ===== */
    dotsContainer.innerHTML = ''; // clear trước

    slides.forEach((_, i) => {
        const dot = document.createElement('li');
        if (i === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
            showSlide(i);
            resetAutoSlide();
        });

        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dots li');

    /* ===== HIỂN THỊ SLIDE ===== */
    function showSlide(i) {
        index = (i + total) % total;
        list.style.transform = `translateX(-${index * 100}%)`;

        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
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
    
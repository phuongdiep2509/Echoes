let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Ở đầu trang
    if (currentScroll <= 0) {
        header.classList.remove('show');
        header.classList.remove('hide');
        return;
    }

    // Vuốt xuống → ẩn
    if (currentScroll > lastScroll && currentScroll > 120) {
        header.classList.add('hide');
        header.classList.remove('show');
    } 
    // Vuốt lên → hiện
    else {
        header.classList.remove('hide');
        header.classList.add('show');
    }

    lastScroll = currentScroll;
});

 // ==== Pagination cho event-list: 2 trang, mỗi trang 4 card ====
  const eventList = document.querySelector('.event-list');
  const cards = Array.from(eventList.querySelectorAll('.event-wrapper'));

  const prevBtn = document.getElementById('pagerPrev');
  const nextBtn = document.getElementById('pagerNext');
  const dotsWrap = document.getElementById('pagerDots');
  const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

  const pageSize = 8;   // 4 card / trang
  const totalPages = 2; // đúng yêu cầu 2 trang
  let page = 0;

  function renderPage(){
    cards.forEach((card, i) => {
      const start = page * pageSize;
      const end = start + pageSize;
      card.style.display = (i >= start && i < end) ? '' : 'none';
    });

    dots.forEach(d => d.classList.remove('active'));
    dots[page].classList.add('active');

    prevBtn.disabled = page === 0;
    nextBtn.disabled = page === totalPages - 1;
  }

  prevBtn.addEventListener('click', () => {
    if(page > 0){ page--; renderPage(); }
  });

  nextBtn.addEventListener('click', () => {
    if(page < totalPages - 1){ page++; renderPage(); }
  });

  dots.forEach(d => {
    d.addEventListener('click', () => {
      page = Number(d.dataset.page);
      renderPage();
    });
  });

  renderPage();
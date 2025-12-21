import { liveMusic } from './ObjectForEchoes.js';

const ITEMS_PER_PAGE = 8;
const TRENDING_COUNT = 3;

let currentPage = 1;
let allLiveMusic = []; // toàn bộ entries
let allEvents = [];    // entries dùng cho grid (không trùng trending)

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, initializing live music...');
  console.log('liveMusic data:', liveMusic);
  
  allLiveMusic = Object.entries(liveMusic);
  console.log('allLiveMusic entries:', allLiveMusic.length);

  // ✅ Bỏ 3 sự kiện đầu ra khỏi grid để không bị lặp
  allEvents = allLiveMusic.slice(TRENDING_COUNT);
  console.log('allEvents entries:', allEvents.length);

  renderTrendingList();
  renderEventList();
  setupPagination();
});

function renderTrendingList() {
  const container = document.getElementById('trending-list');
  console.log('Trending container:', container);
  
  if (!container) {
    console.error('trending-list container not found!');
    return;
  }
  
  const trendingEvents = allLiveMusic.slice(0, TRENDING_COUNT);
  console.log('Rendering trending events:', trendingEvents.length);

  container.innerHTML = trendingEvents.map(([id, event]) => `
    <div class="trending-item" onclick="location.href='concertDetail.html?id=${id}&type=live-music'">
      <div class="trending-thumb">
        <img src="${event.image}" alt="${event.title}">
      </div>
      <div class="trending-info">
        <h4>${event.title}</h4>
        <p class="price">${event.price}</p>
        <span class="date">${event.date}</span>
      </div>
    </div>
  `).join('');
  
  console.log('Trending list rendered');
}

function renderEventList() {
  const container = document.getElementById('event-list');
  console.log('Event list container:', container);
  
  if (!container) {
    console.error('event-list container not found!');
    return;
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageItems = allEvents.slice(startIndex, endIndex);
  
  console.log('Rendering events for page', currentPage, ':', pageItems.length);

  container.innerHTML = pageItems.map(([id, event]) => `
    <div class="event-wrapper" onclick="location.href='concertDetail.html?id=${id}&type=live-music'">
      <div class="event-thumb">
        <img src="${event.image}" alt="${event.title}">
      </div>
      <button class="btn ${getButtonClass(event.status)}">${getButtonText(event.status)}</button>
      <div class="event-content">
        <h4>${event.title}</h4>
        <p>${event.price}</p>
        <span>${event.date}</span>
      </div>
    </div>
  `).join('');
  
  console.log('Event list rendered');
}

function setupPagination() {
  const totalPages = Math.ceil(allEvents.length / ITEMS_PER_PAGE);
  const dotsContainer = document.getElementById('pagerDots');
  const prevBtn = document.getElementById('pagerPrev');
  const nextBtn = document.getElementById('pagerNext');

  // nếu currentPage vượt quá totalPages (sau khi bỏ trending) thì kéo về trang cuối
  if (currentPage > totalPages) currentPage = totalPages || 1;

  // Render dots
  dotsContainer.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const dot = document.createElement('span');
    dot.className = `dot ${i === currentPage ? 'active' : ''}`;
    dot.addEventListener('click', () => goToPage(i));
    dotsContainer.appendChild(dot);
  }

  prevBtn.onclick = () => currentPage > 1 && goToPage(currentPage - 1);
  nextBtn.onclick = () => currentPage < totalPages && goToPage(currentPage + 1);

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

function goToPage(page) {
  const totalPages = Math.ceil(allEvents.length / ITEMS_PER_PAGE);
  currentPage = Math.min(Math.max(page, 1), totalPages);

  renderEventList();

  document.querySelectorAll('#pagerDots .dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentPage - 1);
  });

  document.getElementById('pagerPrev').disabled = currentPage === 1;
  document.getElementById('pagerNext').disabled = currentPage === totalPages;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// giữ nguyên 2 hàm này
function getButtonClass(status) {
  switch (status) {
    case 'available': return 'buy';
    case 'limited': return 'buy';
    case 'sold': return 'sold';
    case 'expired': return 'expired';
    default: return 'buy';
  }
}
function getButtonText(status) {
  switch (status) {
    case 'available': return 'MUA NGAY';
    case 'limited': return 'MUA NGAY';
    case 'sold': return 'HẾT HÀNG';
    case 'expired': return 'ĐÃ HẾT THỜI GIAN';
    default: return 'MUA NGAY';
  }
}

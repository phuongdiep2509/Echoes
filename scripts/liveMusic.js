import { liveMusic } from './ObjectForEchoes.js';

const ITEMS_PER_PAGE = 8;
let currentPage = 1;
let allLiveMusic = [];

document.addEventListener('DOMContentLoaded', function() {
    allLiveMusic = Object.entries(liveMusic);
    renderTrendingList();
    renderEventList();
    setupPagination();
});

function renderTrendingList() {
    const container = document.getElementById('trending-list');
    if (!container) return;
    
    // Lấy 3 live music đầu tiên làm trending
    const trendingEvents = allLiveMusic.slice(0, 3);

    container.innerHTML = trendingEvents.map(([id, event]) => `
        <div class="trending-item" onclick="location.href='eventDetail.html?id=${id}&type=live-music'">
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
}

function renderEventList() {
    const container = document.getElementById('event-list');
    if (!container) return;
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageItems = allLiveMusic.slice(startIndex, endIndex);

    container.innerHTML = pageItems.map(([id, event]) => `
        <div class="event-wrapper" onclick="location.href='eventDetail.html?id=${id}&type=live-music'">
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
}

function getButtonClass(status) {
    switch(status) {
        case 'available': return 'buy';
        case 'limited': return 'buy';
        case 'sold': return 'sold';
        case 'expired': return 'expired';
        default: return 'buy';
    }
}

function getButtonText(status) {
    switch(status) {
        case 'available': return 'MUA NGAY';
        case 'limited': return 'MUA NGAY';
        case 'sold': return 'HẾT HÀNG';
        case 'expired': return 'ĐÃ HẾT THỜI GIAN';
        default: return 'MUA NGAY';
    }
}

function setupPagination() {
    const totalPages = Math.ceil(allLiveMusic.length / ITEMS_PER_PAGE);
    const dotsContainer = document.getElementById('pagerDots');
    
    // Render dots
    dotsContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const dot = document.createElement('span');
        dot.className = `dot ${i === currentPage ? 'active' : ''}`;
        dot.dataset.page = i - 1;
        dot.addEventListener('click', () => goToPage(i));
        dotsContainer.appendChild(dot);
    }

    // Setup navigation buttons
    const prevBtn = document.getElementById('pagerPrev');
    const nextBtn = document.getElementById('pagerNext');

    prevBtn.onclick = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };
}

function goToPage(page) {
    currentPage = page;
    renderEventList();
    
    // Update dots
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === page - 1);
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
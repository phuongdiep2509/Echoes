import { concerts, liveMusic } from './ObjectForEchoes.js';

// Event Detail JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const btnBook = document.getElementById('btnBook');

    // State
    let currentEventData = null;

    // Initialize
    init();

    function init() {
        setupEventListeners();
        loadEventData();
    }

    function setupEventListeners() {
        // Booking button
        btnBook.addEventListener('click', handleBooking);
    }

    function loadEventData() {
        // Get event data from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('id');
        const eventType = urlParams.get('type') || 'concert';
        
        if (!eventId) {
            console.error('No event ID provided');
            return;
        }

        // Load event data from ObjectForEchoes.js
        const eventData = getEventData(eventId, eventType);
        if (eventData) {
            currentEventData = eventData;
            displayEventData(eventData, eventType);
        } else {
            console.error('Event not found:', eventId);
        }
    }

    function getEventData(eventId, eventType) {
        if (eventType === 'concert') {
            return concerts[eventId];
        } else if (eventType === 'live-music') {
            return liveMusic[eventId];
        }
        return null;
    }

    function displayEventData(data, eventType) {
        // Get current event ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('id');
        
        // Update breadcrumb
        const categoryBreadcrumb = document.getElementById('categoryBreadcrumb');
        if (eventType === 'concert') {
            categoryBreadcrumb.textContent = 'CONCERT';
            categoryBreadcrumb.href = 'concert.html';
        } else {
            categoryBreadcrumb.textContent = 'NHẠC SỐNG';
            categoryBreadcrumb.href = 'music.html';
        }

        // Update page content
        document.getElementById('eventBreadcrumb').textContent = data.title;
        document.getElementById('eventTitle').textContent = data.title;
        document.getElementById('eventDate').textContent = data.date;
        document.getElementById('eventVenue').textContent = data.venue;
        document.getElementById('eventGenre').textContent = data.genre;
        document.getElementById('eventDuration').textContent = data.duration;
        document.getElementById('eventPoster').src = data.poster;
        document.getElementById('eventPoster').alt = data.title;

        // Update description
        const descContainer = document.getElementById('eventDescription');
        descContainer.innerHTML = data.description.map(p => `<p>${p}</p>`).join('');

        // Update highlights
        const highlightsContainer = document.getElementById('eventHighlights');
        highlightsContainer.innerHTML = data.highlights.map(h => `<li class="mb-2">${h}</li>`).join('');

        // Update terms if available
        if (data.terms) {
            const termsContainer = document.getElementById('eventTerms');
            const termsContent = document.getElementById('termsContent');
            termsContent.innerHTML = data.terms.map(term => {
                if (term.startsWith('**') && term.endsWith('**')) {
                    return `<div class="fw-bold text-dark mt-3 mb-2">${term.replace(/\*\*/g, '')}</div>`;
                } else if (term === '') {
                    return '<br>';
                } else {
                    return `<div class="mb-1">${term}</div>`;
                }
            }).join('');
            termsContainer.style.display = 'block';
        }

        // Update ticket price info
        displayTicketPriceInfo(data.tickets);

        // Update booking button based on event status
        updateBookingButton(data.status);

        // Load related events
        loadRelatedEvents(eventType, eventId);

        // Update page title
        document.title = `${data.title} | Echoes`;
    }

    function displayTicketPriceInfo(tickets) {
        const container = document.getElementById('ticketPriceInfo');
        
        container.innerHTML = `
            <div class="text-center">
                <h5 class="fw-bold text-danger mb-3">GIÁ VÉ</h5>
                ${tickets.map(ticket => `
                    <div class="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                        <span class="fw-bold">${ticket.name}</span>
                        <span class="text-danger fw-bold">${formatPrice(ticket.price)}</span>
                    </div>
                `).join('')}
                <div class="mt-3 p-2 bg-light rounded">
                    <small class="text-muted">
                        <strong>Giá vé từ:</strong> ${formatPrice(Math.min(...tickets.map(t => t.price)))}
                    </small>
                </div>
            </div>
        `;
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price).replace('₫', 'đ');
    }

    function updateBookingButton(status) {
        const btnBook = document.getElementById('btnBook');
        
        if (!btnBook) return;
        
        switch(status) {
            case 'expired':
                btnBook.textContent = 'HẾT HẠN';
                btnBook.disabled = true;
                btnBook.style.backgroundColor = '#6c757d';
                btnBook.style.borderColor = '#6c757d';
                btnBook.style.cursor = 'not-allowed';
                btnBook.title = 'Sự kiện đã hết hạn';
                break;
            case 'sold':
                btnBook.textContent = 'HẾT VÉ';
                btnBook.disabled = true;
                btnBook.style.backgroundColor = '#343a40';
                btnBook.style.borderColor = '#343a40';
                btnBook.style.cursor = 'not-allowed';
                btnBook.title = 'Sự kiện đã hết vé';
                break;
            case 'limited':
                btnBook.textContent = 'ĐẶT NGAY (CÒN ÍT)';
                btnBook.disabled = false;
                btnBook.style.backgroundColor = '#dc3545';
                btnBook.style.borderColor = '#dc3545';
                btnBook.style.cursor = 'pointer';
                btnBook.title = 'Còn ít vé, đặt ngay!';
                break;
            case 'available':
            default:
                btnBook.textContent = 'ĐẶT NGAY';
                btnBook.disabled = false;
                btnBook.style.backgroundColor = '#74070d';
                btnBook.style.borderColor = '#74070d';
                btnBook.style.cursor = 'pointer';
                btnBook.title = 'Đặt vé ngay';
                break;
        }
    }

    function loadRelatedEvents(currentEventType, currentEventId) {
        console.log('Loading related events for:', currentEventType, currentEventId);
        const container = document.getElementById('relatedEvents');
        
        if (!container) {
            console.error('Related events container not found');
            return;
        }
        
        let allEvents = [];
        
        // Combine concerts and live music
        const concertEntries = Object.entries(concerts);
        const liveMusicEntries = Object.entries(liveMusic);
        
        console.log('Concert entries:', concertEntries.length);
        console.log('Live music entries:', liveMusicEntries.length);
        
        // Add type info to each event
        concertEntries.forEach(([id, event]) => {
            if (id !== currentEventId) {
                allEvents.push({ ...event, eventType: 'concert', eventId: id });
            }
        });
        
        liveMusicEntries.forEach(([id, event]) => {
            if (id !== currentEventId) {
                allEvents.push({ ...event, eventType: 'live-music', eventId: id });
            }
        });
        
        console.log('All events (excluding current):', allEvents.length);
        
        // Shuffle and take 4 random events
        const shuffled = allEvents.sort(() => 0.5 - Math.random());
        const relatedEvents = shuffled.slice(0, 4);
        
        console.log('Related events to show:', relatedEvents.length);
        
        container.innerHTML = relatedEvents.map(event => `
            <div class="col-md-6 col-lg-3 mb-4">
                <div class="card h-100 shadow-sm related-event-card" onclick="location.href='eventDetail.html?id=${event.eventId}&type=${event.eventType}'" style="cursor: pointer;">
                    <div class="position-relative">
                        <img src="${event.image}" class="card-img-top" alt="${event.title}" style="height: 200px; object-fit: cover;">
                        <span class="badge position-absolute top-0 start-0 m-2" style="background-color: ${event.eventType === 'concert' ? 'var(--color-red)' : 'var(--color-green)'}; color: white;">
                            ${event.eventType === 'concert' ? 'CONCERT' : 'NHẠC SỐNG'}
                        </span>
                        <span class="badge bg-${getStatusBadgeColor(event.status)} position-absolute top-0 end-0 m-2">
                            ${getStatusText(event.status)}
                        </span>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title fw-bold">${event.title}</h6>
                        <p class="card-text text-muted small mb-2">
                            <i class="fas fa-calendar-alt me-1"></i>${event.date}
                        </p>
                        <p class="card-text text-muted small mb-2">
                            <i class="fas fa-map-marker-alt me-1"></i>${event.venue}
                        </p>
                        <div class="mt-auto">
                            <p class="card-text text-danger fw-bold mb-0">${event.price}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        console.log('Related events HTML updated');
        
        // Fallback if no events found
        if (relatedEvents.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">Không có sự kiện liên quan nào khác.</p>
                </div>
            `;
        }
    }

    function getStatusText(status) {
        switch(status) {
            case 'available': return 'Còn vé';
            case 'limited': return 'Còn ít';
            case 'sold': return 'Hết vé';
            case 'expired': return 'Hết hạn';
            default: return 'Còn vé';
        }
    }

    function getStatusBadgeColor(status) {
        switch(status) {
            case 'available': return 'success';
            case 'limited': return 'danger'; // Đổi từ warning (vàng) sang danger (đỏ)
            case 'sold': return 'dark';      // Đổi từ danger sang dark (đen)
            case 'expired': return 'secondary';
            default: return 'success';
        }
    }

    function handleBooking() {
        if (!currentEventData) return;
        
        // Check if event is expired or sold out
        if (currentEventData.status === 'expired') {
            return;
        }
        
        if (currentEventData.status === 'sold') {
            return;
        }
        
        // Save the complete event data for booking page
        localStorage.setItem('currentBookingEvent', JSON.stringify(currentEventData));
        
        // Show loading state
        const btnBook = document.getElementById('btnBook');
        const originalText = btnBook.textContent;
        btnBook.textContent = '🔄 Đang chuyển...';
        btnBook.disabled = true;
        
        // Determine booking page based on event category
        let bookingPage;
        if (currentEventData.category === 'live-music') {
            bookingPage = `booking.html?eventId=${currentEventData.id}`;
        } else {
            // Default to seat-booking for concerts
            bookingPage = `seat-booking.html?eventId=${currentEventData.id}`;
        }
        
        // Redirect to appropriate booking page
        setTimeout(() => {
            window.location.href = bookingPage;
        }, 1000);
    }
});
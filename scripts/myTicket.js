/* =======================
   DATA & INITIALIZATION
======================= */
let tickets = [];

// Load tickets from localStorage and sessionStorage
function loadTicketsFromStorage() {
    try {
        const userBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const completedBookings = JSON.parse(localStorage.getItem('completedBookings') || '[]');
        
        // Check for newly completed ticket in sessionStorage
        const completedTicket = sessionStorage.getItem('completedTicket');
        let newlyCompleted = null;
        if (completedTicket) {
            try {
                newlyCompleted = JSON.parse(completedTicket);
                // Clear from sessionStorage after reading
                sessionStorage.removeItem('completedTicket');
            } catch (e) {
                console.error('Error parsing completed ticket:', e);
            }
        }
        
        // Combine and transform bookings to ticket format
        const allBookings = [...userBookings, ...completedBookings];
        
        // Add newly completed ticket if exists and not already in bookings
        if (newlyCompleted && !allBookings.find(b => b.id === newlyCompleted.id)) {
            allBookings.push(newlyCompleted);
            // Also add to completedBookings in localStorage
            completedBookings.push(newlyCompleted);
            localStorage.setItem('completedBookings', JSON.stringify(completedBookings));
        }
        
        tickets = allBookings.map(booking => {
            const timeStatus = isUpcoming(booking.eventDate || booking.date) ? 'upcoming' : 'past';
            
            return {
                id: booking.id || `ECHOES${Date.now()}`,
                name: booking.eventName || booking.title || 'Echoes Event',
                time: `${booking.eventTime || '20:00'} · ${booking.eventDate || booking.date}`,
                location: booking.venue || booking.location || 'Venue TBA',
                price: booking.totalAmount || booking.totalPaid || booking.price || 0,
                status: booking.status === 'completed' ? 'success' : 
                       booking.status === 'cancelled' ? 'cancelled' : 
                       booking.status === 'gift' ? 'success' : 'success',
                timeStatus: timeStatus,
                ticketType: booking.ticketType || 'Standard',
                seatSection: booking.seatSection || null,
                quantity: booking.quantity || 1,
                isGift: booking.isGift || false,
                bookingType: booking.seatSection ? 'seat-booking' : 'regular',
                paymentTime: booking.paymentTime || null,
                bookingTime: booking.timestamp ? new Date(booking.timestamp).toLocaleString('vi-VN') : null,
                originalDate: booking.eventDate || booking.date // Keep original for debugging
            };
        });
        
        // Sort tickets by booking time (newest first)
        tickets.sort((a, b) => {
            const timeA = a.paymentTime || a.bookingTime || '0';
            const timeB = b.paymentTime || b.bookingTime || '0';
            return new Date(timeB) - new Date(timeA);
        });
        
        // Don't add demo tickets - only show real bookings
        console.log(`Loaded ${tickets.length} real tickets from storage`);
        
    } catch (error) {
        console.error('Error loading tickets:', error);
        tickets = [];
    }
}

// Check if date is upcoming
function isUpcoming(dateString) {
    if (!dateString) return false;
    
    try {
        let eventDate;
        
        // Handle different date formats
        if (dateString.includes('tháng')) {
            // Format: "12:00 - 23:00, 27 tháng 12, 2025"
            const match = dateString.match(/(\d+)\s+tháng\s+(\d+),\s+(\d+)/);
            if (match) {
                const [, day, month, year] = match;
                eventDate = new Date(year, month - 1, day);
            }
        } else if (dateString.includes(' - ')) {
            // Format: "22/12/2025 - 20:00" or "11/1/2025 - 19:30"
            const datePart = dateString.split(' - ')[0];
            const [day, month, year] = datePart.split('/');
            eventDate = new Date(year, month - 1, day);
        } else if (dateString.includes('/')) {
            // Format: "22/12/2025"
            const [day, month, year] = dateString.split('/');
            eventDate = new Date(year, month - 1, day);
        } else {
            return false;
        }
        
        if (!eventDate || isNaN(eventDate.getTime())) {
            return false;
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        
        return eventDate >= today;
    } catch (error) {
        console.error('Error parsing date:', dateString, error);
        return false;
    }
}

/* =======================
   STATE
======================= */
let currentStatus = "all";      // all | success | cancelled
let currentTime = "upcoming";  // upcoming | past

/* =======================
   ELEMENTS
======================= */
const content = document.getElementById("ticket-content");
const filters = document.querySelectorAll(".filter");
const subs = document.querySelectorAll(".sub");

/* =======================
   RENDER
======================= */
function renderTickets() {
  content.innerHTML = "";

  const filtered = tickets.filter(ticket => {
    const statusMatch =
      currentStatus === "all" || ticket.status === currentStatus;

    const timeMatch =
      ticket.timeStatus === currentTime;

    return statusMatch && timeMatch;
  });

  if (filtered.length === 0) {
    renderEmpty();
    return;
  }

  filtered.forEach(ticket => {
    // 👉 TẠO LINK
    const link = document.createElement("a");
    link.href = `ticketDetail.html?id=${ticket.id}`;
    link.className = "ticket-link";

    // 👉 CARD BÊN TRONG LINK với thông tin seat booking
    const seatInfo = ticket.seatSection ? 
      `<div class="ticket-meta">🎫 ${ticket.ticketType} (${ticket.seatSection})</div>` :
      `<div class="ticket-meta">🎫 ${ticket.ticketType}</div>`;
    
    const quantityInfo = ticket.quantity > 1 ? 
      `<div class="ticket-meta">👥 ${ticket.quantity} vé</div>` : '';
    
    const giftBadge = ticket.isGift ? 
      `<div class="gift-badge">🎁 Vé tặng</div>` : '';
    
    const bookingTimeInfo = ticket.paymentTime ? 
      `<div class="ticket-meta">💳 Thanh toán: ${ticket.paymentTime}</div>` :
      ticket.bookingTime ? 
      `<div class="ticket-meta">📅 Đặt vé: ${ticket.bookingTime}</div>` : '';

    link.innerHTML = `
      <div class="ticket-card ${ticket.bookingType}">
        <div class="ticket-header">
          <h3>${ticket.name}</h3>
          ${giftBadge}
        </div>
        <div class="ticket-meta">📍 ${ticket.location}</div>
        <div class="ticket-meta">🕒 ${ticket.time}</div>
        ${seatInfo}
        ${quantityInfo}
        ${bookingTimeInfo}
        <div class="ticket-price">${ticket.price.toLocaleString()}đ</div>
      </div>
    `;

    content.appendChild(link);
  });
}

/* =======================
   EMPTY STATE
======================= */
function renderEmpty() {
  const emptyMessage = currentTime === "upcoming" ? 
    "Bạn chưa có vé sắp diễn ra nào" : 
    "Bạn chưa có vé đã kết thúc nào";
    
  content.innerHTML = `
    <div class="empty-state">
      <div class="empty-svg">
        <svg viewBox="0 0 200 200" width="200">
          <circle cx="100" cy="100" r="95" fill="#e5c9a8"/>
          <circle cx="130" cy="70" r="22" fill="#facc15"/>
          <path d="M0 120 Q100 80 200 120 V200 H0Z" fill="#c2410c"/>
          <circle cx="100" cy="110" r="20" fill="#1f3a2a"/>
        </svg>
      </div>
      <p class="empty-text">${emptyMessage}</p>
      <a href="concert.html" class="buy-btn">Khám phá sự kiện</a>
    </div>
  `;
}

/* =======================
   FILTER: STATUS
======================= */
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.active")?.classList.remove("active");
    btn.classList.add("active");

    currentStatus = btn.dataset.status;
    renderTickets();
  });
});

/* =======================
   FILTER: TIME
======================= */
subs.forEach(sub => {
  sub.addEventListener("click", () => {
    document.querySelector(".sub.active")?.classList.remove("active");
    sub.classList.add("active");

    currentTime = sub.innerText.includes("kết thúc")
      ? "past"
      : "upcoming";

    renderTickets();
  });
});

/* =======================
   INIT
======================= */
document.addEventListener('DOMContentLoaded', function() {
    loadTicketsFromStorage();
    renderTickets();
    
    // Check if there's a newly completed ticket and show notification
    showNewTicketNotification();
    
    // Listen for storage changes (when new bookings are added)
    window.addEventListener('storage', function(e) {
        if (e.key === 'userBookings' || e.key === 'completedBookings') {
            loadTicketsFromStorage();
            renderTickets();
        }
    });
});

/* =======================
   NEW TICKET NOTIFICATION
======================= */
function showNewTicketNotification() {
    // Check if we just came from payment
    const urlParams = new URLSearchParams(window.location.search);
    const fromPayment = urlParams.get('from') === 'payment';
    
    if (fromPayment && tickets.length > 0) {
        // Show success notification for the newest ticket
        const newestTicket = tickets[0];
        showTicketSuccessMessage(newestTicket);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Debug: Show date parsing info (remove in production)
    if (tickets.length > 0) {
        console.log(`Loaded ${tickets.length} tickets`);
    }
}

function showTicketSuccessMessage(ticket) {
    // Create and show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success ticket-success-alert';
    successDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-check-circle me-3" style="font-size: 2rem; color: #28a745;"></i>
            <div>
                <h5 class="mb-1">🎉 Đặt vé thành công!</h5>
                <p class="mb-0">Vé <strong>${ticket.name}</strong> đã được thêm vào danh sách của bạn</p>
            </div>
        </div>
    `;
    
    // Insert at top of page
    const wrapper = document.querySelector('.my-ticket-wrapper');
    wrapper.insertBefore(successDiv, wrapper.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

/* =======================
   REFRESH FUNCTION (can be called from other pages)
======================= */
window.refreshMyTickets = function() {
    loadTicketsFromStorage();
    renderTickets();
};

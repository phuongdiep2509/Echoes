/* =======================
   DATA & INITIALIZATION
======================= */
let tickets = [];

// Load tickets from localStorage
function loadTicketsFromStorage() {
    try {
        const userBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const completedBookings = JSON.parse(localStorage.getItem('completedBookings') || '[]');
        
        // Combine and transform bookings to ticket format
        const allBookings = [...userBookings, ...completedBookings];
        
        tickets = allBookings.map(booking => ({
            id: booking.id || `ECHOES${Date.now()}`,
            name: booking.eventName || booking.title || 'Echoes Event',
            time: `${booking.eventTime || '20:00'} · ${booking.eventDate || booking.date}`,
            location: booking.venue || booking.location || 'Venue TBA',
            price: booking.totalAmount || booking.price || 0,
            status: booking.status === 'completed' ? 'success' : 
                   booking.status === 'cancelled' ? 'cancelled' : 
                   booking.status === 'gift' ? 'success' : 'success',
            timeStatus: isUpcoming(booking.eventDate || booking.date) ? 'upcoming' : 'past',
            ticketType: booking.ticketType || 'Standard',
            seatSection: booking.seatSection || null,
            quantity: booking.quantity || 1,
            isGift: booking.isGift || false,
            bookingType: booking.seatSection ? 'seat-booking' : 'regular'
        }));
        
        // Add some demo tickets if no bookings exist
        if (tickets.length === 0) {
            tickets = [
                {
                    id: "ECHOES001",
                    name: "Echoes Live Concert",
                    time: "20:00 · 20/12/2025",
                    location: "Nhà hát Lớn Hà Nội",
                    price: 499000,
                    status: "success",
                    timeStatus: "upcoming",
                    ticketType: "VIP",
                    quantity: 1,
                    bookingType: "regular"
                }
            ];
        }
    } catch (error) {
        console.error('Error loading tickets:', error);
        tickets = [];
    }
}

// Check if date is upcoming
function isUpcoming(dateString) {
    if (!dateString) return false;
    
    try {
        // Parse date string (assuming format DD/MM/YYYY)
        const [day, month, year] = dateString.split('/');
        const eventDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return eventDate >= today;
    } catch (error) {
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
      <p class="empty-text">Bạn chưa có vé nào</p>
      <a href="index.html" class="buy-btn">Mua vé ngay</a>
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
    
    // Listen for storage changes (when new bookings are added)
    window.addEventListener('storage', function(e) {
        if (e.key === 'userBookings' || e.key === 'completedBookings') {
            loadTicketsFromStorage();
            renderTickets();
        }
    });
});

/* =======================
   REFRESH FUNCTION (can be called from other pages)
======================= */
window.refreshMyTickets = function() {
    loadTicketsFromStorage();
    renderTickets();
};

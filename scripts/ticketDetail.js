<<<<<<< HEAD
// ==========================
// MOCK DATA – giống myTicket
// (sau này bạn thay bằng localStorage / database)
// ==========================
const tickets = [
  {
    id: "ECHOES001",
    name: "Echoes Live Concert",
    location: "Nhà hát Lớn Hà Nội",
    time: "20:00 · 20/12/2025",
    seat: "Khu A – Hàng 3 – Ghế 12",
    receiverName: "Nguyễn Văn A",
    receiverEmail: "nguyenvana@gmail.com",
    price: 499000
  },
  {
    id: "ECHOES002",
    name: "Echoes Acoustic Night",
    location: "Indie Space Hà Nội",
    time: "19:30 · 05/01/2026",
    seat: "Standing",
    receiverName: "Nguyễn Văn A",
    receiverEmail: "nguyenvana@gmail.com",
    price: 299000
  }
];

// ==========================
// GET ID FROM URL
// ==========================
const params = new URLSearchParams(window.location.search);
const ticketId = params.get("id");

const ticket = tickets.find(t => t.id === ticketId);

if (!ticket) {
  alert("Không tìm thấy vé");
  throw new Error("Ticket not found");
}

// ==========================
// FILL DATA
// ==========================
document.getElementById("ticketName").innerText = ticket.name;
document.getElementById("ticketLocation").innerText = ticket.location;
document.getElementById("ticketTime").innerText = ticket.time;
document.getElementById("ticketSeat").innerText = ticket.seat;
document.getElementById("receiverName").innerText = ticket.receiverName;
document.getElementById("receiverEmail").innerText = ticket.receiverEmail;
document.getElementById("ticketPrice").innerText = ticket.price.toLocaleString() + "đ";
document.getElementById("ticketTotal").innerText = ticket.price.toLocaleString() + "đ";

// ✅ Vé online URL (ổn định)
const ticketUrl = `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(ticket.id)}`;

// ==========================
// CREATE QR CODE (KHÔNG RANDOM)
// ==========================
new QRCode(document.getElementById("qrDetail"), {
  text: ticketUrl,     // hoặc `ticket.id` nếu bạn muốn QR chỉ là mã
  width: 200,
  height: 200
});

// ==========================
// SEND EMAIL (GitHub Pages -> gọi API serverless)
// ==========================

const SEND_API_URL = "https://echoes-mail.vercel.app/api/send-ticket";
const API_KEY = "echoes999"; // phải trùng với API_KEY trên Vercel

const btnSend = document.getElementById("btnSendTicketEmail");
const sendStatus = document.getElementById("sendMailStatus");

if (btnSend) {
  btnSend.addEventListener("click", async () => {
    try {
      btnSend.disabled = true;
      sendStatus.textContent = "Đang gửi email…";

      // Link vé online (bạn đang mở trang ticketDetail với id=...)
      const ticketUrl = `${location.origin}${location.pathname}?id=${encodeURIComponent(ticket.id)}`;

      const payload = {
        buyerEmail: ticket.receiverEmail,
        ticket: {
          id: ticket.id,
          name: ticket.name,
          location: ticket.location,
          time: ticket.time,
          seat: ticket.seat,
          receiverName: ticket.receiverName,
          receiverEmail: ticket.receiverEmail,
          price: ticket.price,
          ticketUrl
        }
      };

      const res = await fetch(SEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.message || `HTTP ${res.status}`);
      }

      sendStatus.textContent = "✅ Đã gửi vé về Gmail!";
    } catch (err) {
      console.error(err);
      sendStatus.textContent = "❌ Gửi thất bại. Mở F12 để xem lỗi.";
    } finally {
      btnSend.disabled = false;
    }
  });
}
=======
// ===== TICKET DETAIL - SIMPLIFIED VERSION =====

function loadTicketData() {
    try {
        const userBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const completedBookings = JSON.parse(localStorage.getItem('completedBookings') || '[]');
        
        // Handle newly completed ticket
        const completedTicket = sessionStorage.getItem('completedTicket');
        let newlyCompleted = null;
        if (completedTicket) {
            try {
                newlyCompleted = JSON.parse(completedTicket);
            } catch (e) {
                console.error('Error parsing completed ticket:', e);
            }
        }
        
        // Combine all bookings
        const allBookings = [...userBookings, ...completedBookings];
        
        if (newlyCompleted && !allBookings.find(b => b.id === newlyCompleted.id)) {
            allBookings.push(newlyCompleted);
        }
        
        return allBookings;
    } catch (error) {
        console.error('Error loading ticket data:', error);
        return [];
    }
}

function getTicketById(ticketId) {
    const allTickets = loadTicketData();
    return allTickets.find(t => t.id === ticketId);
}

function getUserInfo() {
    const currentUser = window.authManager ? window.authManager.getCurrentUser() : null;
    return {
        name: currentUser && currentUser.isLoggedIn ? currentUser.username : 'Khách hàng',
        email: currentUser && currentUser.isLoggedIn ? currentUser.email || 'N/A' : 'N/A'
    };
}

function fillTicketInfo(ticket) {
    // Basic event info
    document.getElementById("ticketName").innerText = ticket.eventName || ticket.title || 'Echoes Event';
    document.getElementById("ticketLocation").innerText = ticket.venue || ticket.location || 'Venue TBA';
    document.getElementById("ticketTime").innerText = `${ticket.eventTime || '20:00'} · ${ticket.eventDate || ticket.date}`;
    
    // Ticket info
    const seatInfo = ticket.seatSection ? 
        `${ticket.ticketType} (${ticket.seatSection})` : 
        ticket.ticketType || 'Standard';
    document.getElementById("ticketSeat").innerText = seatInfo;
    
    // User info
    const userInfo = getUserInfo();
    document.getElementById("receiverName").innerText = userInfo.name;
    document.getElementById("receiverEmail").innerText = userInfo.email;
    
    // Price info
    const totalPrice = ticket.totalAmount || ticket.totalPaid || ticket.price || 0;
    document.getElementById("ticketPrice").innerText = totalPrice.toLocaleString() + "đ";
    document.getElementById("ticketTotal").innerText = totalPrice.toLocaleString() + "đ";
    
    // Quantity
    const quantityElement = document.getElementById("ticketQuantity");
    if (quantityElement) {
        quantityElement.innerText = ticket.quantity || 1;
    }
    
    // Booking time
    const bookingTimeElement = document.getElementById("bookingTime");
    if (bookingTimeElement) {
        const bookingTime = ticket.paymentTime || 
                           (ticket.timestamp ? new Date(ticket.timestamp).toLocaleString('vi-VN') : 'N/A');
        bookingTimeElement.innerText = bookingTime;
    }
    
    // Gift status
    const giftStatusElement = document.getElementById("giftStatus");
    if (giftStatusElement) {
        giftStatusElement.innerText = ticket.isGift ? 'Có (Vé tặng)' : 'Không';
    }
    
    // Status
    const statusElement = document.getElementById("ticketStatus");
    if (statusElement) {
        const status = ticket.status === 'completed' ? 'Đã thanh toán' :
                      ticket.status === 'gift' ? 'Vé tặng' :
                      ticket.status === 'pending' ? 'Chờ thanh toán' : 'Đã xác nhận';
        statusElement.innerText = status;
    }
}

function createQRCode(ticket) {
    const qrContainer = document.getElementById("qrDetail");
    if (qrContainer && typeof QRCode !== 'undefined') {
        new QRCode(qrContainer, {
            text: `ECHOES-${ticket.id}-${Math.random().toString(36).slice(2, 10)}`,
            width: 200,
            height: 200
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const ticketId = params.get("id");

    if (!ticketId) {
        alert("Không tìm thấy ID vé");
        window.location.href = 'myTicket.html';
        return;
    }

    const ticket = getTicketById(ticketId);

    if (!ticket) {
        alert("Không tìm thấy vé");
        window.location.href = 'myTicket.html';
        return;
    }

    fillTicketInfo(ticket);
    createQRCode(ticket);
});
>>>>>>> d84cd185cf3d64fafb3863df7d9a3ca4a42e273d

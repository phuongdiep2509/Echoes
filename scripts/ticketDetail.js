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

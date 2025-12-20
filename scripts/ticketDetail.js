// ==========================
// MOCK DATA – giống myTicket
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
    time: "19:30 · 05/01/2024",
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
document.getElementById("ticketPrice").innerText =
  ticket.price.toLocaleString() + "đ";
document.getElementById("ticketTotal").innerText =
  ticket.price.toLocaleString() + "đ";

// ==========================
// CREATE QR CODE
// ==========================
new QRCode(document.getElementById("qrDetail"), {
  text: `ECHOES-${ticket.id}-${Math.random().toString(36).slice(2, 10)}`,
  width: 200,
  height: 200
});

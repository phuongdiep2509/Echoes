/* =========================================================
   ticketDetail.js (FULL) — localStorage ECHOES_TICKETS
   - Load ticket by id from URL
   - Render info + QR
   - Send email via Vercel API
========================================================= */

// ==========================
// CONFIG
// ==========================
const STORAGE_KEY = "ECHOES_TICKETS";

const SEND_API_URL = "https://echoes-mail.vercel.app/api/send-ticket";
const API_KEY = "echoes999"; // phải trùng với API_KEY trên Vercel

// ==========================
// HELPERS
// ==========================
function safeText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value ?? "";
}

function safeMoney(value) {
  const n = Number(value || 0);
  return n.toLocaleString("vi-VN") + "đ";
}

function getTicketsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Parse localStorage error:", e);
    return [];
  }
}

function getTicketById(id) {
  const tickets = getTicketsFromStorage();
  return tickets.find(t => String(t.id) === String(id));
}

function buildTicketUrl(ticketId) {
  return `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(ticketId)}`;
}

function getSeatText(ticket) {
  // ưu tiên seat nếu có sẵn
  if (ticket.seat) return ticket.seat;

  // nếu có seatSection + ticketType thì ghép
  if (ticket.seatSection) {
    const type = ticket.ticketType || "Standard";
    return `${type} (${ticket.seatSection})`;
  }

  // fallback
  return "Standing";
}

// ==========================
// MAIN
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  // GET ID FROM URL
  const params = new URLSearchParams(window.location.search);
  const ticketId = params.get("id");

  if (!ticketId) {
    alert("Thiếu mã vé (id) trên URL");
    return;
  }

  // LOAD TICKET
  const ticket = getTicketById(ticketId);

  if (!ticket) {
    alert("Không tìm thấy vé (localStorage chưa có ECHOES_TICKETS hoặc id sai).");
    console.warn("Ticket not found. STORAGE:", getTicketsFromStorage());
    return;
  }

  // FILL DATA
  safeText("ticketName", ticket.name || "Echoes Event");
  safeText("ticketLocation", ticket.location || "Venue TBA");
  safeText("ticketTime", ticket.time || "");
  safeText("ticketSeat", getSeatText(ticket));

  safeText("receiverName", ticket.receiverName || "Khách hàng");
  safeText("receiverEmail", ticket.receiverEmail || "");

  safeText("ticketPrice", safeMoney(ticket.price));
  safeText("ticketTotal", safeMoney(ticket.price));

  // CREATE QR CODE (stable)
  const ticketUrl = buildTicketUrl(ticket.id);
  const qrWrap = document.getElementById("qrDetail");
  if (qrWrap) {
    qrWrap.innerHTML = ""; // clear old
    new QRCode(qrWrap, {
      text: ticketUrl,
      width: 200,
      height: 200
    });
  }

  // SEND EMAIL
  const btnSend = document.getElementById("btnSendTicketEmail");
  const sendStatus = document.getElementById("sendMailStatus");

  if (!btnSend) return;

  btnSend.addEventListener("click", async () => {
    try {
      btnSend.disabled = true;
      if (sendStatus) sendStatus.textContent = "Đang gửi email…";

      if (!ticket.receiverEmail) {
        throw new Error("Vé này chưa có email người nhận (receiverEmail).");
      }

      const payload = {
        buyerEmail: ticket.receiverEmail,
        ticket: {
          id: ticket.id,
          name: ticket.name,
          location: ticket.location,
          time: ticket.time,
          seat: getSeatText(ticket),
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

      if (sendStatus) sendStatus.textContent = "✅ Đã gửi vé về Gmail!";
    } catch (err) {
      console.error(err);
      if (sendStatus) sendStatus.textContent = `❌ Gửi thất bại: ${err.message}`;
    } finally {
      btnSend.disabled = false;
    }
  });
});

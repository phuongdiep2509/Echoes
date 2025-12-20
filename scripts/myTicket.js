/* =======================
   DATA
======================= */
const tickets = [
  {
    id: "ECHOES001",
    name: "Echoes Live Concert",
    time: "20:00 · 20/12/2025",
    location: "Nhà hát Lớn Hà Nội",
    price: 499000,
    status: "success",
    timeStatus: "upcoming"
  },
  {
    id: "ECHOES002",
    name: "Echoes Acoustic Night",
    time: "19:30 · 05/01/2024",
    location: "Indie Space Hà Nội",
    price: 299000,
    status: "success",
    timeStatus: "past"
  },
  {
    id: "ECHOES003",
    name: "Echoes Cancel Show",
    time: "18:00 · 01/11/2024",
    location: "Hà Nội",
    price: 199000,
    status: "cancelled",
    timeStatus: "past"
  }
];

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

    // 👉 CARD BÊN TRONG LINK
    link.innerHTML = `
      <div class="ticket-card">
        <h3>${ticket.name}</h3>
        <div class="ticket-meta">📍 ${ticket.location}</div>
        <div class="ticket-meta">🕒 ${ticket.time}</div>
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
renderTickets();

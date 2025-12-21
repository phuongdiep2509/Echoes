// scripts/ticketStorage.js
const TICKET_KEY = "ECHOES_TICKETS";

export function getTickets() {
  try {
    return JSON.parse(localStorage.getItem(TICKET_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveTickets(tickets) {
  localStorage.setItem(TICKET_KEY, JSON.stringify(tickets));
}

export function addTicket(newTicket) {
  const tickets = getTickets();

  // tránh trùng id
  const idx = tickets.findIndex(t => t.id === newTicket.id);
  if (idx >= 0) tickets[idx] = newTicket;
  else tickets.unshift(newTicket);

  saveTickets(tickets);
  return newTicket;
}

export function getTicketById(id) {
  return getTickets().find(t => t.id === id);
}

export function removeTicket(id) {
  const tickets = getTickets().filter(t => t.id !== id);
  saveTickets(tickets);
}

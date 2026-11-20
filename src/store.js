const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "tickets.json");

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
  }
}

function readTickets() {
  ensureStore();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeTickets(tickets) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(tickets, null, 2), "utf8");
}

function nextId(tickets) {
  if (tickets.length === 0) return 1;
  return Math.max(...tickets.map((t) => t.id)) + 1;
}

function listTickets() {
  return readTickets().sort((a, b) => b.id - a.id);
}

function createTicket({ subject, description, priority = "medium" }) {
  const tickets = readTickets();
  const ticket = {
    id: nextId(tickets),
    subject: String(subject).trim(),
    description: String(description).trim(),
    priority,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  tickets.push(ticket);
  writeTickets(tickets);
  return ticket;
}

module.exports = {
  listTickets,
  createTicket,
  DATA_FILE,
};
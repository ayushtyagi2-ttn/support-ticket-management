const express = require("express");
const path = require("path");
const { listTickets, createTicket } = require("./store");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "support-ticket-management" });
});

app.get("/api/tickets", (_req, res) => {
  res.json(listTickets());
});

app.post("/api/tickets", (req, res) => {
  const { subject, description, priority } = req.body || {};
  if (!subject || !description) {
    res.status(400).json({ error: "subject and description are required" });
    return;
  }
  const allowed = new Set(["low", "medium", "high"]);
  const p = allowed.has(priority) ? priority : "medium";
  const ticket = createTicket({ subject, description, priority: p });
  res.status(201).json(ticket);
});

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`Support ticket server listening on http://${HOST}:${PORT}`);
  });
}

module.exports = app;
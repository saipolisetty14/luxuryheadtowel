const express = require("express");
const fs = require("fs");
const path = require("path");
const requireAuth = require("../middleware/auth");
const router = express.Router();

const SETTINGS_FILE = path.join(__dirname, "../data/settings.json");

function read() {
  if (!fs.existsSync(SETTINGS_FILE)) return {};
  return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
}

function write(data) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
}

// GET /api/settings  — returns settings with password masked
router.get("/", requireAuth, (req, res) => {
  const s = read();
  const safe = JSON.parse(JSON.stringify(s));
  if (safe.smtp?.pass) safe.smtp.pass = "••••••••";
  res.json(safe);
});

// PUT /api/settings
router.put("/", requireAuth, (req, res) => {
  const current = read();
  const incoming = req.body;
  // Preserve real password if front-end sent the masked sentinel
  if (incoming.smtp?.pass === "••••••••") {
    incoming.smtp.pass = current.smtp?.pass || "";
  }
  const updated = { ...current, ...incoming };
  if (incoming.smtp) updated.smtp = { ...(current.smtp || {}), ...incoming.smtp };
  write(updated);
  res.json({ success: true });
});

module.exports = router;

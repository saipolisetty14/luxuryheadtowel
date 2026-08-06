const express = require("express");
const fs = require("fs");
const path = require("path");
const requireAuth = require("../middleware/auth");
const router = express.Router();

const CONTENT_FILE = path.join(__dirname, "../data/content.json");
const DEFAULT_FILE = path.join(__dirname, "../data/default-content.json");

function readContent() {
  if (!fs.existsSync(CONTENT_FILE)) {
    if (fs.existsSync(DEFAULT_FILE)) {
      const d = JSON.parse(fs.readFileSync(DEFAULT_FILE, "utf8"));
      fs.writeFileSync(CONTENT_FILE, JSON.stringify(d, null, 2));
      return d;
    }
    return {};
  }
  return JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8"));
}

function writeContent(data) {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2));
}

// GET /api/content  — public, used by frontend
router.get("/", (req, res) => {
  res.json(readContent());
});

// GET /api/content/:section  — public
router.get("/:section", (req, res) => {
  const all = readContent();
  const section = all[req.params.section];
  if (section === undefined) return res.status(404).json({ error: "Section not found" });
  res.json(section);
});

// PUT /api/content/:section  — replace entire section (admin)
router.put("/:section", requireAuth, (req, res) => {
  const all = readContent();
  all[req.params.section] = req.body;
  writeContent(all);
  res.json({ success: true, data: all[req.params.section] });
});

// PATCH /api/content/:section  — merge into section (admin)
router.patch("/:section", requireAuth, (req, res) => {
  const all = readContent();
  all[req.params.section] = { ...(all[req.params.section] || {}), ...req.body };
  writeContent(all);
  res.json({ success: true, data: all[req.params.section] });
});

// PUT /api/content  — replace entire content file (admin)
router.put("/", requireAuth, (req, res) => {
  writeContent(req.body);
  res.json({ success: true });
});

module.exports = router;

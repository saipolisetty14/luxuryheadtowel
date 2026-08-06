const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const requireAuth = require("../middleware/auth");
const router = express.Router();

// Hash is generated once on startup from the env password
const adminUsername = process.env.ADMIN_USERNAME || "admin";
const adminPasswordHash = bcrypt.hashSync(
  process.env.ADMIN_PASSWORD || "changeme123",
  10
);

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (
    !username ||
    !password ||
    username !== adminUsername ||
    !bcrypt.compareSync(password, adminPasswordHash)
  ) {
    return res.status(401).json({ error: "Invalid username or password." });
  }
  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET || "dev-secret-change-me",
    { expiresIn: "24h" }
  );
  res.json({ token, username });
});

// GET /api/auth/verify  — used by admin panel on load
router.get("/verify", requireAuth, (req, res) => {
  res.json({ valid: true, username: req.user.username });
});

module.exports = router;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure required directories exist
["uploads", "data"].forEach((dir) => {
  const p = path.join(__dirname, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// Seed content.json from default if missing
const contentFile = path.join(__dirname, "data/content.json");
if (!fs.existsSync(contentFile)) {
  const defaultContent = path.join(__dirname, "data/default-content.json");
  if (fs.existsSync(defaultContent)) {
    fs.copyFileSync(defaultContent, contentFile);
    console.log("✅ Seeded content.json from default-content.json");
  }
}

// ── Security middleware ───────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdn.tailwindcss.com", "cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdn.tailwindcss.com"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "*"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: "Too many submissions. Please try again later." },
});

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowed = [
  process.env.FRONTEND_URL,
  process.env.BACKEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3001",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowed.includes(origin)) return cb(null, true);
      cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

// ── Static files ──────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/admin", express.static(path.join(__dirname, "admin")));

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/content", require("./routes/content"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/email/contact", contactLimiter, require("./routes/email"));

// ── Admin redirect ────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.redirect("/admin/index.html"));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`\n✅  Backend running  → http://localhost:${PORT}`);
  console.log(`🔧  Admin panel      → http://localhost:${PORT}/admin`);
  console.log(`📦  API base         → http://localhost:${PORT}/api\n`);
});

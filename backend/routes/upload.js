const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const requireAuth = require("../middleware/auth");
const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const ts = Date.now();
    const rand = Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const base = path.basename(file.originalname, ext)
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()
      .slice(0, 40);
    cb(null, `${base}-${ts}-${rand}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ALLOWED = /\.(jpg|jpeg|png|gif|webp|svg|avif|jfif)$/i;
  if (ALLOWED.test(file.originalname)) cb(null, true);
  else cb(new Error("Only image files are allowed (jpg, png, gif, webp, svg, avif)"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
});

// POST /api/upload  — upload one image
router.post("/", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  const url = `${backendUrl}/uploads/${req.file.filename}`;
  const relUrl = `/uploads/${req.file.filename}`;
  res.json({ url, relUrl, filename: req.file.filename, originalName: req.file.originalname });
});

// GET /api/upload  — list all uploaded images
router.get("/", requireAuth, (req, res) => {
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  const files = fs
    .readdirSync(UPLOADS_DIR)
    .filter((f) => /\.(jpg|jpeg|png|gif|webp|svg|avif|jfif)$/i.test(f))
    .map((filename) => {
      const stat = fs.statSync(path.join(UPLOADS_DIR, filename));
      return {
        filename,
        url: `${backendUrl}/uploads/${filename}`,
        relUrl: `/uploads/${filename}`,
        size: stat.size,
        created: stat.birthtime,
      };
    })
    .sort((a, b) => new Date(b.created) - new Date(a.created));
  res.json(files);
});

// DELETE /api/upload/:filename
router.delete("/:filename", requireAuth, (req, res) => {
  // Sanitise: no path traversal
  const filename = path.basename(req.params.filename);
  const filePath = path.join(UPLOADS_DIR, filename);
  if (!filePath.startsWith(UPLOADS_DIR + path.sep)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });
  fs.unlinkSync(filePath);
  res.json({ success: true });
});

module.exports = router;

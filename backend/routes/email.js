const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const requireAuth = require("../middleware/auth");
const router = express.Router();

const SUBMISSIONS_FILE = path.join(__dirname, "../data/submissions.json");
const SETTINGS_FILE = path.join(__dirname, "../data/settings.json");

function getSmtpConfig() {
  let cfg = {
    host: process.env.SMTP_HOST || "",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || "Luxury Head Towels <noreply@luxuryheadtowels.co.uk>",
    contactEmail: process.env.CONTACT_EMAIL || "sales@thecreativehealthcare.com",
  };
  if (fs.existsSync(SETTINGS_FILE)) {
    const s = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
    if (s.smtp) cfg = { ...cfg, ...s.smtp };
  }
  return cfg;
}

function createTransport(cfg) {
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: { user: cfg.user, pass: cfg.pass },
    tls: { rejectUnauthorized: process.env.NODE_ENV === "production" },
  });
}

function saveSubmission(data) {
  let list = [];
  if (fs.existsSync(SUBMISSIONS_FILE)) {
    list = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, "utf8"));
  }
  list.unshift({ ...data, id: Date.now(), receivedAt: new Date().toISOString() });
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(list.slice(0, 500), null, 2)); // keep last 500
}

// POST /api/email/contact  — public, rate-limited in server.js
router.post("/", async (req, res) => {
  const { fullName, email, phone, enquiryType, preferredColour, quantity, message, honeypot } = req.body || {};

  // Honeypot spam trap
  if (honeypot) return res.status(200).json({ success: true });

  // Validation
  const errors = {};
  if (!fullName?.trim()) errors.fullName = "Full name is required.";
  if (!email?.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email address.";
  if (!phone?.trim()) errors.phone = "Phone number is required.";
  if (!message?.trim()) errors.message = "Message is required.";
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const submission = {
    fullName: fullName.trim().replace(/[<>]/g, ""),
    email: email.trim(),
    phone: phone.trim(),
    enquiryType: enquiryType || "General",
    preferredColour: preferredColour || "No Preference",
    quantity: quantity || "",
    message: message.trim().replace(/[<>]/g, ""),
  };

  saveSubmission(submission);

  const cfg = getSmtpConfig();
  if (!cfg.host || !cfg.user) {
    console.warn("SMTP not configured — submission saved but email not sent.");
    return res.json({ success: true, warning: "Email notification not configured." });
  }

  try {
    const transport = createTransport(cfg);

    // Notification to admin
    await transport.sendMail({
      from: cfg.from,
      to: cfg.contactEmail,
      replyTo: email,
      subject: `New Enquiry [${enquiryType || "General"}] — ${fullName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f7f2;padding:24px;border-radius:6px">
          <div style="background:#1a2744;padding:20px 24px;border-radius:4px;margin-bottom:20px">
            <h1 style="color:#B8965A;font-size:20px;margin:0;font-family:Georgia,serif">New Enquiry — Luxury Head Towels</h1>
            <p style="color:#ffffff80;margin:4px 0 0;font-size:13px">luxuryheadtowels.co.uk</p>
          </div>
          <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:4px;overflow:hidden">
            ${[
              ["Name", submission.fullName],
              ["Email", `<a href="mailto:${submission.email}">${submission.email}</a>`],
              ["Phone", submission.phone],
              ["Enquiry Type", submission.enquiryType],
              ["Preferred Colour", submission.preferredColour],
              ["Quantity", submission.quantity || "—"],
            ]
              .map(
                ([label, value]) =>
                  `<tr><td style="padding:10px 14px;border-bottom:1px solid #eee;color:#555;font-size:13px;width:140px;white-space:nowrap">${label}</td><td style="padding:10px 14px;border-bottom:1px solid #eee;font-size:13px">${value}</td></tr>`
              )
              .join("")}
            <tr><td style="padding:10px 14px;color:#555;font-size:13px;vertical-align:top">Message</td><td style="padding:10px 14px;font-size:13px;line-height:1.6">${submission.message.replace(/\n/g, "<br>")}</td></tr>
          </table>
          <p style="margin-top:16px;font-size:12px;color:#999">Received: ${new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })}</p>
        </div>
      `,
    });

    // Auto-reply to customer
    await transport.sendMail({
      from: cfg.from,
      to: email,
      subject: "Thank you for your enquiry — Luxury Head Towels",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f7f2;padding:24px;border-radius:6px">
          <div style="background:#1a2744;padding:20px 24px;border-radius:4px;margin-bottom:20px">
            <h1 style="color:#B8965A;font-size:20px;margin:0;font-family:Georgia,serif">Thank you for your enquiry</h1>
          </div>
          <p style="font-size:15px;line-height:1.7">Dear ${submission.fullName},</p>
          <p style="font-size:15px;line-height:1.7">Thank you for reaching out to Luxury Head Towels. We have received your enquiry and one of our team members will respond within <strong>1–2 business days</strong>.</p>
          <p style="font-size:15px;line-height:1.7">If your matter is urgent, please don't hesitate to call us directly on <strong>0204 537 4441</strong>.</p>
          <p style="font-size:15px;line-height:1.7;margin-bottom:4px">Warm regards,</p>
          <p style="font-size:15px;line-height:1.7;color:#1a2744;font-weight:bold;margin-top:0">The Luxury Head Towels Team</p>
          <hr style="border:none;border-top:1px solid #ddd;margin:20px 0">
          <p style="font-size:12px;color:#999">Luxury Head Towels · 0204 537 4441 · sales@thecreativehealthcare.com</p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err.message);
    // Submission was already saved — don't lose it
    res.status(500).json({ error: "Message saved but email delivery failed. We will contact you shortly." });
  }
});

// GET /api/email/contact  — admin: list submissions
router.get("/", requireAuth, (req, res) => {
  if (!fs.existsSync(SUBMISSIONS_FILE)) return res.json([]);
  res.json(JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, "utf8")));
});

// POST /api/email/contact/test  — admin: test SMTP
router.post("/test", requireAuth, async (req, res) => {
  const cfg = getSmtpConfig();
  if (!cfg.host || !cfg.user) {
    return res.status(400).json({ error: "SMTP not configured. Save settings first." });
  }
  try {
    const transport = createTransport(cfg);
    await transport.verify();
    res.json({ success: true, message: `SMTP connection verified (${cfg.host}:${cfg.port})` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

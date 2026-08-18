const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cookieParser());

// ✅ CSP header middleware
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' https:; img-src 'self' https: data:; media-src 'self' https:; connect-src 'self' https:"
  );
  next();
});

const isDev = process.env.NODE_ENV !== "production";

if (isDev) {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

// Routes — MUST be registered before the production SPA catch-all
const authRoutes = require("./routes/auth.routes");
const songRoutes = require("./routes/song.routes");

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);

// Production: serve static files and SPA fallback AFTER API routes
if (!isDev) {
  app.use(express.static(path.join(__dirname, "../public")));

  // Express 5 wildcard syntax for SPA fallback
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
}

// Multer / upload error handler (W5)
app.use((err, req, res, next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "File too large. Maximum size is 15MB." });
    }
    if (err.message && err.message.includes("multer")) {
        return res.status(400).json({ message: err.message });
    }
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ message: "Internal server error" });
});

// NOTE: Server is started in server.js — do NOT call app.listen() here.

module.exports = app;
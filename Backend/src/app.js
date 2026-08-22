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

const allowedOrigins = isDev
  ? ["http://localhost:5173"]
  : [process.env.FRONTEND_URL].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Routes — MUST be registered before the production SPA catch-all
const authRoutes = require("./routes/auth.routes");
const songRoutes = require("./routes/song.routes");

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve local song files from the root songs/ folder
const songsDir = path.join(__dirname, "../../songs");
app.use("/songs", express.static(songsDir));

// Serve generated poster artwork
const postersDir = path.join(__dirname, "../../posters");
app.use("/posters", express.static(postersDir));

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
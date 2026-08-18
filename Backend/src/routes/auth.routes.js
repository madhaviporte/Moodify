const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = Router();

// Simple in-memory rate limiter (no external dependencies)
const rateLimitStore = new Map();
function rateLimit({ windowMs = 15 * 60 * 1000, max = 20 } = {}) {
    return (req, res, next) => {
        const key = req.ip;
        const now = Date.now();
        const entry = rateLimitStore.get(key);

        if (!entry || now - entry.start > windowMs) {
            rateLimitStore.set(key, { start: now, count: 1 });
            return next();
        }

        entry.count++;
        if (entry.count > max) {
            return res.status(429).json({ message: "Too many requests. Please try again later." });
        }
        next();
    };
}

// Auth routes: rate limit login and register more aggressively
router.post('/register', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), authController.registerUser);
router.post('/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 15 }), authController.loginUser);
router.get("/get-me", authMiddleware.authUser, authController.getMe);
router.post("/logout", authMiddleware.authUser, authController.logoutUser);

module.exports = router;
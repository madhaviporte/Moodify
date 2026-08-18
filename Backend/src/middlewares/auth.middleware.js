const crypto = require("crypto");
const redis = require("../config/cache");
const jwt = require("jsonwebtoken");

function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

async function authUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Token not provided"
        });
    }

    // Check blacklist with Redis failure handling
    try {
        const tokenHash = hashToken(token);
        const isTokenBlacklisted = await redis.get("blacklist:" + tokenHash);

        if (isTokenBlacklisted) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }
    } catch (redisErr) {
        // If Redis is unavailable, log the error but do not block authentication.
        // The JWT itself is still verified below. This is a safe fallback because
        // a Redis outage should not lock out all authenticated users.
        console.error("Redis unavailable during auth check:", redisErr.message);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

module.exports = { authUser, hashToken };

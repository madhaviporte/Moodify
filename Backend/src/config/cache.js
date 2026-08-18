const Redis = require("ioredis").default

const redisOptions = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
    },
    lazyConnect: true
};

if (process.env.REDIS_TLS === "true") {
    redisOptions.tls = {};
}

const redis = new Redis(redisOptions);

redis.on("connect", () => {
    console.log("Server is connected to Redis");
});

redis.on("error", (err) => {
    console.error("Redis error:", err.message);
});

module.exports = redis;
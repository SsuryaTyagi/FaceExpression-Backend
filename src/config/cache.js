require("dotenv").config();
const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL, {
  tls: {},
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 3) return null;
    return Math.min(times * 200, 1000);
  }
});

redis.on("connect", () => console.log("✅ server is connected to redis"));
redis.on("error",   (err) => console.log("Redis error:", err.message));

module.exports = redis;
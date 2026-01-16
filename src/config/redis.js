const { createClient } = require("redis");

const createFallback = () => {
    const store = new Map();
    return {
        async get(key) {
            const v = store.get(key);
            if (!v) return null;
            if (v.expires && Date.now() > v.expires) {
                store.delete(key);
                return null;
            }
            return v.value;
        },
        async setEx(key, ttl, value) {
            store.set(key, { value, expires: Date.now() + ttl * 1000 });
        }
    };
};

const fallback = createFallback();
let redisClient = null;
try {
    const client = createClient({
        url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
        socket: { reconnectStrategy: () => false }
    });

    client.on("connect", () => console.log("Redis connected"));

    client.on("error", (err) => {
        console.error("Redis error:", err);
    });

    (async () => {
        try {
            await client.connect();
            redisClient = client;
        } catch (err) {
            try { client.removeAllListeners(); } catch (e) { }
            try { client.disconnect && await client.disconnect(); } catch (e) { }
            console.error("Failed to connect to Redis, using in-memory fallback:", err.message || err);
            redisClient = null;
        }
    })();
} catch (err) {
    console.error("Redis client initialization failed, using in-memory fallback:", err.message || err);
    redisClient = null;
}

const api = {
    async get(key) {
        if (redisClient && typeof redisClient.get === 'function') {
            try { return await redisClient.get(key); } catch (e) { console.error('Redis get error:', e); }
        }
        return await fallback.get(key);
    },
    async setEx(key, ttl, value) {
        if (redisClient && typeof redisClient.setEx === 'function') {
            try { return await redisClient.setEx(key, ttl, value); } catch (e) { console.error('Redis setEx error:', e); }
        }
        return await fallback.setEx(key, ttl, value);
    }
};

module.exports = api;

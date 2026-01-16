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

let redis;
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
            redis = client;
        } catch (err) {
            try { client.removeAllListeners(); } catch (e) { }
            try { client.disconnect && await client.disconnect(); } catch (e) { }
            console.error("Failed to connect to Redis, using in-memory fallback:", err.message || err);
            redis = createFallback();
        }
    })();
} catch (err) {
    console.error("Redis client initialization failed, using in-memory fallback:", err.message || err);
    redis = createFallback();
}

module.exports = redis;

/**
 * Rate Limiter Module
 * 
 * Sliding-window rate limiter that tracks requests per IP using an 
 * in-memory store. Designed to mitigate brute-force attacks, credential
 * stuffing, and Layer 7 DoS.
 * 
 * Configuration via environment variables:
 *   RATE_LIMIT_WINDOW_MS  — Window size in milliseconds (default: 60000 = 1 min)
 *   RATE_LIMIT_MAX        — Max requests per window (default: 100)
 */

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60_000;
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX) || 100;

// IP -> { timestamps: number[] }
const ipStore = new Map();

// Periodically clean up expired entries to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipStore) {
        data.timestamps = data.timestamps.filter(t => now - t < WINDOW_MS);
        if (data.timestamps.length === 0) {
            ipStore.delete(ip);
        }
    }
}, WINDOW_MS);

export function rateLimit(req) {
    const ip = req.ip;
    const now = Date.now();

    if (!ipStore.has(ip)) {
        ipStore.set(ip, { timestamps: [] });
    }

    const data = ipStore.get(ip);

    // Remove timestamps outside the sliding window
    data.timestamps = data.timestamps.filter(t => now - t < WINDOW_MS);

    // Record this request
    data.timestamps.push(now);

    const remaining = MAX_REQUESTS - data.timestamps.length;

    if (data.timestamps.length > MAX_REQUESTS) {
        return {
            limited: true,
            remaining: 0,
            retryAfter: Math.ceil((data.timestamps[0] + WINDOW_MS - now) / 1000),
            count: data.timestamps.length,
        };
    }

    return {
        limited: false,
        remaining,
        count: data.timestamps.length,
    };
}

/**
 * Dynamic IP Blacklisting Module
 * 
 * Automatically bans IPs that repeatedly trigger WAF blocks.
 * Uses an in-memory strike counter and blacklist with configurable
 * thresholds and TTL-based ban expiry.
 * 
 * Configuration via environment variables:
 *   BLACKLIST_MAX_STRIKES    — Blocks before auto-ban (default: 5)
 *   BLACKLIST_STRIKE_WINDOW  — Strike counting window in ms (default: 300000 = 5 min)
 *   BLACKLIST_BAN_DURATION   — Ban duration in ms (default: 1800000 = 30 min)
 */

const MAX_STRIKES = parseInt(process.env.BLACKLIST_MAX_STRIKES) || 5;
const STRIKE_WINDOW = parseInt(process.env.BLACKLIST_STRIKE_WINDOW) || 300_000;
const BAN_DURATION = parseInt(process.env.BLACKLIST_BAN_DURATION) || 1_800_000;

// IP -> { bannedAt: number, expiresAt: number }
const blacklist = new Map();

// IP -> { timestamps: number[] }
const strikes = new Map();

// Periodically clean up expired bans and stale strikes
setInterval(() => {
    const now = Date.now();

    for (const [ip, ban] of blacklist) {
        if (now >= ban.expiresAt) {
            blacklist.delete(ip);
        }
    }

    for (const [ip, data] of strikes) {
        data.timestamps = data.timestamps.filter(t => now - t < STRIKE_WINDOW);
        if (data.timestamps.length === 0) {
            strikes.delete(ip);
        }
    }
}, 60_000);

/**
 * Check if an IP is currently blacklisted.
 * Returns { banned: true, remainingSeconds } or { banned: false }
 */
export function isBlacklisted(ip) {
    const ban = blacklist.get(ip);

    if (!ban) return { banned: false };

    const now = Date.now();

    if (now >= ban.expiresAt) {
        blacklist.delete(ip);
        return { banned: false };
    }

    return {
        banned: true,
        remainingSeconds: Math.ceil((ban.expiresAt - now) / 1000),
    };
}

/**
 * Record a strike against an IP (called when WAF blocks a request).
 * If the IP exceeds MAX_STRIKES within STRIKE_WINDOW, it gets banned.
 * Returns { banned: true } if the IP was just banned, { banned: false } otherwise.
 */
export function recordStrike(ip) {
    const now = Date.now();

    if (!strikes.has(ip)) {
        strikes.set(ip, { timestamps: [] });
    }

    const data = strikes.get(ip);

    // Remove expired strikes
    data.timestamps = data.timestamps.filter(t => now - t < STRIKE_WINDOW);

    // Record this strike
    data.timestamps.push(now);

    // Check if threshold exceeded
    if (data.timestamps.length >= MAX_STRIKES) {
        blacklist.set(ip, {
            bannedAt: now,
            expiresAt: now + BAN_DURATION,
        });

        // Clear strikes since IP is now banned
        strikes.delete(ip);

        const banMinutes = Math.ceil(BAN_DURATION / 60_000);
        console.warn(`[BLACKLISTED] IP=(${ip}) | Strikes: ${MAX_STRIKES} | Ban Duration: ${banMinutes} min`);

        return { banned: true };
    }

    return { banned: false, strikes: data.timestamps.length, remaining: MAX_STRIKES - data.timestamps.length };
}

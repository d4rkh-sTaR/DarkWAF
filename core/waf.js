import activeSignatures from './SignatureMatching/Signatures.js';
import { matchString, inspectData } from './SignatureMatching/SignatureMatching.js';
import { fingerprint } from './Fingerprinting/Fingerprinting.js';
import { rateLimit } from './RateLimiter/RateLimiter.js';
import { isBlacklisted, recordStrike } from './Blacklist/Blacklist.js';
import { logEvent } from './Logger/Logger.js';

export default function DarkWAF(req, res, next) {

    const reqMeta = {
        ip: req.ip,
        method: req.method,
        path: req.path,
        userAgent: req.headers['user-agent'] || '',
    };
    
    // ── Blacklist Check (absolute first — zero processing for banned IPs) ─
    const bl = isBlacklisted(req.ip);

    if (bl.banned) {
        logEvent('BLACKLISTED', { ...reqMeta, banRemaining: bl.remainingSeconds });
        return res.status(403).send('<pre>Forbidden 403: Your IP has been temporarily banned</pre>');
    }

    // ── Rate Limiting ───────────────────────────────────────────────────
    const rl = rateLimit(req);

    if (rl.limited) {
        logEvent('RATE_LIMITED', { ...reqMeta, requestCount: rl.count, retryAfter: rl.retryAfter });
        res.set('Retry-After', String(rl.retryAfter));
        return res.status(429).send('<pre>429 Too Many Requests: Rate limit exceeded</pre>');
    }

    // ── Signature Matching ──────────────────────────────────────────────
    let triggeredSignatures = new Map(); // Rule ID -> Signature Object
    const THRESHOLD = 5;

    const parts = [req.body, req.query, req.path, req.headers];
    
    for (const part of parts) {
        let matches = inspectData(part, activeSignatures);
        for (const match of matches) {
            triggeredSignatures.set(match.id, match);
        }
    }

    // ── Behavioral Fingerprinting ───────────────────────────────────────
    const fp = fingerprint(req.headers);

    let anomalyScore = fp.score;
    let triggeredRules = [...fp.reasons];
    
    for (const sig of triggeredSignatures.values()) {
        anomalyScore += sig.score;
        triggeredRules.push(sig.name);
    }

    if (anomalyScore >= THRESHOLD) {
        logEvent('BLOCKED', { ...reqMeta, anomalyScore, triggeredRules });
        recordStrike(req.ip);
        return res.status(403).send('<pre>Forbidden 403: Security Policy Violation</pre>');
    } else if (anomalyScore > 0) {
        logEvent('WARN', { ...reqMeta, anomalyScore, triggeredRules });
    }

    next();
}
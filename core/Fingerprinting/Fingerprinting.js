/**
 * Behavioral Fingerprinting Module
 * 
 * Detects automated scanners, bots, and penetration testing tools 
 * by analyzing HTTP header metadata that legitimate browsers always
 * send but automated tools typically omit or fake.
 */

// Known scanner / bot User-Agent substrings
const SCANNER_SIGNATURES = [
    'sqlmap', 'nikto', 'nmap', 'gobuster', 'dirbuster', 'openvas',
    'nessus', 'wfuzz', 'ffuf', 'hydra', 'burpsuite', 'zap',
    'masscan', 'nuclei', 'acunetix', 'arachni', 'w3af', 'skipfish',
    'whatweb', 'wpscan', 'joomscan', 'droopescan',
];

const BOT_UA_PREFIXES = [
    'python-requests', 'python-urllib', 'go-http-client', 'java/',
    'perl/', 'ruby/', 'php/', 'wget/', 'curl/', 'httpie/',
    'axios/', 'node-fetch', 'undici/',
];

export function fingerprint(headers) {
    let score = 0;
    let reasons = [];

    const ua = (headers['user-agent'] || '').toLowerCase();

    // ── 1. Known scanner User-Agents (instant block) ────────────────────
    for (const scanner of SCANNER_SIGNATURES) {
        if (ua.includes(scanner)) {
            score += 5;
            reasons.push(`Known scanner: ${scanner}`);
            break;
        }
    }

    // ── 2. Known bot/library User-Agents ────────────────────────────────
    if (score === 0) {
        for (const prefix of BOT_UA_PREFIXES) {
            if (ua.includes(prefix)) {
                score += 1;
                reasons.push(`Bot library UA: ${prefix}`);
                break;
            }
        }
    }

    // ── 3. Empty User-Agent ─────────────────────────────────────────────
    if (!ua || ua.trim() === '') {
        score += 2;
        reasons.push('Empty User-Agent');
    }

    // ── 4. Missing Sec-Fetch-* headers (browsers always send these) ────
    const secFetchHeaders = ['sec-fetch-mode', 'sec-fetch-site', 'sec-fetch-dest'];
    const missingSec = secFetchHeaders.filter(h => !headers[h]);

    if (missingSec.length === secFetchHeaders.length) {
        score += 1;
        reasons.push('All Sec-Fetch-* headers missing');
    }

    // ── 5. Missing Accept-Language (browsers always send this) ──────────
    if (!headers['accept-language']) {
        score += 1;
        reasons.push('Missing Accept-Language');
    }

    // ── 6. UA claims browser but missing browser-specific headers ───────
    const claimsBrowser = /(?:mozilla|chrome|safari|firefox|edge)\//i.test(ua);

    if (claimsBrowser) {
        // Real browsers always send Accept with specific content types
        const accept = headers['accept'] || '';
        if (accept === '*/*' || accept === '') {
            score += 1;
            reasons.push('UA claims browser but Accept is generic');
        }
    }

    return { score, reasons };
}

import { checkSqli } from './LibInjection.js';
import { base64decode } from './utils.js';

export function matchString(value, signatures) {
    let matches = [];

    if (typeof value !== "string") return matches;

    let b64decoded = base64decode(value);

    if (b64decoded) {
        value = b64decoded;
    }

    for (const sig of signatures) {
        if (sig.pattern.test(value)) {
            matches.push(sig);
        }
    }

    return matches;
}

export function inspectData(data, signatures) {
    let allMatches = [];

    if (typeof data === "string") {
        if (checkSqli(data)) {
            allMatches.push({ id: 1, name: 'SQL Injection (LibInjection)', score: 5 });
        }
        
        allMatches.push(...matchString(data, signatures));
        return allMatches;
    }

    if (typeof data === "object" && data !== null) {
        for (const key of Object.keys(data)) {
            allMatches.push(...inspectData(key, signatures));
            allMatches.push(...inspectData(data[key], signatures));
        }
    }

    return allMatches;
}
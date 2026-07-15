export function matchString(value, signatures) {
    let matches = [];
    if (typeof value !== "string") return matches;

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
        return matchString(data, signatures);
    }

    if (typeof data === "object" && data !== null) {
        for (const key of Object.keys(data)) {
            allMatches.push(...inspectData(key, signatures));
            allMatches.push(...inspectData(data[key], signatures));
        }
    }

    return allMatches;
}
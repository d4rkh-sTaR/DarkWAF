export function matchString(value, signatures) {
    if (typeof value !== "string") return 0;

    for (const sig of signatures) {
        if (sig.pattern.test(value)) {
            return sig.score;
        }
    }

    return 0;
}

export function inspectData(data, signatures) {
    let totalScore = 0;

    if (typeof data === "string") {
        totalScore += matchString(data, signatures);
        return totalScore;
    }

    if (typeof data === "object" && data !== null) {
        for (const key of Object.keys(data)) {
            totalScore += inspectData(key, signatures);
            totalScore += inspectData(data[key], signatures);
        }
    }

    return totalScore;
}
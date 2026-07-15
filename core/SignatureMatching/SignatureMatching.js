export function matchString(value, signatures) {
    if (typeof value !== "string") return { score: 0, rules: [] };

    for (const sig of signatures) {
        if (sig.pattern.test(value)) {
            return { score: sig.score, rules: [sig.name] };
        }
    }

    return { score: 0, rules: [] };
}

export function inspectData(data, signatures) {
    let result = { score: 0, rules: [] };

    if (typeof data === "string") {
        let match = matchString(data, signatures);
        if (match.score > 0) {
            result.score += match.score;
            result.rules.push(...match.rules);
        }
        return result;
    }

    if (typeof data === "object" && data !== null) {
        for (const key of Object.keys(data)) {
            let keyMatch = inspectData(key, signatures);
            if (keyMatch.score > 0) {
                result.score += keyMatch.score;
                result.rules.push(...keyMatch.rules);
            }
            
            let valMatch = inspectData(data[key], signatures);
            if (valMatch.score > 0) {
                result.score += valMatch.score;
                result.rules.push(...valMatch.rules);
            }
        }
    }

    return result;
}
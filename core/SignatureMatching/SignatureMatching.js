export function matchString(value, signatures) {
    if (typeof value !== "string") return null;

    for (const sig of signatures) {
        if (sig.pattern.test(value)) {
            return sig.name;
        }
    }

    return null;
}

export function inspectData(data, signatures) {
    if (typeof data === "string") {
        return matchString(data, signatures);
    }

    if (typeof data === "object" && data !== null) {
        for (const key of Object.keys(data)) {
            const rule = inspectData(data[key], signatures);

            if (rule !== null) {
                return rule;
            }
        }
    }

    return null;
}
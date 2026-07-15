import activeSignatures from './SignatureMatching/Signatures.js';
import { matchString, inspectData } from './SignatureMatching/SignatureMatching.js';

export default function DarkWAF(req, res, next) {
    
    let anomalyScore = 0;
    let triggeredRules = [];
    const THRESHOLD = 5;

    const parts = [req.body, req.query, req.path, req.headers];
    
    for (const part of parts) {
        let result = inspectData(part, activeSignatures);
        if (result.score > 0) {
            anomalyScore += result.score;
            triggeredRules.push(...result.rules);
        }
    }

    if (anomalyScore >= THRESHOLD) {
        const uniqueRules = [...new Set(triggeredRules)].join(', ');
        console.warn(`[BLOCKED] IP=(${req.ip}) | Score: ${anomalyScore} | Rules: ${uniqueRules}`);
        return res.status(403).send('<pre>Forbidden 403: Security Policy Violation</pre>');
    }

    next();
}
import activeSignatures from './SignatureMatching/Signatures.js';
import { matchString, inspectData } from './SignatureMatching/SignatureMatching.js';

export default function DarkWAF(req, res, next) {
    
    let triggeredSignatures = new Map(); // Rule ID -> Signature Object
    const THRESHOLD = 5;

    const parts = [req.body, req.query, req.path, req.headers];
    
    for (const part of parts) {
        let matches = inspectData(part, activeSignatures);
        for (const match of matches) {
            triggeredSignatures.set(match.id, match);
        }
    }

    let anomalyScore = 0;
    let triggeredRules = [];
    
    for (const sig of triggeredSignatures.values()) {
        anomalyScore += sig.score;
        triggeredRules.push(sig.name);
    }

    if (anomalyScore >= THRESHOLD) {
        console.warn(`[BLOCKED] IP=(${req.ip}) | Score: ${anomalyScore} | Rules: ${triggeredRules.join(', ')}`);
        return res.status(403).send('<pre>Forbidden 403: Security Policy Violation</pre>');
    } else if (anomalyScore <= THRESHOLD && anomalyScore > 0) {
        console.warn(`[WARN] IP=(${req.ip}) | Score: ${anomalyScore} | Rules: ${triggeredRules.join(', ')}`);
    }

    next();
}
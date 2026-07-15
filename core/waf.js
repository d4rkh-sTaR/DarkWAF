import activeSignatures from './SignatureMatching/Signatures.js';
import { matchString, inspectData } from './SignatureMatching/SignatureMatching.js';

export default function DarkWAF(req, res, next) {
    
    let anomalyScore = 0;
    const THRESHOLD = 5;

    anomalyScore += inspectData(req.body, activeSignatures);
    anomalyScore += inspectData(req.query, activeSignatures);
    anomalyScore += inspectData(req.path, activeSignatures);
    anomalyScore += inspectData(req.headers, activeSignatures);

    if (anomalyScore >= THRESHOLD) {
        console.warn(`[BLOCKED] IP=(${req.ip}) | Anomaly Score: ${anomalyScore}`);
        return res.status(403).send('<pre>Forbidden 403: Security Policy Violation</pre>');
    }

    next();
}
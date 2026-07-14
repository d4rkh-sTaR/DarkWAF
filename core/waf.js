import activeSignatures from './SignatureMatching/Signatures.js';
import { matchString, inspectData } from './SignatureMatching/SignatureMatching.js';

export default function DarkWAF(req, res, next) {
    
    let rule_body = inspectData(req.body, activeSignatures);
    let rule_query = inspectData(req.query, activeSignatures);

    if (rule_body) {
        console.warn(`[BLOCKED] Rule triggered in request body: ${rule_body}`);
        return res.status(403).json({ error: "Forbidden 403" })
    }

    if (rule_query) {
        console.warn(`[BLOCKED] Rule triggered in request query: ${rule_query}`);
        return res.status(403).json({ error: "Forbidden 403" })
    }

    next();
}
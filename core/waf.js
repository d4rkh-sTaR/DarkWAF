import activeSignatures from './SignatureMatching/Signatures.js';
import { matchString, inspectData } from './SignatureMatching/SignatureMatching.js';

export default function DarkWAF(req, res, next) {
    
    // returns the rule name if detected something and returns null if ir doesn't find anything
    let rule_body = inspectData(req.body, activeSignatures);
    let rule_query = inspectData(req.query, activeSignatures);
    let rule_path = inspectData(req.path, activeSignatures);

    if (rule_body) {
        console.warn(`[BLOCKED] Rule triggered in request body: ${rule_body}. IP address : ${req.ip}`);
        return res.status(403).send('<pre>Forbidden 403</pre>');
    }

    if (rule_query) {
        console.warn(`[BLOCKED] Rule triggered in request query: ${rule_query}. IP address : ${req.ip}`);
        return res.status(403).send('<pre>Forbidden 403</pre>');
    }

    if (rule_path) {
        console.warn(`[BLOCKED] Rule triggered in URL: ${rule_path}. IP address : ${req.ip}`);
        return res.status(403).send('<pre>Forbidden 403</pre>');
    }

    next();
}
import activeSignatures from './SignatureMatching/Signatures.js';
import { matchString, inspectData } from './SignatureMatching/SignatureMatching.js';

export default function DarkWAF(req, res, next) {
    
    // returns the rule name if detected something and returns null if ir doesn't find anything
    let rule_body = inspectData(req.body, activeSignatures);
    let rule_query = inspectData(req.query, activeSignatures);
    let rule_path = inspectData(req.path, activeSignatures);
    let rule_headers = inspectData(req.headers, activeSignatures);

    if (rule_body) {
        console.warn(`[BLOCKED] IP=(${req.ip}), Rule triggered in body: ${rule_body}`);
        return res.status(403).send('<pre>Forbidden 403</pre>');
    }

    if (rule_query) {
        console.warn(`[BLOCKED] IP=(${req.ip}), Rule triggered in query: ${rule_query}`);
        return res.status(403).send('<pre>Forbidden 403</pre>');
    }

    if (rule_path) {
        console.warn(`[BLOCKED] IP=(${req.ip}), Rule triggered in URL: ${rule_path}`);
        return res.status(403).send('<pre>Forbidden 403</pre>');
    }

    if (rule_headers) {
        console.warn(`[BLOCKED] IP=(${req.ip}), Rule triggered in headers: ${rule_headers}`);
        return res.status(403).send('<pre>Forbidden 403</pre>');
    }

    next();
}
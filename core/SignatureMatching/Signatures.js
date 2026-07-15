let activeSignatures = [
    { id: 4, name: 'Path Traversal', score: 5, pattern: /(?:(?:\.|%2e|%252e)(?:\.|%2e|%252e)(?:\/|\\|%2f|%5c|%252f|%255c))|(?:^\/?(?:etc|var|usr|bin|windows|winnt)(?:\/|\\|%2f|%5c|%252f|%255c))/i },
    { id: 5, name: "OS Command Injection", score: 5, pattern: /(?:;|\||&&|`|\$\().*(?:\b(?:cat|ls|pwd|whoami|ping|curl|wget|nc|bash|sh|powershell|cmd)\b)/i },
    { id: 6, name: "NoSQL Injection", score: 5, pattern: /(?:"?\$[a-z]+"?\s*:|\{"\$where"\s*:|"\$gt"\s*:|"\$ne"\s*:|"\$in"\s*:)/i },
    { id: 7, name: "Server-Side Template Injection", score: 5, pattern: /(?:\{\{.*?\}\}|\$\{.*?\}|<%.*?%>|#\{.*?\})/i },
    { id: 8, name: "SSRF (Protocols)", score: 3, pattern: /(?:\b(?:http|https|ftp|gopher|dict|file):\/\/)/i },
    { id: 801, name: "SSRF (Internal IPs)", score: 5, pattern: /(?:\b(?:http|https|ftp|gopher|dict|file):\/\/).*(?:127\.0\.0\.1|169\.254\.169\.254|localhost|0\.0\.0\.0|::1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})/i },
    { id: 9, name: "XML External Entity (XXE)", score: 5, pattern: /(?:<!ENTITY\s+(?:%\s+)?[^_]+\s+(?:SYSTEM|PUBLIC)\s+["'].+["']>)/i }
]

export default activeSignatures;
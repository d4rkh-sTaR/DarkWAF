// Scaning for SQLi in LibInjection.js

let activeSignatures = [
    { id: 1,   name: 'Cross-Site Scripting (XSS)',          score: 5, pattern: /(?:<(?:script|img|svg|iframe|body|object|embed|applet|math|meta|link|style)\b.*?(?:\/?>|>))|(?:\bon[a-z]+\s*=|(?:^|[^a-z])javascript:[^\s]|vbscript:|data:text\/(?:html|javascript)|alert\(|prompt\(|confirm\()/i },
    { id: 2,   name: 'Path Traversal',                      score: 5, pattern: /(?:(?:\.|%2e|%252e){2}(?:\/|\\|%2f|%5c|%252f|%255c))|(?:\/?(?:etc\/passwd|etc\/shadow|windows\/win\.ini|boot\.ini|proc\/self\/environ))/i },
    { id: 3,   name: 'OS Command Injection',                score: 5, pattern: /(?:;|\||&&|`|\$\(|\|\|).*(?:\b(?:cat|ls|pwd|whoami|id|uname|wget|curl|nc|bash|sh|zsh|python|perl|ruby|php|powershell|cmd|net\s+user)\b)/i },
    { id: 4,   name: 'NoSQL Injection',                     score: 5, pattern: /(?:\$(?:where|eq|ne|gt|gte|lt|lte|in|nin|and|or|not|nor|exists|type|mod|regex|text|search|size|all|elemMatch|slice))\b|\{\s*"\$/i },
    { id: 5,   name: 'Server-Side Template Injection',      score: 5, pattern: /(?:\{\{-?.*?-?\}\}|\$\{.*?\}|<%[=\-]?.*?%>|#\{.*?\}|#set\s*\(|#include\s*\(|\[%.*?%\]|@\{.*?\}|<\[.*?\]>)/i },
    { id: 6,   name: 'SSRF (Protocols)',                    score: 3, pattern: /(?:\b(?:http|https|ftp|gopher|dict|file|sftp|tftp|ldap|jar|netdoc):\/\/)/i },
    { id: 7, name: 'SSRF (Internal IPs)',                 score: 5, pattern: /(?:\b(?:http|https|ftp|gopher|dict|file):\/\/).*(?:127\.0\.0\.1|169\.254\.169\.254|localhost|0\.0\.0\.0|::1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})/i },
    { id: 8,   name: 'XML External Entity (XXE)',           score: 5, pattern: /(?:<!ENTITY\s+(?:%\s+)?[^_]+\s+(?:SYSTEM|PUBLIC)\s+["'].+["']>)/i },
    { id: 9,  name: 'LDAP Injection',                      score: 5, pattern: /(?:\*\)\s*\(|\(\s*\|\s*\(|\)\s*\(\s*\||[\x00-\x1f]|\bdc=.*,dc=|\(\s*(?:objectClass|cn|uid|mail)\s*=\s*\*)/i },
    { id: 10,  name: 'Mail Injection',                      score: 5, pattern: /(?:\r?\n|\r)(?:to|cc|bcc|from|subject|content-type)\s*:/i },
    { id: 11,  name: 'Server-Side Includes (SSI)',          score: 5, pattern: /<!--\s*#(?:include|exec|echo|printenv|set|if|elif|else|endif|flastmod|fsize)\b/i },
    { id: 12,  name: 'CRLF Injection',                      score: 5, pattern: /(?:%0d%0a|%0a%0d|%0a|%0d|\r\n|\r|\n)(?:[\w-]+\s*:|\s*<html|\s*<body)/i },
    { id: 13,  name: 'XML Injection',                       score: 4, pattern: /(?:<[^>]+>.*<\/[^>]+>|<!-[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|&(?:#\d+|#x[0-9a-f]+|[a-z]+);)/i },
]

export default activeSignatures;
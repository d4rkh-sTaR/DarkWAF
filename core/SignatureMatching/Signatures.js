let activeSignatures = [
    { id: 1, name: 'SQLi (Logic/Comments)', score: 3, pattern: /(?:'\s*(?:or|and)\s*'?\w)|(?:--[ \r\n\v\f]|#\s|\/\*.*?\*\/)/i },
    { id: 2, name: 'SQLi (Commands)', score: 5, pattern: /(?:\b(?:select|update|delete|insert|drop|alter|union|exec|truncate)\b(?:\s|\+)+.*?(?:from|into|table|database|set)\b)/i },
    { id: 3, name: 'Cross-Site Scripting (XSS)', score: 5, pattern: /(?:<(?:script|img|svg|iframe|body|object|embed|applet|math|meta)\b.*?(?:\/?>|>))|(?:on(?:load|error|click|mouseover|focus|blur|submit|keydown|keyup)\s*=|javascript:|vbscript:|data:text\/html)/i },
    { id: 4, name: 'Path Traversal', score: 5, pattern: /(?:(?:\.|%2e|%252e)(?:\.|%2e|%252e)(?:\/|\\|%2f|%5c|%252f|%255c))|(?:^\/?(?:etc|var|usr|bin|windows|winnt)(?:\/|\\|%2f|%5c|%252f|%255c))/i },
    { id: 5, name: "OS Command Injection", score: 4, pattern: /(?:;|\||&&|`|\$\().*(?:\b(?:cat|ls|pwd|whoami|ping|curl|wget|nc|bash|sh|powershell|cmd)\b)/i },
    { id: 6, name: "NoSQL Injection", score: 5, pattern: /(?:"?\$[a-z]+"?\s*:|\{"\$where"\s*:|"\$gt"\s*:|"\$ne"\s*:|"\$in"\s*:)/i },
    { id: 7, name: "Server-Side Template Injection", score: 5, pattern: /(?:\{\{.*?\}\}|\$\{.*?\}|<%.*?%>|#\{.*?\})/i },
    { id: 8, name: "SSRF / Remote File Inclusion", score: 3, pattern: /(?:(?:\b(?:http|https|ftp|gopher|dict|file):\/\/)|(?:169\.254\.169\.254))/i },
    { id: 9, name: "XML External Entity (XXE)", score: 5, pattern: /(?:<!ENTITY\s+(?:%\s+)?[^_]+\s+(?:SYSTEM|PUBLIC)\s+["'].+["']>)/i }
]

export default activeSignatures;
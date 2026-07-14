let activeSignatures = [
    { id: 1, name: 'SQL Injection (SQLi)', pattern: /(?:'\s*(?:or|and)\s*'?\w)|(?:\b(?:select|update|delete|insert|drop|alter|union|exec|truncate)\b(?:\s|\+)+.*?(?:from|into|table|database|set)\b)|(?:--[ \r\n\v\f]|#\s|\/\*.*?\*\/)/i },
    { id: 2, name: 'Cross-Site Scripting (XSS)', pattern: /(?:<(?:script|img|svg|iframe|body|object|embed|applet|math|meta)\b.*?(?:\/?>|>))|(?:on(?:load|error|click|mouseover|focus|blur|submit|keydown|keyup)\s*=|javascript:|vbscript:|data:text\/html)/i },
    { id: 3, name: 'Path Traversal', pattern: /(?:(?:\.|%2e|%252e)(?:\.|%2e|%252e)(?:\/|\\|%2f|%5c|%252f|%255c))|(?:^\/?(?:etc|var|usr|bin|windows|winnt)(?:\/|\\|%2f|%5c|%252f|%255c))/i },
    { id: 4, name: "OS Command Injection", pattern: /(?:;|\||&&|`|\$\().*(?:\b(?:cat|ls|pwd|whoami|ping|curl|wget|nc|bash|sh|powershell|cmd)\b)/i },
    { id: 5, name: "NoSQL Injection", pattern: /(?:"?\$[a-z]+"?\s*:|\{"\$where"\s*:|"\$gt"\s*:|"\$ne"\s*:|"\$in"\s*:)/i },
    { id: 6, name: "Server-Side Template Injection", pattern: /(?:\{\{.*?\}\}|\$\{.*?\}|<%.*?%>|#\{.*?\})/i },
    { id: 7, name: "SSRF / Remote File Inclusion", pattern: /(?:(?:\b(?:http|https|ftp|gopher|dict|file):\/\/)|(?:169\.254\.169\.254))/i },
    { id: 8, name: "XML External Entity (XXE)", pattern: /(?:<!ENTITY\s+(?:%\s+)?[^_]+\s+(?:SYSTEM|PUBLIC)\s+["'].+["']>)/i }
]

export default activeSignatures;
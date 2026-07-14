let activeSignatures = [
    { id: 1, name: 'Basic SQLi', pattern: /('|"|--|#|union|select|insert)/i },
    { id: 2, name: 'Basic XSS', pattern: /(<script>|onerror=|javascript:)/i },
    { id: 3, name: 'Path Traversal', pattern: /(?:\.\.[\/\\]|%2e%2e%2f|%2e%2e%5c|\.\.%2f|\.\.%5c)/i }
]

export default activeSignatures;
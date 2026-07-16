# DarkWAF (ExpressJS Security Gateway)

> **⚠️ Note: This project is currently in active development.**

## Overview
DarkWAF is a multi-layered Web Application Firewall (WAF) and Reverse Proxy built on ExpressJS. It is designed to act as a secure edge gateway for backend infrastructure, providing deep packet inspection, anomaly-based threat scoring, multi-layer payload decoding, and SIEM-compatible logging.

## Project Status

Below is the current technical implementation status of the gateway's core capabilities.

### 🟢 Currently Built Features

#### Anomaly Scoring Engine
Mitigates false positives by evaluating requests holistically. Each matched signature contributes a weighted threat score, and requests are only blocked if the total anomaly score meets or exceeds the configured threshold. Requests that partially match (warn-level score) are logged but allowed through, enabling tuning without impacting legitimate traffic.

#### Multi-Layer Payload Decoding
Before signatures are evaluated, incoming payload strings are passed through a normalisation pipeline to defeat obfuscation attempts:
1. **Iterative URL Decoding** — Decodes URL-encoded payloads up to 3 times to catch double and triple encoding attacks (e.g. `%253Cscript%253E` → `%3Cscript%3E` → `<script>`)
2. **Base64 Detection & Decoding** — Detects structurally valid base64 strings (minimum 16 characters, properly padded) and decodes them for inspection. Only decoded strings that contain entirely printable ASCII characters are scanned, preventing binary false positives.

#### Deep Packet Inspection (DPI)
Scans all incoming HTTP request surfaces including JSON bodies (both keys and values, recursively), URL query parameters, URL paths, and HTTP headers (User-Agent, Cookie, Referer, X-Forwarded-For, etc.). The inspection engine uses a hybrid detection approach:

- **Native LibInjection (C++)** — SQL Injection is detected using [`node-libinjection`](https://github.com/ntedgi/node-libinjection), a native Node.js binding to the `libinjection` C library — the same engine that powers ModSecurity, NGINX ModSec, and Cloudflare's WAF. Decoded payloads (URL and Base64) are passed through LibInjection to catch encoded SQLi attacks.
- **Regex Signature Engine** — All other attack categories are detected using a set of handcrafted, performance-tuned regular expressions.

Active signatures (14 rules):

| ID | Signature | Score |
|----|-----------|-------|
| — | SQL Injection (LibInjection — native C++) | 5 |
| 1 | Cross-Site Scripting (XSS) | 5 |
| 2 | Path Traversal / LFI | 5 |
| 3 | OS Command Injection | 5 |
| 4 | NoSQL Injection | 5 |
| 5 | Server-Side Template Injection (SSTI) | 5 |
| 6 | SSRF — Protocol Detection (`gopher://`, `file://`, etc.) | 3 |
| 7 | SSRF — Internal IP Detection (`127.0.0.1`, `169.254.169.254`, RFC1918) | 5 |
| 8 | XML External Entity (XXE) | 5 |
| 9 | LDAP Injection | 5 |
| 10 | Mail Header Injection | 5 |
| 11 | Server-Side Includes (SSI) | 5 |
| 12 | CRLF Injection | 5 |
| 13 | XML Injection | 4 |

#### Signature Deduplication
Each signature can only contribute its anomaly score **once per request**, regardless of how many times it matches across fields. This prevents a single attack type from artificially inflating the score (e.g. an array of 100 URLs should not score 300 points for SSRF).

#### Reverse Proxy Routing
Invisible traffic forwarding to internal upstream applications, ensuring clients only communicate with the edge WAF. Backend services remain completely isolated from direct internet exposure.

---

### 🟡 Planned Features (To Be Built)
The core dependencies are installed, and the following features are pending full implementation:
- **Brute-Force Rate Limiting**: Sliding-window token tracking to mitigate credential stuffing and Layer 7 DoS attacks. Will automatically return `HTTP 429 Too Many Requests` when thresholds are exceeded.
- **Dynamic IP Blacklisting**: In-memory data structure for manual and API-driven connection dropping of malicious IP addresses at the gateway level.
- **Behavioral Fingerprinting**: Heuristic analysis to detect and drop automated penetration testing scanners and botnets by validating browser-specific telemetry (e.g., `Sec-Fetch-*` headers).
- **SIEM Integration**: Structured JSON event logging via Winston, formatted for real-time ingestion into enterprise log management and monitoring systems.

---

## Architecture Highlights
- **Inspection Engine**: Evaluates each request through the decoding pipeline → LibInjection → Regex signatures. Matched signatures are deduplicated by ID and their scores are accumulated. If the total anomaly score meets the block threshold, the request lifecycle is terminated with a `403 Forbidden`. Warn-level matches are logged for visibility.
- **Decoding Pipeline**: `Raw Input → URL Decode (×3) → Base64 Decode → Inspect`
- **Topology**: Adopts an edge gateway deployment model, sitting at the perimeter of the network to shield internal servers and microservices from direct internet exposure.


## Installation & Deployment
To install the required middleware and dependencies, run:
```bash
npm install
```

To install the native LibInjection bindings (requires `node-gyp` and a C++ compiler):
```bash
npm install git+https://github.com/ntedgi/node-libinjection.git
```

**System Requirements:**
- Node.js v18+
- GCC / Clang (for compiling native LibInjection bindings)
- An external SIEM or log management agent (optional, for security telemetry)

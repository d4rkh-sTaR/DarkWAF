# DarkWAF (ExpressJS Security Gateway)

> **⚠️ Note: This project is currently in active development.**

## Overview
DarkWAF is a multi-layered Web Application Firewall (WAF) and Reverse Proxy built on ExpressJS. It is designed to act as a secure edge gateway for backend infrastructure, providing deep packet inspection, traffic shaping, behavioral fingerprinting, and SIEM-compatible logging.

## Project Status

Below is the current technical implementation status of the gateway's core capabilities.

### 🟢 Currently Built Features
- **Deep Packet Inspection (DPI)**: Scans incoming HTTP requests (specifically JSON bodies and URL query parameters). The middleware flattens the request components and leverages the V8 JavaScript engine to execute optimized Regular Expressions. This halts malicious payloads before they can reach the backend routers. Active signatures include:
  - SQL Injection (SQLi)
  - Cross-Site Scripting (XSS)
  - Path Traversal & Local File Inclusion (LFI)
  - OS Command Injection
  - NoSQL Injection
  - Server-Side Template Injection (SSTI)
  - Server-Side Request Forgery (SSRF) / Remote File Inclusion
  - XML External Entity (XXE) Injection

### 🟡 Planned Features (To Be Built)
The core dependencies are installed, and the following features are pending full implementation:
- **Reverse Proxy Routing**: Invisible traffic forwarding to internal upstream applications, ensuring that clients only communicate with the edge WAF and backend services remain completely isolated.
- **Brute-Force Rate Limiting**: Sliding-window token tracking to mitigate credential stuffing and Layer 7 DoS attacks. It will automatically return an `HTTP 429 Too Many Requests` when thresholds are exceeded.
- **Dynamic IP Blacklisting**: An in-memory data structure designed to allow manual and API-driven connection dropping of malicious IP addresses at the gateway level.
- **Behavioral Fingerprinting**: Heuristic analysis designed to drop automated penetration testing scanners and botnets by validating browser-specific telemetry metadata (e.g., `Sec-Fetch-*` HTTP headers).
- **SIEM Integration**: Structured JSON event logging via Winston, formatted specifically for real-time ingestion into enterprise log management and monitoring systems.

## Architecture Highlights
- **Inspection Engine**: Evaluates incoming request streams dynamically. If a signature match is detected, the request lifecycle is immediately terminated, returning a `403 Forbidden` response.
- **Topology**: Adopts an edge gateway deployment model, sitting at the perimeter of the network to shield hidden internal servers and microservices from direct internet exposure.

## Installation & Deployment
To install the required middleware and dependencies, run:
```bash
npm install express http-proxy-middleware express-rate-limit winston
```

**System Requirements:**
- Node.js v18+
- An external SIEM or log management agent (optional, for security telemetry)

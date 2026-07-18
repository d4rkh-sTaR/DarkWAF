# ── Build stage ─────────────────────────────────────────────────────────────
FROM node:22-slim AS builder

# Install build tools needed to compile native node-libinjection C++ addon
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including native build of libinjection)
RUN npm ci

# ── Runtime stage ────────────────────────────────────────────────────────────
FROM node:22-slim AS runtime

WORKDIR /app

# Copy compiled node_modules from builder (includes the .node binary)
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY . .

# DarkWAF listens on this port
EXPOSE 3000

# Required: URL of the backend application to proxy traffic to
# Example: docker run -e UPSTREAM_TARGET=http://192.168.1.10:5000 darkwaf
ENV UPSTREAM_TARGET=""

# Optional: override the listen port (default 3000)
ENV PORT=3000

CMD ["node", "main.js"]

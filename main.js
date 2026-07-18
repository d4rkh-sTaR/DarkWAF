import express from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import DarkWAF from './core/waf.js'

const app = express();
const PORT = process.env.PORT || 3000;
const UPSTREAM_TARGET = process.env.UPSTREAM_TARGET;

if (!UPSTREAM_TARGET) {
    console.error('[FATAL] UPSTREAM_TARGET environment variable is not set.');
    console.error('  Example: UPSTREAM_TARGET=http://192.168.1.10:5000');
    process.exit(1);
}

try {
    new URL(UPSTREAM_TARGET);
} catch {
    console.error(`[FATAL] UPSTREAM_TARGET is not a valid URL: "${UPSTREAM_TARGET}"`);
    console.error('  Make sure it includes the protocol, e.g. http://192.168.1.10:5000');
    process.exit(1);
}

app.use(express.json());
app.use(DarkWAF);

app.use('/', createProxyMiddleware({
    target: UPSTREAM_TARGET,
    changeOrigin: true,
    on: {
        proxyReq: fixRequestBody,
    }
}));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DarkWAF] Listening on port ${PORT}`);
    console.log(`[DarkWAF] Proxying traffic to: ${UPSTREAM_TARGET}`);
});
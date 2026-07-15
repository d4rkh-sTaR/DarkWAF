import express from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import DarkWAF from './core/waf.js'

const app = express();
const port = 3000;

app.use(express.json());
app.use(DarkWAF);

app.use('/', createProxyMiddleware({
    target: 'http://localhost:5000/',
    changeOrigin: true,
    on: {
        proxyReq: fixRequestBody,
    }
}));

app.listen(port, '0.0.0.0', () => {
    console.log(`Running at ${port}`);
});
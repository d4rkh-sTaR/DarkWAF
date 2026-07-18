/**
 * SIEM Logger Module
 * 
 * Structured JSON event logging via Winston, designed for ingestion
 * into enterprise SIEM platforms (Splunk, ELK, Grafana Loki, etc.).
 * 
 * Outputs:
 *   - Console: Human-readable colored output for development
 *   - File:    JSON Lines format for SIEM ingestion
 *              logs/darkwaf-events.log  (all events)
 *              logs/darkwaf-blocked.log (blocked/blacklisted/rate-limited only)
 * 
 * Configuration via environment variables:
 *   LOG_LEVEL  — Minimum log level (default: 'info')
 *   LOG_DIR    — Directory for log files (default: 'logs')
 */

import winston from 'winston';
import path from 'path';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const LOG_DIR = process.env.LOG_DIR || 'logs';

const jsonFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    winston.format.json()
);

const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
        return `${timestamp} ${level}: ${message}${metaStr}`;
    })
);

const logger = winston.createLogger({
    level: LOG_LEVEL,
    defaultMeta: { service: 'darkwaf' },
    transports: [
        // Console: colored human-readable output
        new winston.transports.Console({
            format: consoleFormat,
        }),

        // File: all events in JSON Lines format
        new winston.transports.File({
            filename: path.join(LOG_DIR, 'darkwaf-events.log'),
            format: jsonFormat,
            maxsize: 10 * 1024 * 1024, // 10 MB rotation
            maxFiles: 5,
        }),

        // File: blocked events only (for alerting pipelines)
        new winston.transports.File({
            filename: path.join(LOG_DIR, 'darkwaf-blocked.log'),
            level: 'warn',
            format: jsonFormat,
            maxsize: 10 * 1024 * 1024,
            maxFiles: 5,
        }),
    ],
});

/**
 * Log a WAF security event with structured metadata.
 * 
 * @param {'BLOCKED'|'WARN'|'BLACKLISTED'|'RATE_LIMITED'|'PASSED'} action
 * @param {object} meta - Event metadata
 */
export function logEvent(action, meta = {}) {
    const event = {
        action,
        ...meta,
    };

    switch (action) {
        case 'BLOCKED':
        case 'BLACKLISTED':
        case 'RATE_LIMITED':
            logger.warn(action, event);
            break;
        case 'WARN':
            logger.info(action, event);
            break;
        case 'PASSED':
            logger.debug(action, event);
            break;
        default:
            logger.info(action, event);
    }
}

export default logger;

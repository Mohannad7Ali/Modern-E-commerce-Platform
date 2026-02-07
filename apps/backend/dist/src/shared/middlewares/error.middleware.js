"use strict";
/**
 * Error Middleware:
 * This file catches any errors that happen in our routes.
 * It sends a clean JSON response to the user instead of crashing the server.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const logger_1 = __importDefault(require("@/infra/logging/logger"));
const env_1 = __importDefault(require("@/config/env"));
function errorMiddleware(err, _req, res, _next) {
    logger_1.default.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: env_1.default.NODE_ENV === 'development' ? err.stack : undefined
    });
}
/**
 * Why we don't use 'next':
 * In Express error handlers, 'next' is used to pass the error to the "next" error middleware.
 * Since this is our LAST safety net, we don't need to pass the error further.
 * We finish the request here by sending the 'res.json'.
 */

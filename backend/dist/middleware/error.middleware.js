"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const app_error_1 = require("../lib/app.error");
const logger_1 = require("../lib/logger");
const errorMiddleware = (err, req, res, next) => {
    logger_1.logger.error(`Error: ${err.message}`);
    if (err instanceof app_error_1.AppError) {
        logger_1.logger.warn(`Operational error ${err.statusCode}: ${err.message}`);
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    // For unexpected errors, we log the error and return a generic message to the client.
    logger_1.logger.error(`Unexpected error: ${err.message}`, { stack: err.stack });
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
};
exports.errorMiddleware = errorMiddleware;

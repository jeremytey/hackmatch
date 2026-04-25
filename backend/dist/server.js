"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const env_1 = require("./lib/env");
const logger_1 = require("./lib/logger");
const app_1 = __importDefault(require("./app"));
const PORT = env_1.env.PORT;
// Handle unhandled promise rejections and uncaught exceptions to prevent the server from crashing without logging the error.
process.on('unhandledRejection', (reason) => {
    logger_1.logger.error('Unhandled rejection', { reason });
    process.exit(1);
});
// Handle uncaught exceptions to log the error and exit the process gracefully.
process.on('uncaughtException', (err) => {
    logger_1.logger.error('Uncaught exception', { error: err.message, stack: err.stack });
    process.exit(1);
});
app_1.default.listen(PORT, () => {
    logger_1.logger.info(`Server is running on port ${PORT} in ${env_1.env.NODE_ENV} mode`);
});

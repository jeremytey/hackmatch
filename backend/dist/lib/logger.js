"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const isDevelopment = process.env.NODE_ENV === 'development';
const devFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
}));
const prodFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json());
exports.logger = winston_1.default.createLogger({
    level: isDevelopment ? 'debug' : 'info',
    format: isDevelopment ? devFormat : prodFormat,
    // In development, transport to the console. 
    // In production, transport to files.
    transports: [
        // 1. This is ALWAYS in the array. It's index [0].
        new winston_1.default.transports.Console(),
        // 2. We use the spread operator (...) because we are "spreading" 
        // an array into another array.
        ...(!isDevelopment
            ? [
                // 3. If NOT development, we "spread" these two items into the main array.
                // Now the array has 3 items: [Console, ErrorFile, CombinedFile]
                new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
                new winston_1.default.transports.File({ filename: 'logs/combined.log' }),
            ]
            : [
            // 4. If IT IS development, we spread an empty array.
            // The main array stays with 1 item: [Console]
            ]),
    ],
});

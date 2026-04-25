"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.envSchema = void 0;
const zod_1 = require("zod");
// env.ts - Environment variable validation and parsing using zod
// Define the schema for environment variables using zod
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']),
    PORT: zod_1.z.string().transform((val) => parseInt(val, 10)),
    DATABASE_URL: zod_1.z.string(),
    JWT_ACCESS_SECRET: zod_1.z.string().min(32),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string(),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string(),
    FRONTEND_URL: zod_1.z.string().optional().default('http://localhost:5173')
});
// Parse and validate the environment variables at runtime
exports.env = exports.envSchema.parse(process.env);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// This file initializes a PrismaClient instance and ensures that it is reused across the application.
const globalForPrisma = global;
// We create a new PrismaClient instance if it doesn't already exist, and we log queries, errors, and warnings for better debugging.
const prisma = globalForPrisma.prisma ?? new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'test' ? ['error'] : ['query', 'error', 'warn'],
});
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
exports.default = prisma;

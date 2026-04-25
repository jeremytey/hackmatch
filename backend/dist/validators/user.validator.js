"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// Define the schema for updating user profile using zod
exports.UpdateUserSchema = zod_1.z.object({
    university: zod_1.z.string().min(2).max(100).optional(),
    yearOfStudy: zod_1.z.number().int().min(1).max(5).optional(),
    role: zod_1.z.nativeEnum(client_1.Role).optional(),
    bio: zod_1.z.string().max(500).optional(),
    githubURL: zod_1.z.string().url().optional(),
    linkedinURL: zod_1.z.string().url().optional(),
    preferredContact: zod_1.z.string().max(50).optional(),
    avatarURL: zod_1.z.string().url().optional(),
    skills: zod_1.z.array(zod_1.z.number().min(1).max(50)).optional(),
});

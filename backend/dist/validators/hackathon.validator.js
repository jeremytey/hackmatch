"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTeamStatusSchema = exports.UpdateHackathonSchema = exports.CreateHackathonSchema = exports.ParticipantFilterSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// Define schema for filtering hackathon participants using zod
exports.ParticipantFilterSchema = zod_1.z.object({
    role: zod_1.z.nativeEnum(client_1.Role).optional(),
    teamStatus: zod_1.z.nativeEnum(client_1.TeamStatus).optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    university: zod_1.z.string().max(100).optional(),
    page: zod_1.z.coerce.number().int().positive().optional(),
    limit: zod_1.z.coerce.number().int().positive().max(100).optional(),
});
// Define schema for creating a hackathon using zod
exports.CreateHackathonSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().max(1000),
    startDate: zod_1.z.coerce.date(),
    registrationDeadline: zod_1.z.coerce.date(),
    maxTeamSize: zod_1.z.number().int().min(1).max(15).default(4),
    externalUrl: zod_1.z.string().url().optional(),
}) // Add a chained refine to ensure registration deadline is before the start date
    .refine((data) => data.registrationDeadline < data.startDate, {
    message: "Registration must close before the hackathon starts!",
    path: ["registrationDeadline"],
});
// Define schema for updating a hackathon using zod
exports.UpdateHackathonSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    description: zod_1.z.string().max(1000).optional(),
    startDate: zod_1.z.coerce.date().optional(),
    registrationDeadline: zod_1.z.coerce.date().optional(),
    maxTeamSize: zod_1.z.number().int().min(1).max(15).optional(),
    externalUrl: zod_1.z.string().url().optional(),
}) // Add a chained refine to ensure registration deadline is before the start date if both are provided
    .refine((data) => {
    if (data.registrationDeadline && data.startDate) {
        return data.registrationDeadline < data.startDate;
    }
    return true; // If one of the dates is not provided, skip this validation
}, {
    message: "Registration must close before the hackathon starts!",
    path: ["registrationDeadline"],
});
// Define schema for updating team status using zod
exports.UpdateTeamStatusSchema = zod_1.z.object({
    teamStatus: zod_1.z.nativeEnum(client_1.TeamStatus),
});

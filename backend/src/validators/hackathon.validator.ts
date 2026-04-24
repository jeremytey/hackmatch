import { z } from 'zod';
import { Role, TeamStatus} from '@prisma/client';

// Define schema for filtering hackathon participants using zod
export const ParticipantFilterSchema = z.object({
    role: z.nativeEnum(Role).optional(),
    teamStatus: z.nativeEnum(TeamStatus).optional(),
    skills: z.array(z.string()).optional(),
    university: z.string().max(100).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
});


// Define schema for creating a hackathon using zod
export const CreateHackathonSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(1000),
    startDate: z.coerce.date(),
    registrationDeadline: z.coerce.date(),
    maxTeamSize: z.number().int().min(1).max(15).default(4),
    externalUrl: z.string().url().optional(),
}) // Add a chained refine to ensure registration deadline is before the start date
    .refine((data) => data.registrationDeadline < data.startDate, {
    message: "Registration must close before the hackathon starts!",
    path: ["registrationDeadline"],
});

// Define schema for updating a hackathon using zod
export const UpdateHackathonSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(1000).optional(),
    startDate: z.coerce.date().optional(),
    registrationDeadline: z.coerce.date().optional(),
    maxTeamSize: z.number().int().min(1).max(15).optional(),
    externalUrl: z.string().url().optional(),
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
export const UpdateTeamStatusSchema = z.object({
    teamStatus: z.nativeEnum(TeamStatus),
});

export type ParticipantFilterDto = z.infer<typeof ParticipantFilterSchema>;
export type CreateHackathonDto = z.infer<typeof CreateHackathonSchema>;
export type UpdateHackathonDto = z.infer<typeof UpdateHackathonSchema>;
export type UpdateTeamStatusDto = z.infer<typeof UpdateTeamStatusSchema>;
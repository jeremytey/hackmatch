import { z } from 'zod';
import { Role } from '@prisma/client';

// Define the schema for updating user profile using zod
export const UpdateUserSchema = z.object({
    university: z.string().min(2).max(100).optional(),
    yearOfStudy: z.number().int().min(1).max(5).optional(),
    role: z.nativeEnum(Role).optional(),
    bio: z.string().max(500).optional(),
    githubURL: z.string().url().optional(),
    linkedinURL: z.string().url().optional(),
    preferredContact: z.string().max(50).optional(), 
    avatarURL: z.string().url().optional(),
    skills: z.array(z.number().min(1).max(50)).optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

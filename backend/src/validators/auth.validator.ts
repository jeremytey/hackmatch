import { z } from 'zod';

// Define the schema for user registration using zod
export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string()
            .min(8, "Password must be at least 8 characters long")
            .regex(/(?=.*[0-9])/, "Password must contain at least one number"),
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores'
    }),
});

// Define the schema for user login using zod
export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
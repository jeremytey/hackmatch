import { z } from 'zod';

// Define the schema for user registration using zod
export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).regex(/(?=.*[0-9])/, {
        message: 'Password must contain at least one number'
    }),
    confirmPassword: z.string().min(8),
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores'
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

// Define the schema for user login using zod
export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
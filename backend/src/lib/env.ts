import {z} from 'zod';
// env.ts - Environment variable validation and parsing using zod
// Define the schema for environment variables using zod
export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']),
    PORT: z.string().transform((val) => parseInt(val, 10)),
    DATABASE_URL: z.string(),
    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_ACCESS_EXPIRES_IN: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string(),
});

// Infer the TypeScript type from the zod schema
export type Env = z.infer<typeof envSchema>;

// Parse and validate the environment variables at runtime
export const env = envSchema.parse(process.env);
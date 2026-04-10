import { Role } from "@prisma/client";

// This file defines the types related to authentication, including the structure of the JWT payload.
export interface JwtPayload {
    userId: number;
    role: Role;
}
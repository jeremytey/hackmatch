import { RefreshToken } from "@prisma/client";
import prisma from "../lib/prisma";

// refresh token stored in db
// browser stores refreshtoken in httpOnly cookie, compared againt hashed token in db when user tries to refresh access token
export async function createRefreshToken(userId: number, tokenHash: string, expiresAt: Date): Promise<RefreshToken> {
    const refreshToken = await prisma.refreshToken.create({
        data: {
            userId,
            tokenHash,
            expiresAt,
        },
    });
    return refreshToken;
}

// find hashed refresh token in db
export async function findRefreshToken(tokenHash: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
        where: { tokenHash },
    });
    return refreshToken;
}

// delete hashed refresh token from db
export async function deleteRefreshToken(tokenHash: string): Promise<void> {
    await prisma.refreshToken.delete({
        where: { tokenHash },
    });
}

// delete all refresh tokens for a user (on logout/security breach)
export async function deleteRefreshTokensForUser(userId: number): Promise<void> {
    await prisma.refreshToken.deleteMany({
        where: { userId },
    });
}

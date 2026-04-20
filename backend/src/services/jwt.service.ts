import { sign, verify, SignOptions } from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { JwtPayload } from '../types/auth.types';
import {env} from '../lib/env';
import { randomUUID } from 'crypto';

// sign and verify JWT tokens for access and refresh tokens
export function generateTokenPair(userId: number, role: UserRole): { accessToken: string; refreshToken: string } {
    const accessToken = sign(
        { userId, role }, 
        env.JWT_ACCESS_SECRET, 
        { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as SignOptions
    );
    const refreshToken = sign(
        { userId, jti: randomUUID() }, 
        env.JWT_REFRESH_SECRET, 
        { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as SignOptions
    );

    return { accessToken, refreshToken };
}

// return JWT payload userId and role for access token, userId for refresh token
//middleware will call verifyAccessToken, attach payload to req.user for authorization
export function verifyAccessToken(token: string): JwtPayload {
    return verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): { userId: number } {
    return verify(token, env.JWT_REFRESH_SECRET) as { userId: number };
}


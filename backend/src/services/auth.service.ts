// service functions for authentication, including registration, login, and token refreshing
import  { generateTokenPair, verifyRefreshToken}  from "./jwt.service";
import * as userRepository from "../repositories/user.repository";
import { createRefreshToken, findRefreshToken, deleteRefreshToken, deleteRefreshTokensForUser } from "../repositories/refreshToken.repository";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { UserRole } from "@prisma/client";
import { AppError } from "../lib/app.error";

export async function register(email: string, username: string, password: string): 
Promise<{ accessToken: string; refreshToken: string; user: { id: number; email: string; username: string; userRole: UserRole } }> {

    // check if email or username already exists
    const existingEmail = await userRepository.findUserByEmail(email);
    if (existingEmail) {
        throw new AppError("Email already in use", 400);
    }
    const existingUsername = await userRepository.findUserByUsername(username);
    if (existingUsername) {
        throw new AppError("Username already in use", 400);
    }

    // hash password and create user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.createUser(email, username, passwordHash);

    // generate JWT token pair
    const tokens = generateTokenPair(user.id, user.userRole); // default role is USER

    // hash refresh token and store in db
    const refreshTokenHash = crypto
    .createHash("sha256").update(tokens.refreshToken).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await createRefreshToken(user.id, refreshTokenHash, expiresAt);

    return { ...tokens, user: { id: user.id, email: user.email, username: user.username, userRole: user.userRole } };
}


export async function login(email: string, password: string): 
Promise<{ accessToken: string; refreshToken: string; user: { id: number; email: string; username: string; userRole: UserRole } }> {

    // find user by email
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }
    
    // compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    // delete existing refresh tokens for this user before creating new one
    await deleteRefreshTokensForUser(user.id);

    // generate JWT token pair
    const tokens = generateTokenPair(user.id, user.userRole);

    // hash refresh token and store in db
    const refreshTokenHash = crypto
    .createHash("sha256").update(tokens.refreshToken).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await createRefreshToken(user.id, refreshTokenHash, expiresAt);

    return { ...tokens, user: { id: user.id, email: user.email, username: user.username, userRole: user.userRole } };
}

export async function refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. Verify refresh token and get userId
    let payload;
    try {
        payload = verifyRefreshToken(refreshToken);
    } catch (err) {
        throw new AppError("Invalid refresh token", 401);
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    // 2. Attempt to delete the old token (Rotation)
    const storedToken = await findRefreshToken(refreshTokenHash);
    if (!storedToken) {
        await deleteRefreshTokensForUser(payload.userId);
        throw new AppError("Invalid refresh token", 401);
    }
    await deleteRefreshToken(refreshTokenHash);

    // 3. Find user to get their role for the new token
    const user = await userRepository.findUserById(payload.userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    // 4. Generate new pair
    const tokens = generateTokenPair(payload.userId, user.userRole);

    // 5. Store the new hashed refresh token
    const newRefreshTokenHash = crypto.createHash("sha256").update(tokens.refreshToken).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await createRefreshToken(payload.userId, newRefreshTokenHash, expiresAt);

    return tokens;
}

export async function logout(userId: number): Promise<void> {
  await deleteRefreshTokensForUser(userId);
}


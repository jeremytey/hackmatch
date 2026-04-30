import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { AppError } from "../lib/app.error";
import { RegisterSchema, LoginSchema } from "../validators/auth.validator";
import { logger } from "../lib/logger";
import { verifyRefreshToken } from "../services/jwt.service";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const parsedRegistration = RegisterSchema.safeParse(req.body);
        if (!parsedRegistration.success) {
            throw new AppError(parsedRegistration.error.issues[0].message, 400);
        }
        const { email, username, password } = parsedRegistration.data;
        const result = await authService.register(email, username, password);
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none" as const, 
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(201).json({ accessToken: result.accessToken, user: result.user });
        

    } catch (error) {
        logger.error('Register error:', error);
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const parsedLogin = LoginSchema.safeParse(req.body);
        if (!parsedLogin.success) {
            throw new AppError(parsedLogin.error.issues[0].message, 400);
        }
        const {email, password} = parsedLogin.data;

        const result = await authService.login(email, password);
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none" as const,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ accessToken: result.accessToken, user: result.user });
    } catch (error) {
        logger.error('Login error:', error);
        next(error);
    }
}

export async function refreshTokens(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // get refresh token from httpOnly cookie
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new AppError("No refresh token provided", 401);
        }
        const result = await authService.refreshTokens(refreshToken);
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none" as const,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ accessToken: result.accessToken });
    } catch (error) {
        logger.error('Refresh token error:', error);
        next(error);
    }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        await authService.logout(payload.userId);
      } catch {
        // If token verification fails, we still want to clear the cookie and respond with success
      }
    }
    res.clearCookie('refreshToken', { sameSite: "none" as const, secure: process.env.NODE_ENV === "production" });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    next(error);
  }
}
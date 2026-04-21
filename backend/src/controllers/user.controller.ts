// getMe, getProfile, updateMe
import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { AppError } from "../lib/app.error";
import { UpdateUserDto, UpdateUserSchema } from "../validators/user.validator";
import { logger } from "../lib/logger";

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError("User ID missing from token", 401);
        }
        const userProfile = await userService.getUserProfileById(userId);
        res.status(200).json(userProfile);
    } catch (error) {
        logger.error('GetMe error:', error);
        next(error);
    }
}

export async function updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError("User ID missing from token", 401);
        }
        const parsedData = UpdateUserSchema.safeParse(req.body);
        if (!parsedData.success) {
            throw new AppError(parsedData.error.issues[0].message, 400);
        }
        const updateData: UpdateUserDto = parsedData.data;
        const updatedProfile = await userService.updateUserProfile(userId, updateData);
        res.status(200).json(updatedProfile);
    } catch (error) {
        logger.error('UpdateMe error:', error);
        next(error);
    }
}

export async function getUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = parseInt(req.params.userId as string, 10);
        if (isNaN(userId)) {
            throw new AppError("Invalid user ID", 400);
        }
        const userProfile = await userService.getUserProfileById(userId);
        res.status(200).json(userProfile);
    } catch (error) {
        logger.error('GetUserProfile error:', error);
        next(error);
    }
}
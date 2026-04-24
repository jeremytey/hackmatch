// getAllHackathons, createHackathon, editHackathonDetails, viewHackathonDetails, joinHackathon
import { Request, Response, NextFunction } from "express";
import * as hackathonService from "../services/hackathon.service";
import { AppError } from "../lib/app.error";
import { CreateHackathonDto, UpdateHackathonDto } from "../validators/hackathon.validator";
import { CreateHackathonSchema, UpdateHackathonSchema } from "../validators/hackathon.validator";
import { logger } from "../lib/logger";

export async function getAllHackathons(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const hackathons = await hackathonService.getAllHackathons();
        if (!hackathons) {
            throw new AppError("Failed to retrieve hackathons", 500);
        }
        res.status(200).json(hackathons);
    } catch (error) {
        logger.error('GetAllHackathons error:', error);
        next(error);
    }
}

// ideal usage of schema and DTO in controller: validate request body with schema, then pass validated data to service layer as DTO
export async function createHackathon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError("User ID missing from token", 401);
        }
        const parsedData = CreateHackathonSchema.safeParse(req.body);
        if (!parsedData.success) {
            throw new AppError(parsedData.error.issues[0].message, 400);
        }
        const hackathonData: CreateHackathonDto = parsedData.data;
        const newHackathon = await hackathonService.createHackathon(hackathonData, userId);
        res.status(201).json(newHackathon);
    } catch (error) {
        logger.error('CreateHackathon error:', error);
        next(error);
    }
}

export async function editHackathonDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const hackathonId = parseInt(req.params.hackathonId as string, 10);
        if (isNaN(hackathonId)) {
            throw new AppError("Invalid hackathon ID", 400);
        }
        const parsedData = UpdateHackathonSchema.safeParse(req.body);
        if (!parsedData.success) {
            throw new AppError(parsedData.error.issues[0].message, 400);
        }
        const hackathonData: UpdateHackathonDto = parsedData.data;
        const updatedHackathon = await hackathonService.updateHackathon(hackathonId, hackathonData);
        res.status(200).json(updatedHackathon);
    } catch (error) {
        logger.error('EditHackathonDetails error:', error);
        next(error);
    }
}

export async function viewHackathonDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const hackathonId = parseInt(req.params.hackathonId as string, 10);
        if (isNaN(hackathonId)) {
            throw new AppError("Invalid hackathon ID", 400);
        }
        const hackathon = await hackathonService.getHackathonById(hackathonId);
        res.status(200).json(hackathon);
    } catch (error) {
        logger.error('ViewHackathonDetails error:', error);
        next(error);
    }
}

export async function joinHackathon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError("User ID missing from token", 401);
        }
        const hackathonId = parseInt(req.params.hackathonId as string, 10);
        if (isNaN(hackathonId)) {
            throw new AppError("Invalid hackathon ID", 400);
        }
        const participant = await hackathonService.registerParticipant(userId, hackathonId);
        res.status(201).json(participant);
    } catch (error) {
        logger.error('JoinHackathon error:', error);
        next(error);
    }
}
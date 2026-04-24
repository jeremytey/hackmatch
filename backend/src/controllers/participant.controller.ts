// listParticipants, updateParticipantStatus, leaveHackathon(deleteParticipant)
import { Request, Response, NextFunction } from "express";
import * as participantService from "../services/hackathon.service";
import { AppError } from "../lib/app.error";
import { ParticipantFilterDto, UpdateTeamStatusDto } from "../validators/hackathon.validator";
import { ParticipantFilterSchema, UpdateTeamStatusSchema } from "../validators/hackathon.validator";
import { HackathonParticipant } from "@prisma/client";
import { logger } from "../lib/logger";


export async function listParticipants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const hackathonId = parseInt(req.params.hackathonId as string, 10);
        if (isNaN(hackathonId)) {
            throw new AppError("Invalid hackathon ID", 400);
        }
        const queryData = { ...req.query };
        if (typeof queryData.skills === 'string') {
            queryData.skills = queryData.skills.split(',').map((skill: string) => skill.trim());
        }
        const parsedFilters = ParticipantFilterSchema.safeParse(queryData);
        if (!parsedFilters.success) {
            throw new AppError(parsedFilters.error.issues[0].message, 400);
        }
        const filters: ParticipantFilterDto = parsedFilters.data;
        const participants = await participantService.listParticipants(hackathonId, filters);
        res.status(200).json(participants);
    } catch (error) {
        logger.error('ListParticipants error:', error);
        next(error);
    }
}

export async function updateParticipantStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const hackathonId = parseInt(req.params.hackathonId as string, 10);
        if (isNaN(hackathonId)) {
            throw new AppError("Invalid hackathon ID", 400);
        }
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError("User ID missing from token", 401);
        }
        const parsedData = UpdateTeamStatusSchema.safeParse(req.body);
        if (!parsedData.success) {
            throw new AppError(parsedData.error.issues[0].message, 400);
        }
        const updateData: UpdateTeamStatusDto = parsedData.data;
        const updatedParticipant: HackathonParticipant = await participantService.updateParticipantStatus(userId, hackathonId, updateData);
        res.status(200).json(updatedParticipant);
    } catch (error) {
        logger.error('UpdateParticipantStatus error:', error);
        next(error);
    }
}

export async function leaveHackathon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const hackathonId = parseInt(req.params.hackathonId as string, 10);
        if (isNaN(hackathonId)) {
            throw new AppError("Invalid hackathon ID", 400);
        }
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError("User ID missing from token", 401);
        }
        await participantService.deleteParticipant(userId, hackathonId);
        res.status(204).send();
    } catch (error) {
        logger.error('LeaveHackathon error:', error);
        next(error);
    }
}
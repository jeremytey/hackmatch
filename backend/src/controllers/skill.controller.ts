import { Request, Response, NextFunction } from 'express';
import * as skillService from '../services/skill.service';
import { AppError } from '../lib/app.error';
import { logger } from '../lib/logger';

export async function getAllSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const skills = await skillService.getAllSkills();
        if (!skills) {
            throw new AppError("Failed to retrieve skills", 500);
        }
        res.status(200).json(skills);
    } catch (error) {
        logger.error('GetAllSkills error:', error);
        next(error);
    }
}
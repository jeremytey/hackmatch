// listParticipants, updateParticipantStatus, leaveHackathon(deleteParticipant)
import { Request, Response, NextFunction } from "express";
import * as participantService from "../services/hackathon.service";
import { AppError } from "../lib/app.error";
import { ParticipantFilterDto, UpdateTeamStatusDto } from "../validators/hackathon.validator";
import { ParticipantFilterSchema, UpdateTeamStatusSchema } from "../validators/hackathon.validator";
import { HackathonParticipant } from "@prisma/client";
import { logger } from "../lib/logger";
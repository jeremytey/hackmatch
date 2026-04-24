// getAllHackathons, createHackathon, editHackathonDetails, viewHackathonDetails, joinHackathon
import { Request, Response, NextFunction } from "express";
import * as hackathonService from "../services/hackathon.service";
import { AppError } from "../lib/app.error";
import { CreateHackathonDto, UpdateHackathonDto } from "../validators/hackathon.validator";
import { CreateHackathonSchema, UpdateHackathonSchema } from "../validators/hackathon.validator";
import { logger } from "../lib/logger";


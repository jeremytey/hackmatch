"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinHackathon = joinHackathon;
exports.listParticipants = listParticipants;
exports.updateParticipantStatus = updateParticipantStatus;
exports.leaveHackathon = leaveHackathon;
const participantService = __importStar(require("../services/hackathon.service"));
const app_error_1 = require("../lib/app.error");
const hackathon_validator_1 = require("../validators/hackathon.validator");
const logger_1 = require("../lib/logger");
async function joinHackathon(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new app_error_1.AppError("User ID missing from token", 401);
        }
        const hackathonId = parseInt(req.params.hackathonId, 10);
        if (isNaN(hackathonId)) {
            throw new app_error_1.AppError("Invalid hackathon ID", 400);
        }
        const participant = await participantService.registerParticipant(userId, hackathonId);
        res.status(201).json(participant);
    }
    catch (error) {
        logger_1.logger.error('JoinHackathon error:', error);
        next(error);
    }
}
async function listParticipants(req, res, next) {
    try {
        const hackathonId = parseInt(req.params.hackathonId, 10);
        if (isNaN(hackathonId)) {
            throw new app_error_1.AppError("Invalid hackathon ID", 400);
        }
        const queryData = { ...req.query };
        if (typeof queryData.skills === 'string') {
            queryData.skills = queryData.skills.split(',').map((skill) => skill.trim());
        }
        const parsedFilters = hackathon_validator_1.ParticipantFilterSchema.safeParse(queryData);
        if (!parsedFilters.success) {
            throw new app_error_1.AppError(parsedFilters.error.issues[0].message, 400);
        }
        const filters = parsedFilters.data;
        const participants = await participantService.listParticipants(hackathonId, filters);
        res.status(200).json(participants);
    }
    catch (error) {
        logger_1.logger.error('ListParticipants error:', error);
        next(error);
    }
}
async function updateParticipantStatus(req, res, next) {
    try {
        const hackathonId = parseInt(req.params.hackathonId, 10);
        if (isNaN(hackathonId)) {
            throw new app_error_1.AppError("Invalid hackathon ID", 400);
        }
        const userId = req.user?.userId;
        if (!userId) {
            throw new app_error_1.AppError("User ID missing from token", 401);
        }
        const parsedData = hackathon_validator_1.UpdateTeamStatusSchema.safeParse(req.body);
        if (!parsedData.success) {
            throw new app_error_1.AppError(parsedData.error.issues[0].message, 400);
        }
        const updateData = parsedData.data;
        const updatedParticipant = await participantService.updateParticipantStatus(userId, hackathonId, updateData);
        res.status(200).json(updatedParticipant);
    }
    catch (error) {
        logger_1.logger.error('UpdateParticipantStatus error:', error);
        next(error);
    }
}
async function leaveHackathon(req, res, next) {
    try {
        const hackathonId = parseInt(req.params.hackathonId, 10);
        if (isNaN(hackathonId)) {
            throw new app_error_1.AppError("Invalid hackathon ID", 400);
        }
        const userId = req.user?.userId;
        if (!userId) {
            throw new app_error_1.AppError("User ID missing from token", 401);
        }
        await participantService.deleteParticipant(userId, hackathonId);
        res.status(204).send();
    }
    catch (error) {
        logger_1.logger.error('LeaveHackathon error:', error);
        next(error);
    }
}

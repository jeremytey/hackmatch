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
exports.getAllHackathons = getAllHackathons;
exports.createHackathon = createHackathon;
exports.editHackathonDetails = editHackathonDetails;
exports.viewHackathonDetails = viewHackathonDetails;
exports.deleteHackathon = deleteHackathon;
const hackathonService = __importStar(require("../services/hackathon.service"));
const app_error_1 = require("../lib/app.error");
const hackathon_validator_1 = require("../validators/hackathon.validator");
const logger_1 = require("../lib/logger");
async function getAllHackathons(req, res, next) {
    try {
        const hackathons = await hackathonService.getAllHackathons();
        if (!hackathons) {
            throw new app_error_1.AppError("Failed to retrieve hackathons", 500);
        }
        res.status(200).json(hackathons);
    }
    catch (error) {
        logger_1.logger.error('GetAllHackathons error:', error);
        next(error);
    }
}
// ideal usage of schema and DTO in controller: validate request body with schema, then pass validated data to service layer as DTO
async function createHackathon(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new app_error_1.AppError("User ID missing from token", 401);
        }
        const parsedData = hackathon_validator_1.CreateHackathonSchema.safeParse(req.body);
        if (!parsedData.success) {
            throw new app_error_1.AppError(parsedData.error.issues[0].message, 400);
        }
        const hackathonData = parsedData.data;
        const newHackathon = await hackathonService.createHackathon(hackathonData, userId);
        res.status(201).json(newHackathon);
    }
    catch (error) {
        logger_1.logger.error('CreateHackathon error:', error);
        next(error);
    }
}
async function editHackathonDetails(req, res, next) {
    try {
        const hackathonId = parseInt(req.params.hackathonId, 10);
        if (isNaN(hackathonId)) {
            throw new app_error_1.AppError("Invalid hackathon ID", 400);
        }
        const parsedData = hackathon_validator_1.UpdateHackathonSchema.safeParse(req.body);
        if (!parsedData.success) {
            throw new app_error_1.AppError(parsedData.error.issues[0].message, 400);
        }
        const hackathonData = parsedData.data;
        const updatedHackathon = await hackathonService.updateHackathon(hackathonId, hackathonData);
        res.status(200).json(updatedHackathon);
    }
    catch (error) {
        logger_1.logger.error('EditHackathonDetails error:', error);
        next(error);
    }
}
async function viewHackathonDetails(req, res, next) {
    try {
        const hackathonId = parseInt(req.params.hackathonId, 10);
        if (isNaN(hackathonId)) {
            throw new app_error_1.AppError("Invalid hackathon ID", 400);
        }
        const hackathon = await hackathonService.getHackathonById(hackathonId);
        res.status(200).json(hackathon);
    }
    catch (error) {
        logger_1.logger.error('ViewHackathonDetails error:', error);
        next(error);
    }
}
async function deleteHackathon(req, res, next) {
    try {
        const hackathonId = parseInt(req.params.hackathonId, 10);
        if (isNaN(hackathonId)) {
            throw new app_error_1.AppError("Invalid hackathon ID", 400);
        }
        await hackathonService.deleteHackathon(hackathonId);
        res.status(204).send();
    }
    catch (error) {
        logger_1.logger.error('DeleteHackathon error:', error);
        next(error);
    }
}

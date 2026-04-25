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
exports.createHackathon = createHackathon;
exports.updateHackathon = updateHackathon;
exports.deleteHackathon = deleteHackathon;
exports.getHackathonById = getHackathonById;
exports.getAllHackathons = getAllHackathons;
exports.registerParticipant = registerParticipant;
exports.updateParticipantStatus = updateParticipantStatus;
exports.deleteParticipant = deleteParticipant;
exports.listParticipants = listParticipants;
// handle logic related to hackathons, such as creating, updating, deleting hackathons, and managing participants
// without directly handling HTTP requests or responses 
const hackathonRepository = __importStar(require("../repositories/hackathon.repository"));
const participantRepository = __importStar(require("../repositories/participant.repository"));
const app_error_1 = require("../lib/app.error");
async function createHackathon(data, createdBy) {
    const hackathon = await hackathonRepository.createHackathon(data, createdBy);
    if (!hackathon) {
        throw new app_error_1.AppError("Failed to create hackathon", 500);
    }
    return hackathon;
}
async function updateHackathon(id, data) {
    const existingHackathon = await hackathonRepository.findHackathonById(id);
    if (!existingHackathon) {
        throw new app_error_1.AppError("Hackathon not found", 404);
    }
    const updatedHackathon = await hackathonRepository.updateHackathon(id, data);
    if (!updatedHackathon) {
        throw new app_error_1.AppError("Failed to update hackathon", 500);
    }
    return updatedHackathon;
}
async function deleteHackathon(id) {
    const existingHackathon = await hackathonRepository.findHackathonById(id);
    if (!existingHackathon) {
        throw new app_error_1.AppError("Hackathon not found", 404);
    }
    await hackathonRepository.deleteHackathon(id);
}
async function getHackathonById(id) {
    const hackathon = await hackathonRepository.findHackathonById(id);
    if (!hackathon)
        throw new app_error_1.AppError("Hackathon not found", 404);
    return hackathon;
}
async function getAllHackathons() {
    return await hackathonRepository.getAllHackathons();
}
// Participant management functions: registerParticipant, updateParticipantStatus, listParticipants, deleteParticipant
async function registerParticipant(userId, hackathonId) {
    const existingParticipant = await participantRepository.findParticipant(userId, hackathonId);
    if (existingParticipant) {
        throw new app_error_1.AppError("User is already registered for this hackathon", 400);
    }
    const hackathon = await hackathonRepository.findHackathonById(hackathonId);
    if (!hackathon) {
        throw new app_error_1.AppError("Hackathon not found", 404);
    }
    if (hackathon.registrationDeadline < new Date()) {
        throw new app_error_1.AppError("Registration deadline has passed", 400);
    }
    return await participantRepository.createParticipant(userId, hackathonId);
}
async function updateParticipantStatus(userId, hackathonId, data) {
    const existingParticipant = await participantRepository.findParticipant(userId, hackathonId);
    if (!existingParticipant) {
        throw new app_error_1.AppError("Participant not found", 404);
    }
    const updatedParticipant = await participantRepository.updateParticipantTeamStatus(userId, hackathonId, data);
    if (!updatedParticipant) {
        throw new app_error_1.AppError("Failed to update participant status", 500);
    }
    return updatedParticipant;
}
async function deleteParticipant(userId, hackathonId) {
    const existingParticipant = await participantRepository.findParticipant(userId, hackathonId);
    if (!existingParticipant) {
        throw new app_error_1.AppError("Participant not found", 404);
    }
    await participantRepository.deleteParticipant(userId, hackathonId);
}
async function listParticipants(hackathonId, filters) {
    return await participantRepository.listParticipants(hackathonId, filters);
}

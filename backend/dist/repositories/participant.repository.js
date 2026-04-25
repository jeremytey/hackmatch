"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParticipant = createParticipant;
exports.findParticipant = findParticipant;
exports.updateParticipantTeamStatus = updateParticipantTeamStatus;
exports.deleteParticipant = deleteParticipant;
exports.listParticipants = listParticipants;
// prisma functions for hackathon participant table - create participant, find participant, update participant, delete participant, list participants
const prisma_1 = __importDefault(require("../lib/prisma"));
const client_1 = require("@prisma/client");
// Create a new hackathon participant
async function createParticipant(userId, hackathonId) {
    const participant = await prisma_1.default.hackathonParticipant.create({
        data: {
            userId,
            hackathonId,
            teamStatus: client_1.TeamStatus.LOOKING, // Default team status when a participant registers
        },
    });
    return participant;
}
// Find a hackathon participant by user ID and hackathon ID
// composite unique key: userId + hackathonId
async function findParticipant(userId, hackathonId) {
    const participant = await prisma_1.default.hackathonParticipant.findUnique({
        where: {
            userId_hackathonId: {
                userId,
                hackathonId,
            },
        },
    });
    return participant;
}
// Update a participant's team status
async function updateParticipantTeamStatus(userId, hackathonId, data) {
    const updatedParticipant = await prisma_1.default.hackathonParticipant.update({
        where: {
            userId_hackathonId: {
                userId,
                hackathonId,
            },
        },
        data: {
            teamStatus: data.teamStatus,
        },
    });
    return updatedParticipant;
}
// Delete a hackathon participant
async function deleteParticipant(userId, hackathonId) {
    await prisma_1.default.hackathonParticipant.delete({
        where: {
            userId_hackathonId: {
                userId,
                hackathonId,
            },
        },
    });
}
// List participants for a hackathon with optional filters
async function listParticipants(hackathonId, filters) {
    // destructure filters object and set default pagination values
    const { role, teamStatus, skills, university, page = 1, limit = 20 } = filters;
    // where clause for specific hackathon and optional filters for user and participant fields
    const whereClause = { hackathonId };
    const userFilters = {};
    if (role)
        userFilters.role = role;
    // build where clause for team status, university, and skills filters
    if (teamStatus)
        whereClause.teamStatus = teamStatus;
    if (university)
        userFilters.university = { contains: university, mode: "insensitive" };
    if (skills && skills.length > 0) {
        userFilters.skills = {
            some: {
                skill: {
                    name: { in: skills },
                },
            },
        };
    } // some means at least one of the user's skills matches the filter criteria (many-to-many relationship between users and skills)
    // Only add the user filter if at least one filter is provided to avoid unnecessary joins
    if (Object.keys(userFilters).length > 0) {
        whereClause.user = userFilters;
    }
    const participants = await prisma_1.default.hackathonParticipant.findMany({
        where: whereClause,
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    university: true,
                    yearOfStudy: true,
                    role: true,
                    bio: true,
                    githubURL: true,
                    linkedinURL: true,
                    preferredContact: true,
                    avatarURL: true,
                    skills: {
                        select: {
                            skill: {
                                select: {
                                    id: true,
                                    name: true,
                                    category: true,
                                }
                            }
                        },
                    },
                },
            },
        },
        skip: (page - 1) * limit,
        take: limit,
    });
    // iterate through participants and map skills
    return participants.map(p => ({
        ...p,
        user: {
            ...p.user,
            skills: p.user.skills.map(s => s.skill),
        }
    }));
}

// prisma functions for hackathon participant table - create participant, find participant, update participant, delete participant, list participants
import prisma from "../lib/prisma";
import { HackathonParticipant, Prisma, TeamStatus, SkillCategory, Role } from "@prisma/client";
import { ParticipantFilterDto, UpdateTeamStatusDto } from "../validators/hackathon.validator";

// Define a type for participant profile that includes user information and skills
export type ParticipantProfile = {
    id: number;
    hackathonId: number;
    teamStatus: TeamStatus;
    user: {
        id: number;
        username: string;
        university: string | null;
        yearOfStudy: number | null;
        role: Role | null;
        bio: string | null;
        githubURL: string | null;
        linkedinURL: string | null;
        preferredContact: string | null;
        avatarURL: string | null;
        skills: {
            id: number;
            name: string;
            category: SkillCategory;
        }[]; 
    };
}

// Create a new hackathon participant
export async function createParticipant(userId: number, hackathonId: number): Promise<HackathonParticipant> {
    const participant = await prisma.hackathonParticipant.create({
        data: {
            userId,
            hackathonId,
            teamStatus: TeamStatus.LOOKING, // Default team status when a participant registers
        },
    });
    return participant;
}

// Find a hackathon participant by user ID and hackathon ID
// composite unique key: userId + hackathonId
export async function findParticipant(userId: number, hackathonId: number) {
    const participant = await prisma.hackathonParticipant.findUnique({
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
export async function updateParticipantTeamStatus(userId: number, hackathonId: number, data: UpdateTeamStatusDto) {
    const updatedParticipant = await prisma.hackathonParticipant.update({
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
export async function deleteParticipant(userId: number, hackathonId: number): Promise<void> {
    await prisma.hackathonParticipant.delete({
        where: {
            userId_hackathonId: {
                userId,
                hackathonId,
            },
        },
    });
}

// List participants for a hackathon with optional filters
export async function listParticipants(hackathonId: number, filters: ParticipantFilterDto) {
    // destructure filters object and set default pagination values
    const { role, teamStatus, skills, university, page = 1, limit = 20 } = filters;
    
    // where clause for specific hackathon and optional filters for user and participant fields
    const whereClause: Prisma.HackathonParticipantWhereInput = { hackathonId };
    const userFilters: Prisma.UserWhereInput = {};
    if (role) userFilters.role = role;

    // build where clause for team status, university, and skills filters
    if (teamStatus) whereClause.teamStatus = teamStatus;
    if (university) userFilters.university = { contains: university, mode: "insensitive" };
    if (skills && skills.length > 0) {
        userFilters.skills = {
            some: {
                skill:{
                name: { in: skills },
                },
            },
        };
    } // some means at least one of the user's skills matches the filter criteria (many-to-many relationship between users and skills)

    // Only add the user filter if at least one filter is provided to avoid unnecessary joins
    if (Object.keys(userFilters).length > 0) {
    whereClause.user = userFilters;
    }

    const participants = await prisma.hackathonParticipant.findMany({
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
                            skill:{
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
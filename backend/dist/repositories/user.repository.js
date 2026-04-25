"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.findUserByUsername = findUserByUsername;
exports.findUserById = findUserById;
exports.createUser = createUser;
exports.getUserProfileById = getUserProfileById;
exports.updateUser = updateUser;
// prisma functions for user table - find by email/username/id, create user
const prisma_1 = __importDefault(require("../lib/prisma"));
async function findUserByEmail(email) {
    const user = await prisma_1.default.user.findUnique({
        where: { email },
    });
    return user;
}
async function findUserByUsername(username) {
    const user = await prisma_1.default.user.findUnique({
        where: { username },
    });
    return user;
}
async function findUserById(id) {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
    });
    return user;
}
async function createUser(email, username, passwordHash) {
    const user = await prisma_1.default.user.create({
        data: {
            email,
            username,
            passwordHash,
        },
    });
    return user;
}
// Get user profile by ID, including their skills
async function getUserProfileById(id) {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
        // Select user fields and include skills with their details
        select: {
            id: true,
            university: true,
            yearOfStudy: true,
            role: true,
            bio: true,
            githubURL: true,
            linkedinURL: true,
            preferredContact: true,
            avatarURL: true,
            createdAt: true,
            updatedAt: true,
            // nested select to get skill details through the userSkills relation
            skills: {
                select: {
                    skill: {
                        select: {
                            id: true,
                            name: true,
                            category: true,
                        },
                    },
                },
            },
        },
    });
    if (!user)
        return null;
    return {
        ...user,
        skills: user.skills.map((s) => ({ id: s.skill.id, name: s.skill.name, category: s.skill.category })), // Map to return only skill details
    };
}
async function updateUser(id, data) {
    const { skills, ...scalarFields } = data; // Extract skills and scalar fields
    const updatedUser = await prisma_1.default.user.update({
        where: { id },
        data: {
            ...scalarFields,
            skills: skills !== undefined ? {
                deleteMany: {}, // Remove existing skills only if new skills are provided (not undefined)
                create: skills.map((skillId) => ({ skillId })), // Add new skills
            } : undefined,
        },
        select: {
            id: true,
            university: true,
            yearOfStudy: true,
            role: true,
            bio: true,
            githubURL: true,
            linkedinURL: true,
            preferredContact: true,
            avatarURL: true,
            createdAt: true,
            updatedAt: true,
            skills: {
                select: {
                    skill: {
                        select: {
                            id: true,
                            name: true,
                            category: true,
                        },
                    },
                },
            },
        },
    });
    return {
        ...updatedUser,
        skills: updatedUser.skills.map((s) => ({ id: s.skill.id, name: s.skill.name, category: s.skill.category })), // Map to return only skill details
    };
}

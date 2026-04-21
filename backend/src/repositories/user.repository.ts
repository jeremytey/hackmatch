// prisma functions for user table - find by email/username/id, create user
import prisma from "../lib/prisma";
import { UpdateUserDto } from "../validators/user.validator";
import { Role, SkillCategory, User } from "@prisma/client"; 

// Define a type for the user profile that includes the user's skills
export type UserProfile = {
    id: number;
    university: string | null;
    yearOfStudy: number | null;
    role: Role | null;
    bio: string | null;
    githubURL: string | null;
    linkedinURL: string | null;
    preferredContact: string | null;
    avatarURL: string | null;
    createdAt: Date;
    updatedAt: Date;
    skills: {
        id: number;
        name: string;
        category: SkillCategory;
    }[]; 
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    return user;
}

export async function findUserByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { username },
    });
    return user;
}

export async function findUserById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { id },
    });
    return user;
}

export async function createUser(email: string, username: string, passwordHash: string): Promise<User> {
    const user = await prisma.user.create({
        data: {
            email,
            username,
            passwordHash,
        },
    });
    return user;
}

// Get user profile by ID, including their skills
export async function getUserProfileById(id: number): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
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
    if (!user) return null;
    return {
        ...user,
        skills: user.skills.map((s) => ({id: s.skill.id, name: s.skill.name, category: s.skill.category})), // Map to return only skill details
    }
}
export async function updateUser(id: number, data: UpdateUserDto): Promise<UserProfile> {
    const { skills, ...scalarFields } = data; // Extract skills and scalar fields
    const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            ...scalarFields,
            skills: skills !== undefined ? { // if user didnt send skills array, undefined passed to prisma
                deleteMany: {}, // Remove existing skills only if new skills are provided (not undefined)
                create: skills.map((skillId: number) => ({ skillId })), // Add new skills
            }: undefined,
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
        skills: updatedUser.skills.map((s) => ({id: s.skill.id, name: s.skill.name, category: s.skill.category})), // Map to return only skill details
    }
}




// prisma functions for hackathon table - find by id, create hackathon, update hackathon, delete hackathon, list hackathons
import prisma from "../lib/prisma";
import { CreateHackathonDto, UpdateHackathonDto } from "../validators/hackathon.validator";
import { Hackathon } from "@prisma/client";


// Find hackathon by ID
export async function findHackathonById(id: number): Promise<Hackathon | null> {
    const hackathon = await prisma.hackathon.findUnique({
        where: { id },
    });
    return hackathon;
}

// Create a new hackathon
export async function createHackathon(data: CreateHackathonDto, createdBy: number): Promise<Hackathon> {
    const hackathon = await prisma.hackathon.create({
        data: {
            ...data,
            createdBy,
        },
    });
    return hackathon;
}

// Update an existing hackathon
export async function updateHackathon(id: number, data: UpdateHackathonDto): Promise<Hackathon | null> {
    const hackathon = await prisma.hackathon.update({
        where: { id },
        data,
    });
    return hackathon;
}

// Delete a hackathon
export async function deleteHackathon(id: number): Promise<void> {
    await prisma.hackathon.delete({
        where: { id },
    });
}

// List all hackathons 
export async function getAllHackathons(): Promise<Hackathon[]> {
    const hackathons = await prisma.hackathon.findMany({
        orderBy: { createdAt: "asc" },
    });
    return hackathons;
}
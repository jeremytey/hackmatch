// handle logic related to hackathons, such as creating, updating, deleting hackathons, and managing participants
// without directly handling HTTP requests or responses 
import * as hackathonRepository from '../repositories/hackathon.repository';
import * as participantRepository from '../repositories/participant.repository';
import { ParticipantProfile } from '../repositories/participant.repository';
import { CreateHackathonDto, UpdateHackathonDto, ParticipantFilterDto, UpdateTeamStatusDto } from '../validators/hackathon.validator';
import { AppError } from '../lib/app.error';
import { Hackathon, HackathonParticipant } from '@prisma/client';

export async function createHackathon(data: CreateHackathonDto, createdBy: number)
:Promise<Hackathon> {
    const hackathon = await hackathonRepository.createHackathon(data, createdBy);
    if (!hackathon) {
        throw new AppError("Failed to create hackathon", 500);
    }
    return hackathon;
}

export async function updateHackathon(id: number, data: UpdateHackathonDto): Promise<Hackathon> {
    const existingHackathon = await hackathonRepository.findHackathonById(id);
    if (!existingHackathon) {
        throw new AppError("Hackathon not found", 404);
    }
    const updatedHackathon = await hackathonRepository.updateHackathon(id, data);
    if (!updatedHackathon) {
        throw new AppError("Failed to update hackathon", 500);
    }
    return updatedHackathon;
}

export async function deleteHackathon(id: number): Promise<void> {
    const existingHackathon = await hackathonRepository.findHackathonById(id);
    if (!existingHackathon) {
        throw new AppError("Hackathon not found", 404);
    }
    await hackathonRepository.deleteHackathon(id);
}

export async function getHackathonById(id:number): Promise<Hackathon>{
    const hackathon = await hackathonRepository.findHackathonById(id);
    if (!hackathon) throw new AppError("Hackathon not found", 404);
    return hackathon;
}

export async function getAllHackathons(): Promise<Hackathon[]> {
    return await hackathonRepository.getAllHackathons();
}

// Participant management functions: registerParticipant, updateParticipantStatus, listParticipants, deleteParticipant
export async function registerParticipant(userId: number, hackathonId: number): Promise<HackathonParticipant> {
    const existingParticipant = await participantRepository.findParticipant(userId, hackathonId);
    if (existingParticipant) {
        throw new AppError("User is already registered for this hackathon", 400);
    }

    const hackathon = await hackathonRepository.findHackathonById(hackathonId);
    if (!hackathon) {
        throw new AppError("Hackathon not found", 404);
    }

    if (hackathon.registrationDeadline < new Date()) {
        throw new AppError("Registration deadline has passed", 400);
    }
    return await participantRepository.createParticipant(userId, hackathonId);    
}

export async function updateParticipantStatus(userId: number, hackathonId: number, data: UpdateTeamStatusDto): Promise<HackathonParticipant> {
    const existingParticipant = await participantRepository.findParticipant(userId, hackathonId);
    if (!existingParticipant) {
        throw new AppError("Participant not found", 404);
    }
    const updatedParticipant = await participantRepository.updateParticipantTeamStatus(userId, hackathonId, data);
    if (!updatedParticipant) {
        throw new AppError("Failed to update participant status", 500);
    }
    return updatedParticipant;
}

export async function deleteParticipant(userId: number, hackathonId: number): Promise<void> {
    const existingParticipant = await participantRepository.findParticipant(userId, hackathonId);
    if (!existingParticipant) {
        throw new AppError("Participant not found", 404);
    }
    await participantRepository.deleteParticipant(userId, hackathonId);
}

export async function listParticipants(hackathonId: number, filters: ParticipantFilterDto): Promise<ParticipantProfile[]> {
    return await participantRepository.listParticipants(hackathonId, filters);
}
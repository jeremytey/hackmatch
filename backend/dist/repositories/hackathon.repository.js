"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findHackathonById = findHackathonById;
exports.createHackathon = createHackathon;
exports.updateHackathon = updateHackathon;
exports.deleteHackathon = deleteHackathon;
exports.getAllHackathons = getAllHackathons;
// prisma functions for hackathon table - find by id, create hackathon, update hackathon, delete hackathon, list hackathons
const prisma_1 = __importDefault(require("../lib/prisma"));
// Find hackathon by ID
async function findHackathonById(id) {
    const hackathon = await prisma_1.default.hackathon.findUnique({
        where: { id },
    });
    return hackathon;
}
// Create a new hackathon
async function createHackathon(data, createdBy) {
    const hackathon = await prisma_1.default.hackathon.create({
        data: {
            ...data,
            createdBy,
        },
    });
    return hackathon;
}
// Update an existing hackathon
async function updateHackathon(id, data) {
    const hackathon = await prisma_1.default.hackathon.update({
        where: { id },
        data,
    });
    return hackathon;
}
// Delete a hackathon
async function deleteHackathon(id) {
    await prisma_1.default.hackathon.delete({
        where: { id },
    });
}
// List all hackathons 
async function getAllHackathons() {
    const hackathons = await prisma_1.default.hackathon.findMany({
        orderBy: { createdAt: "desc" },
    });
    return hackathons;
}

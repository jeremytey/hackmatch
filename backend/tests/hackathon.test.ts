import request from "supertest";
import app from "../src/app";
import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma";
import { UserRole } from "@prisma/client";
import { describe, expect, test, beforeEach, afterAll } from "@jest/globals";

// Clear the database before each test
describe("Hackathon & Participant API Tests", () => {
    
    let adminToken: string;
    let userToken: string;
    let hackathonId: number;
    const password = "password123";
    
    beforeEach(async () => {
        // Clear relevant tables before each test to ensure a clean state
        await prisma.hackathonParticipant.deleteMany();
        await prisma.hackathon.deleteMany();
        await prisma.refreshToken.deleteMany();
        await prisma.userSkill.deleteMany();
        await prisma.user.deleteMany();
    
        // setup users via prisma (with same password for simplicity)
        const hashedPassword = await bcrypt.hash(password, 10);
        const adminUser = await prisma.user.create({
            data: { username: 'admin', email: 'admin@test.com', passwordHash: hashedPassword }
        });
        const user = await prisma.user.create({
            data: { username: 'user1', email: 'user1@test.com', passwordHash: hashedPassword }
        });

        // update admin user role to ADMIN
        await prisma.user.update({
            where: { id: adminUser.id },
            data: { userRole: UserRole.ADMIN }
        });

        // login admin and user to get tokens
        const adminLogin = await request(app).post("/auth/login").send({ email: "admin@test.com", password });
        const userLogin = await request(app).post("/auth/login").send({ email: "user1@test.com", password });
        adminToken = `Bearer ${adminLogin.body.accessToken}`;
        userToken = `Bearer ${userLogin.body.accessToken}`;

        // create a test hackathon via prisma using admin user
        const hackResponse = await request(app)
            .post("/hackathons")
            .set("Authorization", adminToken)
            .send({
                name: "Varsity Hack 2026",
                description: "Sunway's flagship event",
                externalUrl: "https://varsityhack.com",
                startDate: new Date(Date.now() + 86400000).toISOString(), 
                endDate: new Date(Date.now() + 172800000).toISOString(),
                registrationDeadline: new Date(Date.now() + 43200000).toISOString(),
                maxTeamSize: 4
            });

        hackathonId = hackResponse.body.id;
    });

    // Close the database connection after all tests
    afterAll(async () => {
        await prisma.$disconnect();
    });

    // ===== Happy Path Tests =====
    // 1. Test viewing all hackathons
    describe("GET /hackathons", () => {
        test("should return a list of all hackathons", async () => {
            const res = await request(app)
                .get("/hackathons")
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0]).toHaveProperty("id");
            expect(res.body[0]).toHaveProperty("name", "Varsity Hack 2026");
        });
    });

    // 2. Test creating a hackathon (admin only)
    describe("POST /hackathons", () => {
        test("should allow admin to create a hackathon", async () => {
            const res = await request(app)
                .post("/hackathons")
                .set("Authorization", adminToken)
                .send({
                    name: "Test Hackathon",
                    description: "A test hackathon",
                    externalUrl: "https://testhack.com",
                    startDate: new Date(Date.now() + 86400000).toISOString(), 
                    endDate: new Date(Date.now() + 172800000).toISOString(),
                    registrationDeadline: new Date(Date.now() + 43200000).toISOString(),
                    maxTeamSize: 4
                });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("id");
            expect(res.body).toHaveProperty("name", "Test Hackathon");
        });
});

    // 3. Test viewing hackathon details
    describe("GET /hackathons/:hackathonId", () => {
        test("should return hackathon details", async () => {
            const res = await request(app)
                .get(`/hackathons/${hackathonId}`)
                .set("Authorization", userToken);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("id", hackathonId);
            expect(res.body).toHaveProperty("name", "Varsity Hack 2026");
        });
})

    // 4. Test joining a hackathon






});
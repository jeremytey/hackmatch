import request from 'supertest';
import app from '../src/app';
import prisma from '../src/lib/prisma';
import { describe, expect, test, beforeEach, afterAll } from '@jest/globals';

describe('Skill API Tests', () => {
    beforeEach(async () => {
        // Clear the skills table before each test to ensure a clean state
        await prisma.skill.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('GET /skills', () => {
        test('should return all skills', async () => {
            // First, create some skills in the database
            await prisma.skill.createMany({
                data: [
                    { name: 'JavaScript', category: 'BACKEND' },
                    { name: 'Python', category: 'BACKEND' },
                    { name: 'Java', category: 'BACKEND' },
                ],
            });

            // Now, make a request to get all skills
            const res = await request(app).get('/skills');

            // Check response
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(3);
            expect(res.body[0]).toHaveProperty('id');
            expect(res.body[0]).toHaveProperty('name');
            expect(res.body[0]).toHaveProperty('category');
        });
    });
});
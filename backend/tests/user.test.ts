import request from 'supertest';
import app from '../src/app';
import prisma from '../src/lib/prisma';
import { describe, expect, test, beforeEach, afterAll } from '@jest/globals';

// Clear the database before each test
describe('User API Tests', () => {
    beforeEach(async () => {

        // Clear relevant tables before each test to ensure a clean state
        await prisma.refreshToken.deleteMany();
        await prisma.userSkill.deleteMany();
        await prisma.user.deleteMany();
    });

    // Close the database connection after all tests
    afterAll(async () => {
        await prisma.$disconnect();
    });

    // 1. Test viewing own profile
    describe('GET /users/me', () => {
        test('should return own profile', async () => {
            // First, register a new user to get an access token
            const res = await request(app)
                .post('/auth/register')
                .send({
                    email: 'test@example.com',
                    username: 'testuser',
                    password: 'password123',
                });

                // Check response
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('accessToken');
            const accessToken = res.body.accessToken;

            // Now, use the access token to get own profile
            const profileRes = await request(app)
                .get('/users/me')
                .set('Authorization', `Bearer ${accessToken}`);

            // Check profile response
            expect(profileRes.status).toBe(200);
            expect(profileRes.body).toHaveProperty('id');
            expect(profileRes.body).toHaveProperty('university');
            expect(Array.isArray(profileRes.body.skills)).toBe(true);
            expect(profileRes.body.skills.length).toBe(0); // New user should have no skills
        }); 
    });

    // 2. Test updating own profile
    describe('PUT /users/me', () => {
        test('should update own profile', async () => {
            // First, register a new user to get an access token
            const res = await request(app)
                .post('/auth/register')
                .send({
                    email: 'test@example.com',
                    username: 'testuser',
                    password: 'password123',
                });

                // Check response
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('accessToken');
            const accessToken = res.body.accessToken;

            // Now, use the access token to update own profile
            const updateRes = await request(app)
                .put('/users/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    university: 'Test University',
                    bio: 'This is a test bio.',
                });

            // Check update response
            expect(updateRes.status).toBe(200);
            expect(updateRes.body).toHaveProperty('university', 'Test University');
            expect(updateRes.body).toHaveProperty('bio', 'This is a test bio.');
        });
    });

    // 3. Test viewing another user's profile
    describe('GET /users/:userId', () => {
        test('should return another user\'s profile', async () => {
            // First, register a new user to get an access token
            const res1 = await request(app)
                .post('/auth/register')
                .send({
                    email: 'test1@example.com',
                    username: 'testuser1',
                    password: 'password123',
                });

            expect(res1.status).toBe(201);
            const firstProfileUserId = res1.body.user.id;

            // Register another user to get an access token for authentication
            const res2 = await request(app)
                .post('/auth/register')
                .send({
                    email: 'test2@example.com',
                    username: 'testuser2',
                    password: 'password123',
                });

            expect(res2.status).toBe(201);
            const accessToken = res2.body.accessToken;

            // Now, use the access token to get the first user's profile
            const profileRes = await request(app)
                .get(`/users/${firstProfileUserId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            // Check profile response
            expect(profileRes.status).toBe(200);
            expect(profileRes.body).toHaveProperty('id', firstProfileUserId);
            expect(profileRes.body).toHaveProperty('university');
            expect(profileRes.body).toHaveProperty('skills');
        });
    });

    // Edge cases: unauthorized update, invalid data, viewing non-existent user
    //  4. Test unauthorized profile update
    describe('Edge Cases', () => {
        test('should not allow unauthorized profile update', async () => {
            const res = await request(app)
                .put('/users/me')
                .send({
                    university: 'Hacker University',
                });

            expect(res.status).toBe(401);
        });
    

        // 5. Test invalid data on profile update
        test('should return error for invalid data on profile update', async () => {
            // First, register a new user to get an access token
            const res = await request(app)
                .post('/auth/register')
                .send({
                    email: 'test@example.com',
                    username: 'testuser',
                    password: 'password123',
                });

            expect(res.status).toBe(201);
            const accessToken = res.body.accessToken;

            // Now, use the access token to update own profile with invalid data
            const updateRes = await request(app)
                .put('/users/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    university: 123, // Invalid type
                });

            expect(updateRes.status).toBe(400);
        });

        // 6. Test viewing non-existent user profile
        test('should return error when viewing non-existent user profile', async () => {
            // First, register a new user to get an access token
            const res = await request(app)
                .post('/auth/register')
                .send({
                    email: 'test@example.com',
                    username: 'testuser',
                    password: 'password123',
                });

            expect(res.status).toBe(201);
            const accessToken = res.body.accessToken;

            // Now, use the access token to view a non-existent user's profile
            const profileRes = await request(app)
                .get('/users/999')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(profileRes.status).toBe(404);
        });

        // 7. Test existing fields remain unchanged when updating profile with partial data 
        test('should not change existing fields when updating profile with partial data', async () => {
            // First, register a new user to get an access token
            const res = await request(app)
                .post('/auth/register')
                .send({
                    email: 'test@example.com',
                    username: 'testuser',
                    password: 'password123',
                });

            expect(res.status).toBe(201);
            const accessToken = res.body.accessToken;

            // Set initial profile data
            await request(app)
                .put('/users/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    bio: 'Initial bio',
                });

            // Now, use the access token to update own profile with partial data
            const updateRes = await request(app)
                .put('/users/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    university: 'Hacker University',
                });
            expect(updateRes.status).toBe(200);

            // Verify that the university field was updated
            const profileRes = await request(app)
                .get('/users/me')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(profileRes.status).toBe(200);
            expect(profileRes.body.university).toBe('Hacker University');
            // Verify that other fields remain unchanged (e.g., bio should still be 'Initial bio')
            expect(profileRes.body.bio).toBe('Initial bio');
        });
    });
});
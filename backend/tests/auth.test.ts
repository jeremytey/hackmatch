import request from 'supertest';
import app from '../src/app';
import prisma from '../src/lib/prisma';
import { describe, expect, test, beforeEach, afterAll } from '@jest/globals';

// Clear the database before each test
describe('Authentication Integration Tests', () => {
  beforeEach(async () => {
    
    // clear refreshTokens first due to foreign key constraints
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  });

  // Disconnect Prisma after all tests
  afterAll(async () => {
    // Clean up after tests
    await prisma.$disconnect();
  });

// 1. Test user registration
  describe('POST /auth/register', () => {
    test('should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123'
        });
        // Check response
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user).toMatchObject({
        email: 'test@example.com',
        username: 'testuser'
      });

    const userInDb = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    expect(userInDb).not.toBeNull();
    expect(userInDb?.username).toBe('testuser');
    });
  });

  // 2. Test user login
    describe('POST /auth/login', () => {
        test('should login an existing user', async () => {
            // First, register a user to login with
            await request(app)
                .post('/auth/register')
                .send({
                    email: 'login@example.com',
                    username: 'loginuser',
                    password: 'password123'
                });
                
            // Now, attempt to login
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123'
                });
                
            // Check response
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('accessToken');
            expect(res.body.user).toMatchObject({
                email: 'login@example.com',
                username: 'loginuser'
            });
        });
    });

    // 3. Test user logout
    describe('POST /auth/logout', () => {
        test('should logout a user', async () => {
            // First, register and login a user to get a token
            await request(app)
                .post('/auth/register')
                .send({
                    email: 'logout@example.com',
                    username: 'logoutuser',
                    password: 'password123'
                });

            const loginRes = await request(app)
                .post('/auth/login')
                .send({
                    email: 'logout@example.com',
                    password: 'password123'
                });

            const accessToken = loginRes.body.accessToken;

            // Now, attempt to logout
            const res = await request(app)
                .post('/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`);

            // Check response
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Logged out successfully');
        });
    });

    // 4. Test token refresh
    describe('POST /auth/refresh', () => {
        const user = { email: 'refresh@example.com', username: 'refreshuser', password: 'password123' };

        test('should rotate refresh tokens and invalidate the old one', async () => {
    
        // a) Register a new user to get a refresh token cookie    
        const registerRes = await request(app)
            .post('/auth/register')
            .send(user);
        const userId = registerRes.body.user.id;
        
        // a) Login to get initial cookies
        const loginRes = await request(app)
            .post('/auth/login')
            .send({ email: user.email, password: user.password });
        const loginCookie = loginRes.get('Set-Cookie')?.[0]?.split(';')[0];
        if (!loginCookie) throw new Error('No cookie set on login');

        //  b) First refresh — consumes login token, issues new one
        const refreshRes = await request(app)
            .post('/auth/refresh')
            .set('Cookie', loginCookie);
        expect(refreshRes.status).toBe(200);
        const rotatedCookie = refreshRes.get('Set-Cookie')?.[0]?.split(';')[0];
        expect(rotatedCookie).toBeDefined();
        expect(rotatedCookie).not.toBe(loginCookie);

        // c) ATTEMPT TO REUSE THE FIRST COOKIE (The Security Test)
        const reuseRes = await request(app)
            .post('/auth/refresh')
            .set('Cookie', loginCookie); // Attempt to reuse the original cookie which should now be invalidated
        //  VERIFY REVOCATION: should be 401 and db cleared tokens
        expect(reuseRes.status).toBe(401); 
        
        //  Check DB: Are all tokens for this user deleted?
        const tokenCount = await prisma.refreshToken.count({ where: { userId } });
        expect(tokenCount).toBe(0); 
        });
    });

    // ========== Edge Cases ==========
    // 5. Test edge cases for registration
    describe('registeration edge cases', () => {
        test('should not allow duplicate email registration', async () => {
            await request(app)
                .post('/auth/register')
                .send({
                    email: 'edgecase@example.com',
                    username: 'edgecaseuser',
                    password: 'password123'
                });

            const res = await request(app)
                .post('/auth/register')
                .send({
                    email: 'edgecase@example.com',
                    username: 'edgecaseuser2',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Email already in use');
        });

        test('should not allow duplicate username registration', async () => {
            await request(app)
                .post('/auth/register')
                .send({
                    email: 'edgecase@example.com',
                    username: 'edgecaseuser',
                    password: 'password123'
                });

            const res = await request(app)
                .post('/auth/register')
                .send({
                    email: 'edgecase2@example.com',
                    username: 'edgecaseuser',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Username already in use');
        });

        test('should not allow registration with password shorter than 8 characters', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({
                    email: 'edgecase2@example.com',
                    username: 'edgecaseuser2',
                    password: 'short'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Password must be at least 8 characters long');
        });

    });

    // 6. Test edge cases for login
    describe('login edge cases', () => {
        test('should not login with incorrect password', async () => {
            await request(app)
                .post('/auth/register')
                .send({
                    email: 'edgecase@example.com',
                    username: 'edgecaseuser',
                    password: 'password123'
                });

            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'edgecase@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });

        test('should not login with non-existent email', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });

    });

    // 7. Missing cookies for refresh
    describe('refresh edge cases', () => {
        test('should return 401 if no refresh token cookie is provided', async () => {
            const res = await request(app)
                .post('/auth/refresh');

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'No refresh token provided');
        });

        test('should return 401 if refresh token is invalid', async () => {
            const res = await request(app)
                .post('/auth/refresh')
                .set('Cookie', 'refreshToken=invalidtoken');

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Invalid refresh token');
        });
});

    // 8. Logout edge cases
    describe('logout edge cases', () => {
        test('should return 401 if no authorization header is provided', async () => {
            const res = await request(app)
                .post('/auth/logout');
                
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Authorization header missing');
        });

        test('should return 401 if token is invalid', async () => {
            const res = await request(app)
                .post('/auth/logout')
                .set('Authorization', 'Bearer invalidtoken');

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Invalid or expired token');
        });
    });
});






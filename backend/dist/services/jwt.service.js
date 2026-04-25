"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenPair = generateTokenPair;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = require("jsonwebtoken");
const env_1 = require("../lib/env");
const crypto_1 = require("crypto");
// sign and verify JWT tokens for access and refresh tokens
function generateTokenPair(userId, role) {
    const accessToken = (0, jsonwebtoken_1.sign)({ userId, role }, env_1.env.JWT_ACCESS_SECRET, { expiresIn: env_1.env.JWT_ACCESS_EXPIRES_IN });
    const refreshToken = (0, jsonwebtoken_1.sign)({ userId, jti: (0, crypto_1.randomUUID)() }, env_1.env.JWT_REFRESH_SECRET, { expiresIn: env_1.env.JWT_REFRESH_EXPIRES_IN });
    return { accessToken, refreshToken };
}
// return JWT payload userId and role for access token, userId for refresh token
//middleware will call verifyAccessToken, attach payload to req.user for authorization
function verifyAccessToken(token) {
    return (0, jsonwebtoken_1.verify)(token, env_1.env.JWT_ACCESS_SECRET);
}
function verifyRefreshToken(token) {
    return (0, jsonwebtoken_1.verify)(token, env_1.env.JWT_REFRESH_SECRET);
}

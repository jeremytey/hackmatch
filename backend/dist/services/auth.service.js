"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refreshTokens = refreshTokens;
exports.logout = logout;
// service functions for authentication, including registration, login, and token refreshing
const jwt_service_1 = require("./jwt.service");
const userRepository = __importStar(require("../repositories/user.repository"));
const refreshToken_repository_1 = require("../repositories/refreshToken.repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const app_error_1 = require("../lib/app.error");
async function register(email, username, password) {
    // check if email or username already exists
    const existingEmail = await userRepository.findUserByEmail(email);
    if (existingEmail) {
        throw new app_error_1.AppError("Email already in use", 400);
    }
    const existingUsername = await userRepository.findUserByUsername(username);
    if (existingUsername) {
        throw new app_error_1.AppError("Username already in use", 400);
    }
    // hash password and create user
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    const user = await userRepository.createUser(email, username, passwordHash);
    // generate JWT token pair
    const tokens = (0, jwt_service_1.generateTokenPair)(user.id, user.userRole); // default role is USER
    // hash refresh token and store in db
    const refreshTokenHash = crypto_1.default
        .createHash("sha256").update(tokens.refreshToken).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await (0, refreshToken_repository_1.createRefreshToken)(user.id, refreshTokenHash, expiresAt);
    return { ...tokens, user: { id: user.id, email: user.email, username: user.username, userRole: user.userRole } };
}
async function login(email, password) {
    // find user by email
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new app_error_1.AppError("Invalid email or password", 401);
    }
    // compare password
    const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new app_error_1.AppError("Invalid email or password", 401);
    }
    // delete existing refresh tokens for this user before creating new one
    await (0, refreshToken_repository_1.deleteRefreshTokensForUser)(user.id);
    // generate JWT token pair
    const tokens = (0, jwt_service_1.generateTokenPair)(user.id, user.userRole);
    // hash refresh token and store in db
    const refreshTokenHash = crypto_1.default
        .createHash("sha256").update(tokens.refreshToken).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await (0, refreshToken_repository_1.createRefreshToken)(user.id, refreshTokenHash, expiresAt);
    return { ...tokens, user: { id: user.id, email: user.email, username: user.username, userRole: user.userRole } };
}
async function refreshTokens(refreshToken) {
    // 1. Verify refresh token and get userId
    let payload;
    try {
        payload = (0, jwt_service_1.verifyRefreshToken)(refreshToken);
    }
    catch (err) {
        throw new app_error_1.AppError("Invalid refresh token", 401);
    }
    const refreshTokenHash = crypto_1.default.createHash("sha256").update(refreshToken).digest("hex");
    // 2. Attempt to delete the old token (Rotation)
    const storedToken = await (0, refreshToken_repository_1.findRefreshToken)(refreshTokenHash);
    if (!storedToken) {
        await (0, refreshToken_repository_1.deleteRefreshTokensForUser)(payload.userId);
        throw new app_error_1.AppError("Invalid refresh token", 401);
    }
    await (0, refreshToken_repository_1.deleteRefreshToken)(refreshTokenHash);
    // 3. Find user to get their role for the new token
    const user = await userRepository.findUserById(payload.userId);
    if (!user) {
        throw new app_error_1.AppError("User not found", 404);
    }
    // 4. Generate new pair
    const tokens = (0, jwt_service_1.generateTokenPair)(payload.userId, user.userRole);
    // 5. Store the new hashed refresh token
    const newRefreshTokenHash = crypto_1.default.createHash("sha256").update(tokens.refreshToken).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await (0, refreshToken_repository_1.createRefreshToken)(payload.userId, newRefreshTokenHash, expiresAt);
    return tokens;
}
async function logout(userId) {
    await (0, refreshToken_repository_1.deleteRefreshTokensForUser)(userId);
}

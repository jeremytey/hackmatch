"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = createRefreshToken;
exports.findRefreshToken = findRefreshToken;
exports.deleteRefreshToken = deleteRefreshToken;
exports.deleteRefreshTokensForUser = deleteRefreshTokensForUser;
const prisma_1 = __importDefault(require("../lib/prisma"));
// create hashed refresh token stored in db
// browser stores refreshtoken in httpOnly cookie, compared againt hashed token in db when user tries to refresh access token
async function createRefreshToken(userId, tokenHash, expiresAt) {
    const refreshToken = await prisma_1.default.refreshToken.create({
        data: {
            userId,
            tokenHash,
            expiresAt,
        },
    });
    return refreshToken;
}
// find hashed refresh token in db
async function findRefreshToken(tokenHash) {
    const refreshToken = await prisma_1.default.refreshToken.findUnique({
        where: { tokenHash },
    });
    return refreshToken;
}
// delete hashed refresh token from db
async function deleteRefreshToken(tokenHash) {
    await prisma_1.default.refreshToken.delete({
        where: { tokenHash },
    });
}
// delete all refresh tokens for a user (on logout/security breach)
async function deleteRefreshTokensForUser(userId) {
    await prisma_1.default.refreshToken.deleteMany({
        where: { userId },
    });
}

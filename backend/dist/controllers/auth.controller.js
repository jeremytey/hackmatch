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
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refreshTokens = refreshTokens;
exports.logout = logout;
const authService = __importStar(require("../services/auth.service"));
const app_error_1 = require("../lib/app.error");
const auth_validator_1 = require("../validators/auth.validator");
const logger_1 = require("../lib/logger");
const jwt_service_1 = require("../services/jwt.service");
async function register(req, res, next) {
    try {
        const parsedRegistration = auth_validator_1.RegisterSchema.safeParse(req.body);
        if (!parsedRegistration.success) {
            throw new app_error_1.AppError(parsedRegistration.error.issues[0].message, 400);
        }
        const { email, username, password } = parsedRegistration.data;
        const result = await authService.register(email, username, password);
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(201).json({ accessToken: result.accessToken, user: result.user });
    }
    catch (error) {
        logger_1.logger.error('Register error:', error);
        next(error);
    }
}
async function login(req, res, next) {
    try {
        const parsedLogin = auth_validator_1.LoginSchema.safeParse(req.body);
        if (!parsedLogin.success) {
            throw new app_error_1.AppError(parsedLogin.error.issues[0].message, 400);
        }
        const { email, password } = parsedLogin.data;
        const result = await authService.login(email, password);
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ accessToken: result.accessToken, user: result.user });
    }
    catch (error) {
        logger_1.logger.error('Login error:', error);
        next(error);
    }
}
async function refreshTokens(req, res, next) {
    try {
        // get refresh token from httpOnly cookie
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new app_error_1.AppError("No refresh token provided", 401);
        }
        const result = await authService.refreshTokens(refreshToken);
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ accessToken: result.accessToken });
    }
    catch (error) {
        logger_1.logger.error('Refresh token error:', error);
        next(error);
    }
}
async function logout(req, res, next) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            try {
                const payload = (0, jwt_service_1.verifyRefreshToken)(refreshToken);
                await authService.logout(payload.userId);
            }
            catch {
                // If token verification fails, we still want to clear the cookie and respond with success
            }
        }
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        logger_1.logger.error('Logout error:', error);
        next(error);
    }
}

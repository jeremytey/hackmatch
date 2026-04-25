"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const app_error_1 = require("../lib/app.error");
const jwt_service_1 = require("../services/jwt.service");
const client_1 = require("@prisma/client");
// requireAuth middleware to protect routes, checks for valid access token in Authorization header
// attaches user info to req.user for use in controllers
function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return next(new app_error_1.AppError("Authorization header missing", 401));
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return next(new app_error_1.AppError("Token missing", 401));
        }
        const payload = (0, jwt_service_1.verifyAccessToken)(token);
        if (!payload) {
            return next(new app_error_1.AppError("Invalid or expired token", 401));
        }
        // attach user info to request object for use in controllers
        req.user = { userId: payload.userId, role: payload.role };
        next();
    }
    catch (error) {
        return next(new app_error_1.AppError("Invalid or expired token", 401));
    }
}
function requireAdmin(req, res, next) {
    if (!req.user)
        return next(new app_error_1.AppError("Unauthorized", 401));
    if (req.user.role !== client_1.UserRole.ADMIN) {
        return next(new app_error_1.AppError("Admin access required", 403));
    }
    next();
}

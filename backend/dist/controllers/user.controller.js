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
exports.getMe = getMe;
exports.updateMe = updateMe;
exports.getUserProfile = getUserProfile;
const userService = __importStar(require("../services/user.service"));
const app_error_1 = require("../lib/app.error");
const user_validator_1 = require("../validators/user.validator");
const logger_1 = require("../lib/logger");
async function getMe(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new app_error_1.AppError("User ID missing from token", 401);
        }
        const userProfile = await userService.getUserProfileById(userId);
        res.status(200).json(userProfile);
    }
    catch (error) {
        logger_1.logger.error('GetMe error:', error);
        next(error);
    }
}
async function updateMe(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new app_error_1.AppError("User ID missing from token", 401);
        }
        const parsedData = user_validator_1.UpdateUserSchema.safeParse(req.body);
        if (!parsedData.success) {
            throw new app_error_1.AppError(parsedData.error.issues[0].message, 400);
        }
        const updateData = parsedData.data;
        const updatedProfile = await userService.updateUserProfile(userId, updateData);
        res.status(200).json(updatedProfile);
    }
    catch (error) {
        logger_1.logger.error('UpdateMe error:', error);
        next(error);
    }
}
async function getUserProfile(req, res, next) {
    try {
        const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId)) {
            throw new app_error_1.AppError("Invalid user ID", 400);
        }
        const userProfile = await userService.getUserProfileById(userId);
        res.status(200).json(userProfile);
    }
    catch (error) {
        logger_1.logger.error('GetUserProfile error:', error);
        next(error);
    }
}

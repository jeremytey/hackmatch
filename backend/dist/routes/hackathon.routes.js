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
// hackathon.routes.ts
const express_1 = require("express");
const hackathonController = __importStar(require("../controllers/hackathon.controller"));
const participantController = __importStar(require("../controllers/participant.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const hackathonRouter = (0, express_1.Router)();
// Hackathon management routes
hackathonRouter.get('/', hackathonController.getAllHackathons);
hackathonRouter.post('/', auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, hackathonController.createHackathon);
hackathonRouter.put('/:hackathonId', auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, hackathonController.editHackathonDetails);
hackathonRouter.get('/:hackathonId', hackathonController.viewHackathonDetails);
hackathonRouter.delete('/:hackathonId', auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, hackathonController.deleteHackathon);
// Participant management routes
hackathonRouter.post('/:hackathonId/join', auth_middleware_1.requireAuth, participantController.joinHackathon);
hackathonRouter.put('/:hackathonId/participant', auth_middleware_1.requireAuth, participantController.updateParticipantStatus);
hackathonRouter.get('/:hackathonId/participants', auth_middleware_1.requireAuth, participantController.listParticipants);
hackathonRouter.delete('/:hackathonId/leave', auth_middleware_1.requireAuth, participantController.leaveHackathon);
exports.default = hackathonRouter;

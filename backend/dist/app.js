"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); //
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = require("./lib/logger"); // Winston logger 
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const hackathon_routes_1 = __importDefault(require("./routes/hackathon.routes"));
const app = (0, express_1.default)();
// Global Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Custom Winston Request Logger Middleware - Logs HTTP method and URL for each incoming request
app.use((req, res, next) => {
    logger_1.logger.info(`${req.method} ${req.url}`);
    next();
});
// Routes
app.use('/auth', auth_routes_1.default);
app.use('/users', user_routes_1.default);
app.use('/hackathons', hackathon_routes_1.default);
app.use(error_middleware_1.errorMiddleware);
exports.default = app;

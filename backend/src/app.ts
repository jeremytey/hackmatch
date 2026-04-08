import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors'; //
import cookieParser from 'cookie-parser';
import { logger } from './lib/logger'; // Winston logger
import { errorMiddleware } from './middleware/error.middleware';

import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import hackathonRouter from './routes/hackathon.routes';

const app = express();

// Global Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL ||'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom Winston Request Logger Middleware - Logs HTTP method and URL for each incoming request
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/hackathons', hackathonRouter);

app.use(errorMiddleware);

export default app;
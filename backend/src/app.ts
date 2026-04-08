import express from 'express';
import { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors'; //
import cookieParser from 'cookie-parser';
import { logger } from './lib/logger'; // Winston logger
import { errorMiddleware } from './middleware/error.middleware';

import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import hackathonRouter from './routes/hackathon.routes';
import participantRouter from './routes/participant.routes';

const app:Application = express();

// Global Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL ||'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger);
app.use(errorMiddleware);

// Custom Winston Request Logger Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/hackathons', hackathonRouter);
app.use('/participants', participantRouter);

app.use(errorMiddleware);

export default app;
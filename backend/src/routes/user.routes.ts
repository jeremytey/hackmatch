// user.routes.ts
import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';
const userRouter = Router();


userRouter.get('/me', requireAuth, userController.getMe);
userRouter.put('/me', requireAuth, userController.updateMe);
userRouter.get('/:userId', userController.getUserProfile);

export default userRouter;
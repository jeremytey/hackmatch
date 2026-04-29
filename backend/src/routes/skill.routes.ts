import { Router } from 'express';
import * as skillController from '../controllers/skill.controller';
const skillRouter = Router();

skillRouter.get('/', skillController.getAllSkills);

export default skillRouter;
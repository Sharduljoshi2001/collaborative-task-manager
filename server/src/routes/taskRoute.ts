import {Router} from "express";
import * as taskController from '../controllers/taskController';
import {authenticatedUser} from '../middlewares/authMiddleware'

const router = Router();
router.post("/", authenticatedUser, taskController.createTask);
router.get('/',authenticatedUser, taskController.getTasks);
export default router;
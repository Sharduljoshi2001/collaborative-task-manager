import {Router} from "express";
import * as taskController from '../controllers/taskController';
import {authenticatedUser} from '../middlewares/authMiddleware'

const router = Router();
router.post("/", authenticatedUser, taskController.createTask);
router.get('/',authenticatedUser, taskController.getTasks);
//routes with params id for updation and deletion of tasks
router.put('/:id',authenticatedUser, taskController.updateTask);
router.delete('/:id',authenticatedUser, taskController.deleteTask);
export default router;
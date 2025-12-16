import {Router} from 'express';
import * as authController from '../controllers/authController';
import { authenticatedUser } from '../middlewares/authMiddleware';
const router = Router();
router.post('/register', authController.register);
router.post('/login',authController.login);

// new protected route (for testing)
// 'authenticateUser' will run first, if it passed only then the arrow function will run

router.get("/profile", authenticatedUser, (req, res)=>{
  res.status(200).json({
    status:"success",
    message:"you have accessed a proctored route",
    user:req.user,
  });
})
export default router;
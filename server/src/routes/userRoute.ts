import express from "express";
import { getAllUsers, updateProfile } from "../controllers/userController";
import { authenticatedUser } from "../middlewares/authMiddleware";

const router = express.Router();

//protecting this route so only logged in users can see other users
router.get("/", authenticatedUser, getAllUsers);
router.patch("/profile", authenticatedUser, updateProfile)

export default router;
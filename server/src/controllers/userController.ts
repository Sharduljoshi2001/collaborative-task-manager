import { Request, Response } from "express";
import * as userService from "../services/userService";
//getting all users for the dropdown
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
};
//updating user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    //getting user id from auth middleware
    const userId = (req as any).user.userId;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // calling service layer 
    const updatedUser = await userService.updateUserProfile(userId, name);

    res.status(200).json({
      status: "success",
      data: updatedUser,
      message: "Profile updated successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
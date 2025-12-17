import { Request, Response } from "express";
import * as taskService from "../services/taskService";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/taskValidator";
import { JwtPayload } from "jsonwebtoken";
//creating tasks controller
export const createTask = async (req: Request, res: Response) => {
  try {
    //validating task
    const validatedData = createTaskSchema.parse(req.body);
    // extracting user id from token
    const user = req.user as JwtPayload;
    // if middleware fails or user id was no present in the token
    if (!user || !user.userId) {
      res.status(401).json({
        status: "fail",
        message: "unaothoried:userId missing",
      });
      return;
    }
    //calling service layer to create the given task
    const task = await taskService.createNewTask(validatedData, user.userId);
    res.status(200).json({
      status: "success",
      message: "task successfully created",
      data: task,
    });
  } catch (error: any) {
    //zod error
    if (error.errors) {
      res.status(400).json({
        status: "fail",
        error: error.errors,
      });
      return;
    }
    res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};
//getting tasks controller
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.status(200).json({
      status: "success",
      message: "tasks fetched successfully",
      data: tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};
//updating tasks controller
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    //extracting id from url params
    const taskId = req.params.id;
    const user = req.user as JwtPayload;
    //validating updation data(partial data is allowed)
    const validatedData = updateTaskSchema.parse(req.body);
    const updatedTask = await taskService.updateTask(
      taskId,
      user.userId,
      validatedData
    );
    res.status(200).json({
      status: "success",
      message: "task updated successfully",
      data: updatedTask,
    });
  } catch (error: any) {
    //task ownership error handling
    if (error.message.includes("unauthorized")) {
      res.status(403).json({ status: "fail", message: error.message });
      return;
    }
    //task not found arror handling
    if (error.message === "task not found") {
      res.status(404).json({ status: "fail", message: error.message });
      return;
    }
    res.status(500).json({
      status: "error",
      message: "",
    });
  }
};
//deleting task controller
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;
    const user = req.user as JwtPayload;

    await taskService.deleteTask(taskId, user.userId);

    res.status(204).json({
      status: "success",
      message: "Task deleted successfully",
      data: null,
    });
  } catch (error: any) {
    if (error.message.includes("unauthorized")) {
        res.status(403).json({ status: "fail", message: error.message });
        return;
    }
    res.status(500).json({ status: "error", message: error.message });
  }
};
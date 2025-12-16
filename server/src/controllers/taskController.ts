import { Request, Response } from "express";
import * as taskService from "../services/taskService";
import { createTaskSchema } from "../validators/taskValidator";
import { JwtPayload } from "jsonwebtoken";
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
        status:'success',
        message:"task successfully created",
        data:task
    })
  } catch (error:any) {
    //zod error
    if(error.errors){
        res.status(400).json({
            status:'fail',
            error: error.errors
        });
        return;
    }
    res.status(500).json({
        status:'fail',
        message:'internal server error'
    })
  }
};
export const getTasks = async (req:Request, res:Response)=>{
    try{
        const tasks = await taskService.getAllTasks();
        res.status(200).json({
            status:'success',
            message:'tasks fetched successfully',
            data: tasks
        })
    }catch(error:any){
        res.status(500).json({
            status:'fail',
            message:'internal server error'
        })
    }
}

import * as taskRepository from "../repositories/taskRepository";
import { CreateTaskInput, UpdateTaskInput } from "../validators/taskValidator";
export const createNewTask=async(data:CreateTaskInput,userId:string)=>{
    return await taskRepository.createTask(data,userId);
}
export const getAllTasks = async ()=>{
    return await taskRepository.getAllTasks();
}
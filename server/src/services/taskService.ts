import * as taskRepository from "../repositories/taskRepository";
import { CreateTaskInput, UpdateTaskInput } from "../validators/taskValidator";
export const createNewTask=async(data:CreateTaskInput,userId:string)=>{
    return await taskRepository.createTask(data,userId);
}
export const getAllTasks = async (filter:any, userId:string)=>{
    return await taskRepository.getAllTasks(filter, userId);
}
export const updateTask = async (
  taskId: string,
  userId: string,
  data: UpdateTaskInput
) => {
  // finding task
  const task = await taskRepository.findTaskById(taskId);
  if (!task) {
    throw new Error("task not found");
  }
  // checking ownership of the task
  if (task.creatorId !== userId) {
    throw new Error("unauthorized: You cannot update this task");
  }
  // updating the task by sending it to task repo layer
  return await taskRepository.updateTask(taskId, data);
};

//delating task
export const deleteTask = async (taskId: string, userId: string) => {
  //finding task by id in repo layer
  const task = await taskRepository.findTaskById(taskId);
  if (!task) {
    throw new Error("task not found");
  }

  //ownership check
  if (task.creatorId !== userId) {
    throw new Error("unauthorized: You cannot delete this task");
  }

  //deleting the task
  return await taskRepository.deleteTask(taskId);
}; 
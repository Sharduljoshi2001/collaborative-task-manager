import api from './api';
import type { ApiResponse, Task, CreateTaskData, UpdateTaskData } from '../types';

export const taskService = {
  // fetching all tasks from the backend
  getAllTasks: async () => {
    // we expect an array of tasks in response
    const response = await api.get<ApiResponse<Task[]>>('/tasks');
    return response.data;
  },

  // creating a new task
  createTask: async (taskData: CreateTaskData) => {
    const response = await api.post<ApiResponse<Task>>('/tasks', taskData);
    return response.data;
  },

  // updating an existing task by id
  updateTask: async (id: string, taskData: UpdateTaskData) => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, taskData);
    return response.data;
  },

  // deleting a task by id
  deleteTask: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/tasks/${id}`);
    return response.data;
  },
  
  // fetching a single task details
  getTaskById: async (id: string) => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data;
  }
};
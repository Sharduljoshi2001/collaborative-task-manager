import api from './api';
import type { ApiResponse, Task, CreateTaskData, UpdateTaskData } from '../types';

// Defining filter types
export interface TaskFilters {
  type?: 'assigned' | 'created' | 'overdue';
  status?: string;
  priority?: string;
}

export const taskService = {
  // fetching all tasks with optional filters
  getAllTasks: async (filters?: TaskFilters) => {
    // converting filters object to query string params
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);

    const response = await api.get<ApiResponse<Task[]>>(`/tasks?${params.toString()}`);
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
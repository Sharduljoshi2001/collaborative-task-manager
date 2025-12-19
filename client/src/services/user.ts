import api from './api';
import type { ApiResponse, User } from '../types';

export const userService = {
  getAllUsers: async () => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    return response.data;
  }
};
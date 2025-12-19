import api from './api';
import type { ApiResponse, User } from '../types';

export const userService = {
  getAllUsers: async () => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    return response.data;
  },

  // 👇 NEW: Update profile function
  updateProfile: async (name: string) => {
    const response = await api.patch<ApiResponse<User>>('/users/profile', { name });
    return response.data;
  }
};
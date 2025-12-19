import api from './api';
import type { ApiResponse, User } from '../types';

// interface for data coming from the login form
export interface LoginCredentials {
  email: string;
  password: string;
}

// interface for data coming from the registration form
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  // sending login credentials to the backend
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<ApiResponse<User>>('/auth/login', credentials);
    return response.data;
  },

  // sending registration details to the backend
  register: async (credentials: RegisterCredentials) => {
    const response = await api.post<ApiResponse<User>>('/auth/register', credentials);
    return response.data;
  },

  // removing user data from local storage on logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // getting current user details from local storage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
};
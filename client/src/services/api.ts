import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// configuring backend url from env or using fallback
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// creating axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// intercepting outgoing requests to add the auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    // if token is present, adding it to the  authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// intercepting incoming responses to handle errors
api.interceptors.response.use(
  (response) => {
    // if response is valid, returning it directly
    return response;
  },
  (error: AxiosError) => {
    // checking for 401 unauthorized error (token expired/invalid)
    if (error.response && error.response.status === 401) {
      // clearing user data from storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // redirecting to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
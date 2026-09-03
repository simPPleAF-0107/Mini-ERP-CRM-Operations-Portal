import api from './api';
import { User, ApiResponse } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

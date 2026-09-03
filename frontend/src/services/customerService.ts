import api from './api';
import { Customer, PaginatedResponse, ApiResponse } from '../types';

export const customerService = {
  getAll: async (params?: any): Promise<PaginatedResponse<Customer>> => {
    const response = await api.get<PaginatedResponse<Customer>>('/customers', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Customer>> => {
    const response = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
    return response.data;
  },

  create: async (data: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    const response = await api.post<ApiResponse<Customer>>('/customers', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    const response = await api.put<ApiResponse<Customer>>(`/customers/${id}`, data);
    return response.data;
  },

  addNote: async (id: number, note: string): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>(`/customers/${id}/notes`, { note });
    return response.data;
  },
};

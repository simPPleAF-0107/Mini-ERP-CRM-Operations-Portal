import api from './api';
import { Challan, PaginatedResponse, ApiResponse } from '../types';

export const challanService = {
  getAll: async (params?: any): Promise<PaginatedResponse<Challan>> => {
    const response = await api.get<PaginatedResponse<Challan>>('/challans', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Challan>> => {
    const response = await api.get<ApiResponse<Challan>>(`/challans/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse<Challan>> => {
    const response = await api.post<ApiResponse<Challan>>('/challans', data);
    return response.data;
  },

  update: async (id: number, data: any): Promise<ApiResponse<Challan>> => {
    const response = await api.put<ApiResponse<Challan>>(`/challans/${id}`, data);
    return response.data;
  },

  confirm: async (id: number): Promise<ApiResponse<Challan>> => {
    const response = await api.patch<ApiResponse<Challan>>(`/challans/${id}/confirm`);
    return response.data;
  },

  cancel: async (id: number): Promise<ApiResponse<Challan>> => {
    const response = await api.patch<ApiResponse<Challan>>(`/challans/${id}/cancel`);
    return response.data;
  },
};

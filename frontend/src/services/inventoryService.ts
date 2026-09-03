import api from './api';
import { StockMovement, PaginatedResponse, ApiResponse } from '../types';

export const inventoryService = {
  getMovements: async (params?: any): Promise<PaginatedResponse<StockMovement>> => {
    const response = await api.get<PaginatedResponse<StockMovement>>('/inventory/movements', { params });
    return response.data;
  },

  createMovement: async (data: Partial<StockMovement>): Promise<ApiResponse<StockMovement>> => {
    const response = await api.post<ApiResponse<StockMovement>>('/inventory/movements', data);
    return response.data;
  },
};

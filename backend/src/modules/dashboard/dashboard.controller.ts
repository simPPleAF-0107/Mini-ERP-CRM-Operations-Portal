import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';
import { successResponse, errorResponse } from '../../utils/response';

export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await DashboardService.getStats();
    return successResponse(res, stats);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

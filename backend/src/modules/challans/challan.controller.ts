import { Request, Response } from 'express';
import { ChallanService } from './challan.service';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';
import { AuthRequest } from '../../middleware/auth';

export const getAll = async (req: Request, res: Response) => {
  try {
    const filters = {
      status: req.query.status as any,
    };
    const pagination = parsePagination(req.query);

    const { data, total } = await ChallanService.getAll(filters, pagination);
    return paginatedResponse(res, data, total, pagination.page, pagination.limit);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const challan = await ChallanService.getById(id);
    if (!challan) return errorResponse(res, 'Challan not found', 404);
    return successResponse(res, challan);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const challan = await ChallanService.create(req.body, req.user.id);
    return successResponse(res, challan, 'Challan created successfully', 201);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const challan = await ChallanService.update(id, req.body, req.user.id);
    return successResponse(res, challan, 'Challan updated successfully');
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

export const confirm = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const challan = await ChallanService.confirm(id, req.user.id);
    return successResponse(res, challan, 'Challan confirmed successfully');
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

export const cancel = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const challan = await ChallanService.cancel(id, req.user.id);
    return successResponse(res, challan, 'Challan cancelled successfully');
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

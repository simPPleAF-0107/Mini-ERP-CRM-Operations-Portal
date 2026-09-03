import { Request, Response } from 'express';
import { InventoryService } from './inventory.service';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';
import { AuthRequest } from '../../middleware/auth';

export const getMovements = async (req: Request, res: Response) => {
  try {
    const filters = {
      productId: req.query.productId as string,
      movementType: req.query.movementType as any,
    };
    const pagination = parsePagination(req.query);

    const { data, total } = await InventoryService.getMovements(filters, pagination);
    return paginatedResponse(res, data, total, pagination.page, pagination.limit);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const createMovement = async (req: AuthRequest, res: Response) => {
  try {
    const movement = await InventoryService.createMovement(req.body, req.user.id);
    return successResponse(res, movement, 'Stock movement recorded successfully', 201);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

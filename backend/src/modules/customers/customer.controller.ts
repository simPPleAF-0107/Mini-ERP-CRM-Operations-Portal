import { Request, Response } from 'express';
import { CustomerService } from './customer.service';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';
import { AuthRequest } from '../../middleware/auth';

export const getAll = async (req: Request, res: Response) => {
  try {
    const filters = {
      search: req.query.search as string,
      status: req.query.status as any,
      customerType: req.query.customerType as any,
    };
    const pagination = parsePagination(req.query);

    const { data, total } = await CustomerService.getAll(filters, pagination);
    return paginatedResponse(res, data, total, pagination.page, pagination.limit);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const customer = await CustomerService.getById(id);
    if (!customer) return errorResponse(res, 'Customer not found', 404);
    return successResponse(res, customer);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const customer = await CustomerService.create(req.body);
    return successResponse(res, customer, 'Customer created successfully', 201);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const customer = await CustomerService.update(id, req.body);
    return successResponse(res, customer, 'Customer updated successfully');
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const addNote = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const note = await CustomerService.addNote(id, req.body.note, req.user.id);
    return successResponse(res, note, 'Note added successfully', 201);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

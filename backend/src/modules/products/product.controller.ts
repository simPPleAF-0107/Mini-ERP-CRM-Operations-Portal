import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';

export const getAll = async (req: Request, res: Response) => {
  try {
    const filters = {
      search: req.query.search as string,
      category: req.query.category as string,
    };
    const pagination = parsePagination(req.query);

    const { data, total } = await ProductService.getAll(filters, pagination);
    return paginatedResponse(res, data, total, pagination.page, pagination.limit);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await ProductService.getById(id);
    if (!product) return errorResponse(res, 'Product not found', 404);
    return successResponse(res, product);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const product = await ProductService.create(req.body);
    return successResponse(res, product, 'Product created successfully', 201);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await ProductService.update(id, req.body);
    return successResponse(res, product, 'Product updated successfully');
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const getLowStock = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.getLowStock();
    return successResponse(res, products);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

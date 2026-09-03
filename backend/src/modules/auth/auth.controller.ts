import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { successResponse, errorResponse } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await AuthService.login(email, password);
    return successResponse(res, data, 'Login successful');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Login failed', 400);
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await AuthService.getCurrentUser(req.user.id);
    return successResponse(res, user, 'Profile fetched successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to fetch profile', 400);
  }
};

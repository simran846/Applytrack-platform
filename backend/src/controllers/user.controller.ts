import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../utils/apiResponse';

const userService = new UserService();

export class UserController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const profile = await userService.getProfile(userId);
      return ApiResponse.success(res, profile, 'User profile retrieved');
    } catch (error) {
      return next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const updated = await userService.updateProfile(userId, req.body);
      return ApiResponse.success(res, updated, 'Profile updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await userService.changePassword(userId, req.body);
      return ApiResponse.success(res, result, 'Password changed successfully');
    } catch (error) {
      return next(error);
    }
  }
}

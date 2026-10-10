import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';
import { env } from '../config/env';

const authService = new AuthService();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.cookie('access_token', result.token, COOKIE_OPTIONS);
      return ApiResponse.created(res, result, 'User registered successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.cookie('access_token', result.token, COOKIE_OPTIONS);
      return ApiResponse.success(res, result, 'Logged in successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax'
      });
      return ApiResponse.success(res, { message: 'Logged out successfully' }, 'Logged out successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const user = await authService.getCurrentUser(userId);
      return ApiResponse.success(res, user, 'Current user profile retrieved');
    } catch (error) {
      return next(error);
    }
  }
}

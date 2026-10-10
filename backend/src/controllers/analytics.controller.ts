import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { ApiResponse } from '../utils/apiResponse';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  static async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = await analyticsService.getDashboardOverview(userId);
      return ApiResponse.success(res, data, 'Analytics overview retrieved successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async getDetailed(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = await analyticsService.getDetailedAnalytics(userId);
      return ApiResponse.success(res, data, 'Detailed application analytics retrieved');
    } catch (error) {
      return next(error);
    }
  }
}

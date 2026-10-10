import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../services/application.service';
import { ApiResponse } from '../utils/apiResponse';
import { QueryApplicationInput } from '../validators/application.validator';

const applicationService = new ApplicationService();

export class ApplicationController {
  static async getApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const query = req.query as unknown as QueryApplicationInput;

      const result = await applicationService.getApplications({
        userId,
        search: query.search,
        status: query.status,
        workMode: query.workMode,
        priority: query.priority,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
        page: query.page || 1,
        limit: query.limit || 10
      });

      return ApiResponse.paginated(
        res,
        result.items,
        {
          page: result.page,
          limit: result.limit,
          totalItems: result.totalItems,
          totalPages: result.totalPages,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage
        },
        'Applications retrieved successfully'
      );
    } catch (error) {
      return next(error);
    }
  }

  static async getApplicationById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const application = await applicationService.getApplicationById(id, userId);
      return ApiResponse.success(res, application, 'Application details retrieved');
    } catch (error) {
      return next(error);
    }
  }

  static async createApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const application = await applicationService.createApplication(userId, req.body);
      return ApiResponse.created(res, application, 'Application created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async updateApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const updated = await applicationService.updateApplication(id, userId, req.body);
      return ApiResponse.success(res, updated, 'Application updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { status } = req.body;
      const updated = await applicationService.updateStatus(id, userId, status);
      return ApiResponse.success(res, updated, 'Status updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async deleteApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const result = await applicationService.deleteApplication(id, userId);
      return ApiResponse.success(res, result, 'Application deleted successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async exportData(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = await applicationService.exportUserData(userId);
      return ApiResponse.success(res, data, 'User application data exported');
    } catch (error) {
      return next(error);
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import { InterviewService } from '../services/interview.service';
import { ApiResponse } from '../utils/apiResponse';

const interviewService = new InterviewService();

export class InterviewController {
  static async getInterviews(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const interviews = await interviewService.getAllUserInterviews(userId);
      return ApiResponse.success(res, interviews, 'Interviews retrieved successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async getInterviewById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const interview = await interviewService.getInterviewById(id, userId);
      return ApiResponse.success(res, interview, 'Interview details retrieved');
    } catch (error) {
      return next(error);
    }
  }

  static async createInterview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const interview = await interviewService.createInterview(userId, req.body);
      return ApiResponse.created(res, interview, 'Interview scheduled successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async updateInterview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const updated = await interviewService.updateInterview(id, userId, req.body);
      return ApiResponse.success(res, updated, 'Interview updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async deleteInterview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const result = await interviewService.deleteInterview(id, userId);
      return ApiResponse.success(res, result, 'Interview deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}

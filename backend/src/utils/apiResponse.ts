import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static created<T>(res: Response, data: T, message: string = 'Created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data
    });
  }

  static paginated<T>(
    res: Response,
    items: T[],
    pagination: PaginationMeta,
    message: string = 'Data retrieved successfully'
  ) {
    return res.status(200).json({
      success: true,
      message,
      data: items,
      pagination
    });
  }

  static error(res: Response, message: string, statusCode: number = 500, details?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(details ? { details } : {})
    });
  }
}

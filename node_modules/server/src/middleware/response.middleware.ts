import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Response {
      success: (data: any, message?: string) => void;
      error: (message: string, statusCode?: number) => void;
    }
  }
}

export const responseHandler = (req: Request, res: Response, next: NextFunction) => {
  res.success = (data: any, message = 'Success') => {
    res.json({
      status: 'success',
      message,
      data
    });
  };

  res.error = (message: string, statusCode = 400) => {
    res.status(statusCode).json({
      status: 'error',
      message
    });
  };

  next();
}; 
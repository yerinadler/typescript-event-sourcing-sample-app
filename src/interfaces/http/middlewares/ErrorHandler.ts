import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res.status(err.httpCode || 500).json({
    status: err.statusCode || '500',
    message: err.message,
  });
};

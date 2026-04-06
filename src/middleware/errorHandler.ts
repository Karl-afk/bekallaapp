import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

export const errorHandler: ErrorRequestHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('Global Error Handler: ', error);
  if (res.headersSent) {
    return next(error); // Pass to default Express error handler if response already started
  }
  res.status(error.status || 500).json({
    type: req.protocol + '://' + req.host,
    title: error.title || 'Error',
    detail: error.message || 'Internal Server Error',
    instance: req.originalUrl,
    status: error.status || 500,
  });
};

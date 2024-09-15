import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
// import { JsonWebTokenError } from 'jsonwebtoken';
import { ZodError } from 'zod';

export class HandleErrors {
  static execute(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    // if (error instanceof JsonWebTokenError) {
    //   return res.status(401).json({ message: error.message });
    // }

    if (error instanceof ZodError) {
      return res.status(401).json({ message: error.message });
    }
  }
}

import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import jwt from 'jsonwebtoken';

export class VerifyTokenRecovery {
  static execute(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer', '').trim();

    if (!token) {
      throw new AppError(401, 'Token is required');
    }

    try {
      const encodedRecoveryToken = jwt.verify(
        token,
        process.env.JWT_SECRET_RECOVER as string
      );

      res.locals.encodedRecoveryToken = encodedRecoveryToken;
      next();
    } catch (error: any) {
      const errorMap: Record<string, { status: number; message: string }> = {
        TokenExpiredError: { status: 401, message: 'Token expired' },
        JsonWebTokenError: { status: 400, message: 'Token is not valid' },
      };

      const { status, message } = errorMap[error.name] || {
        status: 500,
        message: 'Internal Server Error',
      };

      throw new AppError(status, message);
    }
  }
}

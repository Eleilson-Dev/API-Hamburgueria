import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import jwt from 'jsonwebtoken';

export class VerifyToken {
  static execute(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    const token = authorization?.replace('Bearer', '').trim();

    if (!token) {
      throw new AppError(401, 'Token is required');
    }

    jwt.verify(token, process.env.JWT_SECRET as string);

    res.locals.decode = jwt.decode(token);

    if (Number(req.params.id) !== Number(res.locals.decode.id)) {
      throw new AppError(401, 'User is not owner');
    }

    next();
  }
}

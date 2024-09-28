import { NextFunction, Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { AppError } from '../errors/AppError';

export class IsEmailExits {
  static async execute(req: Request, res: Response, next: NextFunction) {
    const response = await prisma.user.findFirst({
      where: { email: req.body.email },
    });

    if (response) {
      throw new AppError(409, 'Email already exits');
    }

    next();
  }
}

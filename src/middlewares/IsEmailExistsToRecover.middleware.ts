import { NextFunction, Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { AppError } from '../errors/AppError';

export class IsEmailExistsToRecover {
  static async execute(req: Request, res: Response, next: NextFunction) {
    const response = await prisma.user.findFirst({
      where: { email: req.body.email },
    });

    if (!response) {
      throw new AppError(
        404,
        'O E-mail inserido não corresponde a nenhuma conta. Por favor, verifique e tente novamente.'
      );
    }

    next();
  }
}

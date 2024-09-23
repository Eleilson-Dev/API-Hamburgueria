import { NextFunction, Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { AppError } from '../errors/AppError';

export class CheckPendingOrder {
  static async execute(req: Request, res: Response, next: NextFunction) {
    const pendingOrder = await prisma.order.findMany({
      where: {
        userId: Number(res.locals.encodedToken.id),
        status: 'pendente',
      },
    });

    if (pendingOrder.length > 0) {
      return res.status(202).json({
        order: pendingOrder,
        message:
          'Você possui um pedido pendente. Finalize-o antes de criar um novo.',
      });
    }

    next();
  }
}

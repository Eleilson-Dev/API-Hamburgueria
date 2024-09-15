import { NextFunction, Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { AppError } from '../errors/AppError';

export class CheckPendingOrder {
  static async execute(req: Request, res: Response, next: NextFunction) {
    const pendingOrders = await prisma.order.findMany({
      where: {
        userId: Number(req.params.id),
        status: 'pendente',
      },
    });

    if (pendingOrders.length > 0) {
      throw new AppError(
        409,
        'Você já tem um pedido pendente. Finalize-o antes de criar um novo.'
      );
    }

    next();
  }
}

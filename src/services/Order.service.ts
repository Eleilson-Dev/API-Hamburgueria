import { injectable } from 'tsyringe';
import { prisma } from '../database/prisma';
import { TOrderCreate } from '../schemas/order.schema';
import { userReturnSchema } from '../schemas/user.schema';

@injectable()
export class OrderService {
  public findAllOrders = async () => {
    const orders = await prisma.order.findMany({
      include: { user: true },
    });

    const response = orders.map((order) => {
      return { ...order, user: userReturnSchema.parse(order.user) };
    });

    return response;
  };

  public createOrder = async (userId: number, orderBody: TOrderCreate) => {
    const newOrder = await prisma.order.create({
      data: {
        status: orderBody.status,
        selectedPayment: orderBody.selectedPayment,
        userId,
        orderItems: {
          create: orderBody.hamburgers.map((hamburguer) => ({
            hamburguerId: hamburguer.id,
            quantity: hamburguer.quantity,
          })),
        },
      },
      include: { user: true, orderItems: { include: { hamburguer: true } } },
    });

    return { ...newOrder, user: userReturnSchema.parse(newOrder.user) };
  };
}

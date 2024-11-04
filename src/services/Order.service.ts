import { injectable } from 'tsyringe';
import { prisma } from '../database/prisma';
import { TOrderCreate, TUpdateOrder } from '../schemas/order.schema';
import { userReturnSchema } from '../schemas/user.schema';
import { AppError } from '../errors/AppError';

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
        userId,
        orderItems: {
          create: orderBody.items.map((item) => {
            switch (item.type) {
              case 'hamburguers':
                return { hamburguerId: item.id, quantity: item.quantity };
              case 'pizzas':
                return { pizzaId: item.id, quantity: item.quantity };
              case 'salgados':
                return { savoryId: item.id, quantity: item.quantity };
              case 'refrigerantes':
                return { sodaId: item.id, quantity: item.quantity };
              case 'sucos':
                return { juiceId: item.id, quantity: item.quantity };
              case 'bolos':
                return { cakeId: item.id, quantity: item.quantity };
            }
          }),
        },
        priceOrder: orderBody.priceOrder,
      },
      include: {
        user: true,
        orderItems: {
          include: {
            hamburguer: true,
            Soda: true,
            Pizza: true,
            Juice: true,
            Savory: true,
          },
        },
      },
    });

    return { ...newOrder, user: userReturnSchema.parse(newOrder.user) };
  };

  public updateOrderStatus = async (
    updateOrder: TUpdateOrder,
    userId: number
  ) => {
    const response = await prisma.order.updateMany({
      where: {
        id: updateOrder.id,
        userId: userId,
      },
      data: { status: updateOrder.status },
    });

    if (response.count === 0) {
      throw new AppError(400, 'User is not the owner or order not found');
    }

    return { message: 'the order status has been updated' };
  };
}

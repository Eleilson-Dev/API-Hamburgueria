import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { OrderService } from '../services/Order.service';

@injectable()
export class OrderController {
  constructor(@inject('OrderService') private orderService: OrderService) {}

  public findAllOrders = async (req: Request, res: Response) => {
    const response = await this.orderService.findAllOrders();

    return res.status(200).json(response);
  };

  public createOrder = async (req: Request, res: Response) => {
    const response = await this.orderService.createOrder(
      res.locals.encodedToken.id,
      req.body
    );

    return res.status(200).json(response);
  };

  public updateOrderStatus = async (req: Request, res: Response) => {
    const response = await this.orderService.updateOrderStatus(
      req.body,
      res.locals.encodedToken.id
    );

    return res.status(200).json(response);
  };
}

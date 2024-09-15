import { Router } from 'express';
import { container } from 'tsyringe';
import { OrderService } from '../services/Order.service';
import { OrderController } from '../controllers/Order.controller';
import { ValidateBody } from '../middlewares/ValidateBody.middleware';
import { orderCreateSchema } from '../schemas/order.schema';
import { CheckPendingOrder } from '../middlewares/CheckPendingOrder.middleware';

export const orderRouter = Router();

container.registerSingleton('OrderService', OrderService);
const orderController = container.resolve(OrderController);

orderRouter.post(
  '/create/:id',
  ValidateBody.execute(orderCreateSchema),
  CheckPendingOrder.execute,
  (req, res) => orderController.createOrder(req, res)
);

orderRouter.get('/', (req, res) => orderController.findAllOrders(req, res));

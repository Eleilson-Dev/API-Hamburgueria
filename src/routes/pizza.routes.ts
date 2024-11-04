import { Router } from 'express';

import { container } from 'tsyringe';
import { PizzaService } from '../services/Pizza.service';
import { PizzaController } from '../controllers/Pizza.controller';
import { VerifyToken } from '../middlewares/VerifyToken.middleware';
import { ValidateBody } from '../middlewares/ValidateBody.middleware';
import { pizzaCreateSchema, pizzaUpdateSchema } from '../schemas/pizza.schema';
import { upload } from '../config/multer';

export const pizzaRouter = Router();

container.registerSingleton('PizzaService', PizzaService);
const pizzaController = container.resolve(PizzaController);

pizzaRouter.get('/', VerifyToken.execute, (req, res) =>
  pizzaController.getAllPizzas(req, res)
);

pizzaRouter.get('/:id', VerifyToken.execute, (req, res) =>
  pizzaController.getPizzaById(req, res)
);

pizzaRouter.post(
  '/create',
  VerifyToken.execute,
  upload.single('image'),
  ValidateBody.execute(pizzaCreateSchema),
  (req, res) => pizzaController.createPizza(req, res)
);

pizzaRouter.patch(
  '/edit/product/:id',
  VerifyToken.execute,
  upload.single('image'),
  ValidateBody.execute(pizzaUpdateSchema),
  (req, res) => pizzaController.editPizza(req, res)
);

pizzaRouter.patch('/change/visibility/:id', VerifyToken.execute, (req, res) =>
  pizzaController.changeVisibility(req, res)
);

pizzaRouter.delete('/delete/:id', VerifyToken.execute, (req, res) =>
  pizzaController.deletePizza(req, res)
);

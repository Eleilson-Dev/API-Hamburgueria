import { Router } from 'express';
import { container } from 'tsyringe';
import { HamburguersService } from '../services/Hamburguers.service';
import { HamburguersController } from '../controllers/Hamburguers.controller';
import { hamburguerCreateSchema } from '../schemas/hamburguer.schema';
import { ValidateBody } from '../middlewares/ValidateBody.middleware';

export const lanchesRouter = Router();

container.registerSingleton('HamburguersService', HamburguersService);
const hamburguersController = container.resolve(HamburguersController);

lanchesRouter.get('/', (req, res) =>
  hamburguersController.getAllHamburguers(req, res)
);

lanchesRouter.post(
  '/create',
  ValidateBody.execute(hamburguerCreateSchema),
  (req, res) => hamburguersController.createHamburguer(req, res)
);

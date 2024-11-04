import { Router } from 'express';
import { upload } from '../config/multer';
import { ValidateBody } from '../middlewares/ValidateBody.middleware';
import { cakeCreateSchema, cakeUpdateSchema } from '../schemas/cake.schema';
import { IsImgValid } from '../middlewares/IsImageValid.middleware';
import { container } from 'tsyringe';
import { CakeService } from '../services/Cake.service';
import { CakeController } from '../controllers/Cake.cotroller';
import { VerifyToken } from '../middlewares/VerifyToken.middleware';
import { OptionalImgValid } from '../middlewares/OptionalImgValid.middleware';

export const cakeRouter = Router();

container.registerSingleton('CakeService', CakeService);
const cakeController = container.resolve(CakeController);

cakeRouter.get('/', (req, res) => cakeController.getAllCakes(req, res));

cakeRouter.get('/:id', VerifyToken.execute, (req, res) =>
  cakeController.getCakeById(req, res)
);

cakeRouter.post(
  '/create',
  VerifyToken.execute,
  upload.single('image'),
  ValidateBody.execute(cakeCreateSchema),
  IsImgValid.execute,
  (req, res) => cakeController.createCake(req, res)
);

cakeRouter.patch('/change/visibility/:id', VerifyToken.execute, (req, res) =>
  cakeController.changeVisibility(req, res)
);

cakeRouter.patch(
  '/edit/product/:id',
  VerifyToken.execute,
  upload.single('image'),
  OptionalImgValid.execute,
  ValidateBody.execute(cakeUpdateSchema),
  (req, res) => cakeController.updateCake(req, res)
);

cakeRouter.delete('/delete/:id', (req, res) =>
  cakeController.deleteCake(req, res)
);

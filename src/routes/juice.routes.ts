import { Router } from 'express';
import { container } from 'tsyringe';
import { JuiceService } from '../services/Juice.service';
import { JuiceController } from '../controllers/Juice.controller';
import { VerifyToken } from '../middlewares/VerifyToken.middleware';
import { ValidateBody } from '../middlewares/ValidateBody.middleware';
import { juiceCreateSchema, juiceUpdateSchema } from '../schemas/juice.schema';
import { upload } from '../config/multer';
import { IsImgValid } from '../middlewares/IsImageValid.middleware';

export const juiceRouter = Router();

container.registerSingleton('JuiceService', JuiceService);
const juiceController = container.resolve(JuiceController);

juiceRouter.get('/', VerifyToken.execute, (req, res) =>
  juiceController.getAllJuices(req, res)
);

juiceRouter.get('/:id', VerifyToken.execute, (req, res) =>
  juiceController.getJuiceById(req, res)
);

juiceRouter.post(
  '/create',
  VerifyToken.execute,
  upload.single('image'),
  ValidateBody.execute(juiceCreateSchema),
  IsImgValid.execute,
  (req, res) => juiceController.createJuice(req, res)
);

juiceRouter.patch(
  '/edit/product/:id',
  VerifyToken.execute,
  upload.single('image'),
  ValidateBody.execute(juiceUpdateSchema),
  (req, res) => juiceController.editJuice(req, res)
);

juiceRouter.patch('/change/visibility/:id', VerifyToken.execute, (req, res) =>
  juiceController.changeVisibility(req, res)
);

juiceRouter.delete('/delete/:id', VerifyToken.execute, (req, res) =>
  juiceController.deleteJuice(req, res)
);

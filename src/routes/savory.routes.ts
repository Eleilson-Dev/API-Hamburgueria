import { Router } from 'express';
import { container } from 'tsyringe';
import { SavoryService } from '../services/Savory.service';
import { SavoryController } from '../controllers/Savory.controller';
import { VerifyToken } from '../middlewares/VerifyToken.middleware';
import { ValidateBody } from '../middlewares/ValidateBody.middleware';
import {
  savoryCreateSchema,
  savoryUpdateSchema,
} from '../schemas/savory.schema';
import { upload } from '../config/multer';

export const savoryRouter = Router();

container.registerSingleton('SavoryService', SavoryService);
const savoryController = container.resolve(SavoryController);

savoryRouter.get('/', VerifyToken.execute, (req, res) =>
  savoryController.getAllSavorys(req, res)
);

savoryRouter.get('/:id', VerifyToken.execute, (req, res) =>
  savoryController.getSavoryById(req, res)
);

savoryRouter.post(
  '/create',
  VerifyToken.execute,
  upload.single('image'),
  ValidateBody.execute(savoryCreateSchema),
  (req, res) => savoryController.createSavory(req, res)
);

savoryRouter.patch('/change/visibility/:id', VerifyToken.execute, (req, res) =>
  savoryController.changeVisibility(req, res)
);

savoryRouter.patch(
  '/edit/product/:id',
  VerifyToken.execute,
  upload.single('image'),
  ValidateBody.execute(savoryUpdateSchema),
  (req, res) => savoryController.editSavory(req, res)
);

savoryRouter.delete('/delete/:id', VerifyToken.execute, (req, res) =>
  savoryController.deleteSavory(req, res)
);

import { Router } from 'express';
import { container } from 'tsyringe';
import { SodaService } from '../services/Soda.service';
import { SodaController } from '../controllers/Soda.controller';
import { sodaCreateSchema, sodaUpdateSchema } from '../schemas/soda.schema';
import { ValidateBody } from '../middlewares/ValidateBody.middleware';
import { VerifyToken } from '../middlewares/VerifyToken.middleware';
import { upload } from '../config/multer';

export const sodaRouter = Router();

container.registerSingleton('SodaService', SodaService);
const sodaController = container.resolve(SodaController);

sodaRouter.get('/', VerifyToken.execute, (req, res) =>
  sodaController.getAllSodas(req, res)
);

sodaRouter.get('/:id', VerifyToken.execute, (req, res) =>
  sodaController.getSodaById(req, res)
);

sodaRouter.post(
  '/create',
  VerifyToken.execute,
  upload.single('image'),
  ValidateBody.execute(sodaCreateSchema),
  (req, res) => sodaController.createSoda(req, res)
);

sodaRouter.patch(
  '/edit/product/:id',
  VerifyToken.execute,
  upload.single('image'),
  ValidateBody.execute(sodaUpdateSchema),
  (req, res) => sodaController.editSoda(req, res)
);

sodaRouter.patch('/change/visibility/:id', VerifyToken.execute, (req, res) =>
  sodaController.changeVisibility(req, res)
);

sodaRouter.delete('/delete/:id', VerifyToken.execute, (req, res) =>
  sodaController.deleteSoda(req, res)
);

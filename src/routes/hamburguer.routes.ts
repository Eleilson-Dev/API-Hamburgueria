import { Router } from 'express';
import { container } from 'tsyringe';
import { HamburguerService } from '../services/Hamburguer.service';
import { HamburguerController } from '../controllers/Hamburguer.controller';
import {
  hamburguerCreateSchema,
  hamburguerUpdateSchema,
} from '../schemas/hamburguer.schema';
import { ValidateBody } from '../middlewares/ValidateBody.middleware';
import { VerifyToken } from '../middlewares/VerifyToken.middleware';
import { upload } from '../config/multer';
import { IsImgValid } from '../middlewares/IsImageValid.middleware';
import { OptionalImgValid } from '../middlewares/OptionalImgValid.middleware';

export const hamburguerRouter = Router();

container.registerSingleton('HamburguerService', HamburguerService);
const hamburguerController = container.resolve(HamburguerController);

hamburguerRouter.get('/', VerifyToken.execute, (req, res) =>
  hamburguerController.getAllHamburguers(req, res)
);

hamburguerRouter.get('/:id', VerifyToken.execute, (req, res) =>
  hamburguerController.getHamburguerById(req, res)
);

hamburguerRouter.post(
  '/create',
  VerifyToken.execute,
  upload.single('image'),
  ValidateBody.execute(hamburguerCreateSchema),
  IsImgValid.execute,
  (req, res) => hamburguerController.createHamburguer(req, res)
);

hamburguerRouter.patch(
  '/edit/product/:id',
  VerifyToken.execute,
  upload.single('image'),
  OptionalImgValid.execute,
  ValidateBody.execute(hamburguerUpdateSchema),
  (req, res) => hamburguerController.editHamburguer(req, res)
);

hamburguerRouter.patch(
  '/change/visibility/:id',
  VerifyToken.execute,
  (req, res) => hamburguerController.changeVisibility(req, res)
);

hamburguerRouter.delete('/delete/:id', VerifyToken.execute, (req, res) =>
  hamburguerController.deleteHamburguer(req, res)
);

import { Router } from 'express';
import { container } from 'tsyringe';
import { UserService } from '../services/User.service';
import { UserController } from '../controllers/User.controller';
import { ValidateBody } from '../middlewares/ValidateBody.middleware';
import { userCreateSchema } from '../schemas/user.schema';

export const userRouter = Router();

container.registerSingleton('UserService', UserService);
const userController = container.resolve(UserController);

userRouter.post('/', ValidateBody.execute(userCreateSchema), (req, res) =>
  userController.createUser(req, res)
);

userRouter.get('/', (req, res) => userController.findAllUsers(req, res));

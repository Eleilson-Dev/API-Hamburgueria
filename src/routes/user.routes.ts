import { Router } from 'express';
import { container } from 'tsyringe';
import { UserService } from '../services/User.service';
import { UserController } from '../controllers/User.controller';
import { ValidateBody } from '../middlewares/ValidateBody.middleware';
import { userCreateSchema, userLoginSchema } from '../schemas/user.schema';
import { VerifyLoginUser } from '../middlewares/VerifyLoginUser.middleware';
import { VerifyToken } from '../middlewares/VerifyToken.middleware';

export const userRouter = Router();

container.registerSingleton('UserService', UserService);
const userController = container.resolve(UserController);

userRouter.post('/', ValidateBody.execute(userCreateSchema), (req, res) =>
  userController.createUser(req, res)
);

userRouter.get('/', VerifyToken.execute, (req, res) =>
  userController.findAllUsers(req, res)
);

userRouter.get('/current', VerifyToken.execute, (req, res) =>
  userController.findById(req, res)
);

userRouter.post(
  '/login',
  ValidateBody.execute(userLoginSchema),
  VerifyLoginUser.execute,
  (req, res) => userController.loginUser(req, res)
);

import { Router } from 'express';
import { container } from 'tsyringe';
import { UserService } from '../services/User.service';
import { UserController } from '../controllers/User.controller';
import { ValidateBody } from '../middlewares/ValidateBody.middleware';
import {
  userCreateSchema,
  userLoginSchema,
  userCodeSchema,
} from '../schemas/user.schema';
import { VerifyLoginUser } from '../middlewares/VerifyLoginUser.middleware';
import { VerifyToken } from '../middlewares/VerifyToken.middleware';
import { SendVerificationEmail } from '../middlewares/SendVerificationEmail.middleware';
import { ResendVerificationCode } from '../middlewares/ResendVerificationCode.middleware';
import { ValidateCacheAndExpiration } from '../middlewares/ValidateCacheAndExpiration.middleware';
import { IsEmailExits } from '../middlewares/IsEmailexists.middleware';
import { SendVerificationToRecoverPass } from '../middlewares/SendVerificationToRecoverPass.middleware';
import { IsEmailExistsToRecover } from '../middlewares/IsEmailExistsToRecover.middleware';
import { ResendVerificationRecoveryCode } from '../middlewares/ResendVerificationRecoveryCode.middleware';
import { VerifyTokenRecovery } from '../middlewares/VerifyTokenRecovery.middleware';

export const userRouter = Router();

container.registerSingleton('UserService', UserService);
const userController = container.resolve(UserController);

userRouter.post(
  '/',
  ValidateBody.execute(userCreateSchema),
  IsEmailExits.execute,
  SendVerificationEmail.execute,
  (req, res) => userController.validateUser(req, res)
);

userRouter.post(
  '/register',
  ValidateBody.execute(userCodeSchema),
  ValidateCacheAndExpiration.execute,
  (req, res) => userController.createUser(req, res)
);

userRouter.post(
  '/resend/code',
  ResendVerificationCode.execute,
  ValidateCacheAndExpiration.execute,
  (req, res) => userController.resendVerificationCode(req, res)
);

userRouter.post(
  '/resend/recovery/code',
  ResendVerificationRecoveryCode.execute,
  ValidateCacheAndExpiration.execute,
  (req, res) => userController.resendVerificationCode(req, res)
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

userRouter.post(
  '/send/reset/code',
  IsEmailExistsToRecover.execute,
  SendVerificationToRecoverPass.execute,
  (req, res) => userController.makeRecover(req, res)
);

userRouter.post(
  '/validate/recovery',
  ValidateCacheAndExpiration.execute,
  (req, res) => userController.confirmRecoveryCode(req, res)
);

userRouter.post('/reset/password', VerifyTokenRecovery.execute, (req, res) =>
  userController.resetPassword(req, res)
);

userRouter.post('/login/google', (req, res) =>
  userController.loginWithGoogle(req, res)
);

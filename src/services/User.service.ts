import { injectable } from 'tsyringe';
import {
  TUserCreate,
  TUserLoginResult,
  userReturnSchema,
  userLoginResult,
  userCreateDataSchema,
} from '../schemas/user.schema';
import { prisma } from '../database/prisma';
import { AppError } from '../errors/AppError';
import { addMinutes } from 'date-fns';
import bcrypt from 'bcryptjs';
import { getFromCache, saveToCache, removeFromCache } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import axios from 'axios';

@injectable()
export class UserService {
  public findAllUsers = async () => {
    const response = prisma.user.findMany();

    return response;
  };

  public findById = async (userID: number) => {
    const response = await prisma.user.findFirst({ where: { id: userID } });

    if (!response) {
      throw new AppError(404, 'User not found');
    }

    return userReturnSchema.parse(response);
  };

  public validateUser = async (userBody: TUserCreate) => {
    try {
      const expiresAt = addMinutes(new Date(), 1);

      const hash = await bcrypt.hashSync(userBody.password, 10);

      const user = {
        name: userBody.name,
        email: userBody.email,
        password: hash,
        role: userBody.role,
        code: userBody.code.toString(),
        expiresAt,
      };

      const userId = uuidv4();
      const userJson = JSON.stringify(user);

      await saveToCache(`cacheKey:${userId}`, userJson);

      return {
        user: JSON.parse(userJson),
        userId,
        message: 'email enviado',
      };
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }

      throw new AppError(500, 'Erro ao enviar o código de verificação');
    }
  };

  public createUser = async (userId: string, code: string) => {
    const responseCache = await getFromCache(`cacheKey:${userId}`);

    const result = JSON.parse(responseCache as string);

    if (code !== result.code) {
      throw new AppError(400, 'the code is not valid');
    }

    const useData = userCreateDataSchema.parse(result);

    const newUser = await prisma.user.create({
      data: { ...useData },
    });

    const accessToken = jwt.sign(
      {
        id: newUser.id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    await removeFromCache(`cacheKey:${userId}`);

    return { accessToken };
  };

  public resendVerificationCode = async () => {
    return { message: 'codigo reenviado' };
  };

  public loginUser = async (userLoginResult: TUserLoginResult) => {
    return userLoginResult;
  };

  public makeRecovery = async (userRecoverBody: any) => {
    try {
      const expiresAt = addMinutes(new Date(), 1);

      const userRecover = {
        email: userRecoverBody.email,
        code: userRecoverBody.code.toString(),
        expiresAt,
      };

      const userRecoverId = uuidv4();
      const userRecoverJson = JSON.stringify(userRecover);

      await saveToCache(`cacheKey:${userRecoverId}`, userRecoverJson);

      return {
        userRecover: JSON.parse(userRecoverJson),
        userRecoverId,
        message: 'email enviado',
      };
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }

      throw new AppError(500, 'Erro ao enviar o código de recuperação');
    }
  };

  public confirmRecoveryCode = async (
    userId: string,
    userEmail: string,
    code: string
  ) => {
    const responseCache = await getFromCache(`cacheKey:${userId}`);

    const result = JSON.parse(responseCache as string);

    if (code !== result.code) {
      throw new AppError(400, 'the code is not valid');
    }

    const token = jwt.sign(
      { userEmail },
      process.env.JWT_SECRET_RECOVER as string,
      {
        expiresIn: '10m',
      }
    );

    await removeFromCache(`cacheKey:${userId}`);

    return { accessTokenRecover: token };
  };

  public resetPassword = async (recoveryToken: string, password: string) => {
    const hash = await bcrypt.hashSync(password, 10);

    await prisma.user.update({
      where: { email: recoveryToken },
      data: { password: hash },
    });
  };

  public loginWithGoogle = async (access_token: string) => {
    try {
      const userInfoResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const { email, name, picture } = userInfoResponse.data;

      let userWithGoogle = await prisma.user.findFirst({
        where: { email },
      });

      if (!userWithGoogle) {
        userWithGoogle = await prisma.user.create({
          data: { name, email, image: picture, role: 'regular' },
        });
      }

      const accessToken = jwt.sign(
        {
          id: userWithGoogle.id,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      return {
        userWithGoogle: userLoginResult.parse(userWithGoogle),
        accessToken,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Error during Google login');
    }
  };
}

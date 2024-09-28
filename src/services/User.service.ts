import { injectable } from 'tsyringe';
import {
  TUserCreate,
  TUserLoginResult,
  userReturnSchema,
  userCreateSchema,
} from '../schemas/user.schema';
import { prisma } from '../database/prisma';
import { AppError } from '../errors/AppError';
import { addMinutes } from 'date-fns';
import bcrypt from 'bcryptjs';
import { getFromCache, saveToCache, removeFromCache } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

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
        code: userBody.code.toString(),
        expiresAt,
      };

      const userId = uuidv4();
      const userJson = JSON.stringify(user);

      await saveToCache(`user:${userId}`, userJson);

      return {
        user: JSON.parse(userJson),
        userId,
        message: 'email enviado',
      };
    } catch (err) {
      console.log('Erro no envio do email:', err);
      return { message: 'Erro ao enviar o código de verificação', err };
    }
  };

  public createUser = async (userId: string, code: string) => {
    const responseCache = await getFromCache(`user:${userId}`);

    const result = JSON.parse(responseCache as string);

    if (code !== result.code) {
      throw new AppError(400, 'the code is not valid');
    }

    const useData = userCreateSchema.parse(result);

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

    await removeFromCache(`user:${userId}`);

    return { accessToken };
  };

  public resendVerificationCode = async () => {
    return { message: 'codigo reenviado' };
  };

  public loginUser = async (userLoginResult: TUserLoginResult) => {
    return userLoginResult;
  };
}

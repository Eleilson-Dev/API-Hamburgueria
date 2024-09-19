import { injectable } from 'tsyringe';
import {
  TUserCreate,
  TUserLoginResult,
  userReturnSchema,
} from '../schemas/user.schema';
import { prisma } from '../database/prisma';
import bcrypt from 'bcryptjs';
import { AppError } from '../errors/AppError';

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

  public createUser = async (userBody: TUserCreate) => {
    const hash = await bcrypt.hashSync(userBody.password, 10);

    const response = await prisma.user.create({
      data: { ...userBody, password: hash },
    });

    return userReturnSchema.parse(response);
  };

  public loginUser = async (userLoginResult: TUserLoginResult) => {
    return userLoginResult;
  };
}

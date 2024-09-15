import { injectable } from 'tsyringe';
import { TUserCreate, userReturnSchema } from '../schemas/user.schema';
import { prisma } from '../database/prisma';
import bcrypt from 'bcryptjs';

@injectable()
export class UserService {
  public findAllUsers = async () => {
    const response = prisma.user.findMany();

    return response;
  };

  public createUser = async (userBody: TUserCreate) => {
    const hash = await bcrypt.hashSync(userBody.password, 10);

    const reponse = await prisma.user.create({
      data: { ...userBody, password: hash },
    });

    return userReturnSchema.parse(reponse);
  };
}

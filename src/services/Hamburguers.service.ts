import { injectable } from 'tsyringe';
import { THamburguerCreate } from '../schemas/hamburguer.schema';
import { prisma } from '../database/prisma';

@injectable()
export class HamburguersService {
  public getAllHamburguers = async () => {
    const response = await prisma.hamburguer.findMany();

    return response;
  };

  public createHamburguer = async (hamburguerBody: THamburguerCreate) => {
    const response = await prisma.hamburguer.create({ data: hamburguerBody });

    return response;
  };
}

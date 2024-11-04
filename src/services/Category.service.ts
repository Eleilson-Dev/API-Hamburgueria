import { prisma } from '../database/prisma';
import { injectable } from 'tsyringe';

@injectable()
export class CategoryService {
  public getAllCategories = async () => {
    const response = await prisma.category.findMany();

    return response;
  };
}

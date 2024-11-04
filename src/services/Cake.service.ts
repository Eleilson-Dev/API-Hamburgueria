import { injectable } from 'tsyringe';
import { prisma } from '../database/prisma';
import { uploadImageToFirebase } from '../config/multer';
import { bucket } from '../config/firebase';
import { AppError } from '../errors/AppError';
import { TCakeCreate, TCakeUpdate } from '../schemas/cake.schema';

@injectable()
export class CakeService {
  public getAllCakes = async () => {
    const response = await prisma.cake.findMany({
      include: { category: true },
    });

    return response;
  };

  public getCakeById = async (id: number) => {
    const response = await prisma.cake.findFirst({
      where: { id },
      include: { category: true },
    });

    if (!response) {
      throw new AppError(404, 'Cake not found');
    }

    return response;
  };

  public createCake = async (cakeCreateData: TCakeCreate, file: unknown) => {
    try {
      const imageUrl = await uploadImageToFirebase(file);

      const newCake = await prisma.cake.create({
        data: {
          ...cakeCreateData,
          imageUrl: imageUrl as string,
        },
      });

      return newCake;
    } catch (error) {
      console.error(error);
      return { error: 'Erro ao criar produto' };
    }
  };

  public changeVisibility = async (cakeId: number, visibility: boolean) => {
    try {
      await prisma.cake.update({
        where: { id: cakeId },
        data: { visibility },
      });
    } catch (error) {
      console.error(error);
      return { error: 'Erro ao tentar mudar a visibilidade do produto' };
    }
  };

  public updateCake = async (
    cakeId: number,
    cakeUpdateData: TCakeUpdate,
    file: unknown
  ) => {
    try {
      const existingCake = await prisma.cake.findUnique({
        where: { id: cakeId },
      });

      if (!existingCake) throw new AppError(404, 'Product not found');

      if (existingCake.imageUrl && file) {
        const fileName = existingCake.imageUrl.split('/').pop();
        await bucket.file(fileName as string).delete();
      }

      const imageUrl = file
        ? await uploadImageToFirebase(file)
        : existingCake.imageUrl;

      await prisma.cake.update({
        where: { id: cakeId },
        data: {
          ...cakeUpdateData,
          imageUrl: imageUrl as string,
        },
      });
    } catch (error) {
      console.error(error);
      return { error: 'Erro ao atualizar produto' };
    }
  };

  public deleteCake = async (cakeId: number) => {
    try {
      const existingCake = await prisma.cake.findUnique({
        where: { id: cakeId },
        select: { imageUrl: true },
      });

      if (!existingCake) {
        throw new AppError(404, 'Cake not found');
      }

      const fileName = existingCake.imageUrl.split('/').pop();
      await bucket.file(fileName as string).delete();

      await prisma.cake.delete({
        where: { id: cakeId },
      });
    } catch (error) {
      console.error(error);
      return { error: 'Erro ao deletar produto' };
    }
  };
}

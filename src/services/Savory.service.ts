import { injectable } from 'tsyringe';
import { TSavoryCreate, TSavoryUpdate } from '../schemas/savory.schema';
import { prisma } from '../database/prisma';
import { AppError } from '../errors/AppError';
import { uploadImageToFirebase } from '../config/multer';
import { bucket } from '../config/firebase';

@injectable()
export class SavoryService {
  public getAllSavorys = async () => {
    const response = await prisma.savory.findMany({
      include: { category: true },
    });

    return response;
  };

  public getSavoryById = async (id: number) => {
    const response = await prisma.savory.findFirst({
      where: { id },
      include: { category: true },
    });

    return response;
  };

  public createSavory = async (
    savoryCreateData: TSavoryCreate,
    file: unknown
  ) => {
    try {
      const imageUrl = await uploadImageToFirebase(file);

      const newSavory = await prisma.savory.create({
        data: { ...savoryCreateData, imageUrl: imageUrl as string },
      });

      return newSavory;
    } catch (error) {
      console.error(error);
      return { error: 'Erro ao criar produto' };
    }
  };

  public editSavory = async (
    savoryId: number,
    savoryUpdateData: TSavoryUpdate,
    file: unknown
  ) => {
    try {
      const existingSavory = await prisma.savory.findUnique({
        where: { id: savoryId },
        select: { imageUrl: true },
      });

      if (!existingSavory) throw new AppError(404, 'Product not found');

      if (existingSavory.imageUrl && file) {
        const fileName = existingSavory.imageUrl.split('/').pop();
        await bucket.file(fileName as string).delete();
      }

      const imageUrl = file
        ? await uploadImageToFirebase(file)
        : existingSavory.imageUrl;

      await prisma.savory.update({
        where: { id: savoryId },
        data: { ...savoryUpdateData, imageUrl: imageUrl as string },
      });
    } catch (error) {
      console.error(error);
      return { error: 'Erro ao atualizar produto' };
    }
  };

  public changeVisibility = async (savoryId: number, visibility: boolean) => {
    try {
      await prisma.savory.update({
        where: { id: savoryId },
        data: { visibility },
      });
    } catch (error) {
      console.log(error);
      return {
        error: 'Erro ao tentar mudar a visibilidade do produto',
      };
    }
  };

  public deleteSavory = async (savoryId: number) => {
    try {
      const existingSavory = await prisma.savory.findUnique({
        where: { id: savoryId },
        select: { imageUrl: true },
      });

      if (!existingSavory) {
        throw new AppError(404, 'Cake not found');
      }

      const fileName = existingSavory.imageUrl.split('/').pop();
      await bucket.file(fileName as string).delete();

      await prisma.savory.delete({ where: { id: savoryId } });
    } catch (error) {
      console.error(error);
      return { error: 'Erro ao deletar produto' };
    }
  };
}

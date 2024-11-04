import { injectable } from 'tsyringe';
import { prisma } from '../database/prisma';
import { TSodaCreate, TSodaUpdate } from '../schemas/soda.schema';
import { uploadImageToFirebase } from '../config/multer';
import { AppError } from '../errors/AppError';
import { bucket } from '../config/firebase';

@injectable()
export class SodaService {
  async getAllSodas() {
    try {
      return await prisma.soda.findMany({ include: { category: true } });
    } catch (error) {
      console.log(error);
      return { error: 'erro ao tentar buscar todos os refrigerantes' };
    }
  }

  async getSodaById(id: number) {
    try {
      return await prisma.soda.findUnique({
        where: { id },
        include: { category: true },
      });
    } catch (error) {
      console.log(error);
      return { error: 'Erro ao tentar buscar o refirgerante' };
    }
  }

  async createSoda(sodaCreatedata: TSodaCreate, file: unknown) {
    try {
      const imageUrl = await uploadImageToFirebase(file);

      return await prisma.soda.create({
        data: { ...sodaCreatedata, imageUrl: imageUrl as string },
      });
    } catch (error) {
      console.error(error);
      return { error: 'Erro ao criar produto' };
    }
  }

  public changeVisibility = async (sodaId: number, visibility: boolean) => {
    try {
      await prisma.soda.update({
        where: { id: sodaId },
        data: { visibility },
      });
    } catch (error) {
      console.log(error);
      return { error: 'erro ao tentar mudar a visibilidade do refrigerante' };
    }
  };

  async editSoda(sodaId: number, sodaUpdateData: TSodaUpdate, file: unknown) {
    try {
      const existingSoda = await prisma.soda.findUnique({
        where: { id: sodaId },
        select: { imageUrl: true },
      });

      if (!existingSoda) throw new AppError(404, 'Soda not found');

      if (existingSoda.imageUrl && file) {
        const fileName = existingSoda.imageUrl.split('/').pop();
        await bucket.file(fileName as string).delete();
      }

      const imageUrl = file
        ? await uploadImageToFirebase(file)
        : existingSoda.imageUrl;

      await prisma.soda.update({
        where: { id: sodaId },
        data: { ...sodaUpdateData, imageUrl: imageUrl as string },
      });
    } catch (error) {
      console.log(error);
      return { error: 'Erro ao tentar atualizar o refrigeregante' };
    }
  }

  async deleteSoda(sodaId: number) {
    try {
      const existingSoda = await prisma.soda.findUnique({
        where: { id: sodaId },
        select: { imageUrl: true },
      });

      if (!existingSoda) throw new AppError(404, 'Soda not found');

      const fileName = existingSoda.imageUrl.split('/').pop();
      await bucket.file(fileName as string).delete();

      await prisma.soda.delete({ where: { id: sodaId } });
    } catch (error) {
      console.log(error);
      return { error: 'erro ao tentar deletar o refrigerante' };
    }
  }
}

import { injectable } from 'tsyringe';
import { prisma } from '../database/prisma';
import { TJuiceCreate, TJuiceUpdate } from '../schemas/juice.schema';
import { uploadImageToFirebase } from '../config/multer';
import { bucket } from '../config/firebase';
import { AppError } from '../errors/AppError';

@injectable()
export class JuiceService {
  public getAllJuices = async () => {
    try {
      return await prisma.juice.findMany({
        include: { category: true },
      });
    } catch (error) {
      console.log(error);
      return { error: 'Erro ao tentar buscar todos os sucos' };
    }
  };

  async getJuiceById(juiceId: number) {
    try {
      return await prisma.juice.findUnique({
        where: { id: juiceId },
        include: { category: true },
      });
    } catch (error) {
      console.log(error);
      return { error: 'Erro ao tentar buscar o suco' };
    }
  }

  async createJuice(juiceData: TJuiceCreate, file: unknown) {
    try {
      const imageUrl = await uploadImageToFirebase(file);

      const newJuice = await prisma.juice.create({
        data: { ...juiceData, imageUrl: imageUrl as string },
      });

      return newJuice;
    } catch (error) {
      console.error(error);
      return { error: 'Erro ao criar produto' };
    }
  }

  public changeVisibility = async (juiceId: number, visibility: boolean) => {
    try {
      await prisma.juice.update({
        where: { id: juiceId },
        data: { visibility },
      });
    } catch (error) {
      console.log(error);
      return { error: 'Erro ao tentar mudar a visibilidade do suco' };
    }
  };

  async editJuice(
    juiceId: number,
    juiceUpdateData: TJuiceUpdate,
    file: unknown
  ) {
    try {
      const existingJuice = await prisma.juice.findUnique({
        where: { id: juiceId },
        select: { imageUrl: true },
      });

      if (!existingJuice) throw new AppError(404, 'Juice not found');

      if (existingJuice.imageUrl && file) {
        const fileName = existingJuice.imageUrl.split('/').pop();
        await bucket.file(fileName as string).delete();
      }

      const imageUrl = file
        ? await uploadImageToFirebase(file)
        : existingJuice.imageUrl;

      await prisma.juice.update({
        where: { id: juiceId },
        data: { ...juiceUpdateData, imageUrl: imageUrl as string },
      });
    } catch (error) {
      console.log(error);
      return { error: 'Erro ao tentar atualizar o suco' };
    }
  }

  async deleteJuice(juiceId: number) {
    try {
      const existingJuice = await prisma.juice.findUnique({
        where: { id: juiceId },
        select: { imageUrl: true },
      });

      if (!existingJuice) throw new AppError(404, 'Juice not found');

      const fileName = existingJuice.imageUrl.split('/').pop();
      await bucket.file(fileName as string).delete();

      await prisma.juice.delete({ where: { id: juiceId } });
    } catch (error) {
      console.log(error);
      return { error: 'Erro ao tentar deletar o suco' };
    }
  }
}

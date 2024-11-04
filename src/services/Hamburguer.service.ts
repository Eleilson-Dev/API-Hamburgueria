import { injectable } from 'tsyringe';
import {
  THamburguerCreate,
  THamburguerUpdate,
} from '../schemas/hamburguer.schema';
import { prisma } from '../database/prisma';
import { AppError } from '../errors/AppError';
import { uploadImageToFirebase } from '../config/multer';
import { bucket } from '../config/firebase';

@injectable()
export class HamburguerService {
  public getAllHamburguers = async () => {
    const response = await prisma.hamburguer.findMany({
      include: { category: true },
    });

    return response;
  };

  public getHamburguerById = async (id: number) => {
    const response = await prisma.hamburguer.findFirst({
      where: { id },
      include: { category: true },
    });

    return response;
  };

  public createHamburguer = async (
    hamburguerCreateData: THamburguerCreate,
    file: unknown
  ) => {
    try {
      const imageUrl = await uploadImageToFirebase(file);

      const newHamburguer = await prisma.hamburguer.create({
        data: { ...hamburguerCreateData, imageUrl: imageUrl as string },
      });

      return newHamburguer;
    } catch (error) {
      console.error(error);
      return { error: 'Erro ao criar produto' };
    }
  };

  public editHamburguer = async (
    hamburguerId: number,
    hamburguerUpdateData: THamburguerUpdate,
    file: unknown
  ) => {
    try {
      const existingHamburguer = await prisma.hamburguer.findUnique({
        where: { id: hamburguerId },
        select: { imageUrl: true },
      });

      if (!existingHamburguer) throw new AppError(404, 'Product not found');

      if (existingHamburguer.imageUrl && file) {
        const fileName = existingHamburguer.imageUrl.split('/').pop();
        await bucket.file(fileName as string).delete();
      }

      const imageUrl = file
        ? await uploadImageToFirebase(file)
        : existingHamburguer.imageUrl;

      await prisma.hamburguer.update({
        where: { id: hamburguerId },
        data: { ...hamburguerUpdateData, imageUrl: imageUrl as string },
      });
    } catch (error) {
      console.error(error);
      return { error: 'Erro ao atualizar produto' };
    }
  };

  public changeVisibility = async (
    hamburguerId: number,
    visibility: boolean
  ) => {
    try {
      await prisma.hamburguer.update({
        where: { id: hamburguerId },
        data: { visibility },
      });
    } catch (error) {
      console.error(error);
      return { error: 'Erro ao tentar mudar a visibilidade do produto' };
    }
  };

  public deleteHamburguer = async (hamburguerId: number) => {
    try {
      const existingHamburguer = await prisma.hamburguer.findUnique({
        where: { id: hamburguerId },
        select: { imageUrl: true },
      });

      if (!existingHamburguer) {
        throw new AppError(404, 'Hamguerguer not found');
      }

      const fileName = existingHamburguer.imageUrl.split('/').pop();
      bucket.file(fileName as string).delete();

      await prisma.hamburguer.delete({ where: { id: hamburguerId } });
    } catch (error) {
      console.error(error);
      return { error: 'Erro ao deletar produto' };
    }
  };
}

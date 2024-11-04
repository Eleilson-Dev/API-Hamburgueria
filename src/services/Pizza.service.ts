import { injectable } from 'tsyringe';
import { prisma } from '../database/prisma';
import { AppError } from '../errors/AppError';
import { TPizzaCreate, TPizzaUpdate } from '../schemas/pizza.schema';
import { uploadImageToFirebase } from '../config/multer';
import { bucket } from '../config/firebase';

@injectable()
export class PizzaService {
  public getAllPizzas = async () => {
    try {
      return await prisma.pizza.findMany({
        include: { category: true },
      });
    } catch (error) {
      console.log(error);
      return { error: 'erro ao tentar buscar todas as pizzas' };
    }
  };

  public getPizzaById = async (pizzaId: number) => {
    try {
      return await prisma.pizza.findFirst({
        where: { id: pizzaId },
        include: { category: true },
      });
    } catch (error) {
      console.log(error);
      return { error: 'Erro ao tentar buscar a pizza' };
    }
  };

  public createPizza = async (pizzaCreateData: TPizzaCreate, file: unknown) => {
    try {
      const imageUrl = await uploadImageToFirebase(file);

      const newPizza = await prisma.pizza.create({
        data: { ...pizzaCreateData, imageUrl: imageUrl as string },
      });

      return newPizza;
    } catch (error) {
      console.error(error);
      return { error: 'Erro ao criar a pizza' };
    }
  };

  public editPizza = async (
    pizzaId: number,
    productUpdateData: TPizzaUpdate,
    file: unknown
  ) => {
    try {
      const existingPizza = await prisma.pizza.findUnique({
        where: { id: pizzaId },
        select: { imageUrl: true },
      });

      if (!existingPizza) throw new AppError(404, 'Pizza not found');

      if (existingPizza.imageUrl && file) {
        const fileName = existingPizza.imageUrl.split('/').pop();
        await bucket.file(fileName as string).delete();
      }

      const imageUrl = file
        ? await uploadImageToFirebase(file)
        : existingPizza.imageUrl;

      await prisma.pizza.update({
        where: { id: pizzaId },
        data: { ...productUpdateData, imageUrl: imageUrl as string },
      });
    } catch (error) {
      console.error(error);
      return { error: 'Erro ao tentar atualizar a pizza' };
    }
  };

  public changeVisibility = async (pizzaId: number, visibility: boolean) => {
    try {
      await prisma.pizza.update({
        where: { id: pizzaId },
        data: { visibility },
      });
    } catch (error) {
      console.log(error);
      return {
        error: 'Erro ao tentar mudar a visibilidade da pizza',
      };
    }
  };

  public deletePizza = async (pizzaId: number) => {
    try {
      const existingPizza = await prisma.pizza.findUnique({
        where: { id: pizzaId },
        select: { imageUrl: true },
      });

      if (!existingPizza) throw new AppError(404, 'Pizza not found');

      const fileName = existingPizza.imageUrl.split('/').pop();
      await bucket.file(fileName as string).delete();

      await prisma.pizza.delete({ where: { id: pizzaId } });
    } catch (error) {
      console.log(error);
      return { error: 'erro ao tantar deletar a pizza' };
    }
  };
}

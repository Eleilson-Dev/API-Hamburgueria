import { z } from 'zod';

export const pizzaSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  price: z.coerce.number().positive(),
  ingredients: z.array(z.string()).nonempty(),
  size: z.string().min(1),
  categoryName: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const pizzaCreateSchema = pizzaSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const pizzaUpdateSchema = pizzaCreateSchema.partial({
  name: true,
  description: true,
  price: true,
  ingredients: true,
  size: true,
  categoryName: true,
});

export type TPizzaCreate = z.infer<typeof pizzaCreateSchema>;
export type TPizzaUpdate = z.infer<typeof pizzaUpdateSchema>;

export const pizzaReturnSchema = pizzaSchema.omit({
  createdAt: true,
  updatedAt: true,
});

import { z } from 'zod';

export const juiceSchema = z.object({
  id: z.number().positive(),
  name: z.string(),
  price: z.coerce.number().positive(),
  size: z.string(),
  categoryName: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const juiceCreateSchema = juiceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type TJuiceCreate = z.infer<typeof juiceCreateSchema>;

export const juiceUpdateSchema = juiceCreateSchema.partial({
  name: true,
  price: true,
  size: true,
  categoryName: true,
});

export type TJuiceUpdate = z.infer<typeof juiceUpdateSchema>;

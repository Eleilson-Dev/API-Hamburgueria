import { z } from 'zod';

export const sodaSchema = z.object({
  id: z.number().positive(),
  name: z.string(),
  price: z.coerce.number().positive(),
  size: z.string(),
  categoryName: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const sodaCreateSchema = sodaSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type TSodaCreate = z.infer<typeof sodaCreateSchema>;

export const sodaUpdateSchema = sodaCreateSchema.partial({
  name: true,
  price: true,
  size: true,
  categoryName: true,
});

export type TSodaUpdate = z.infer<typeof sodaUpdateSchema>;

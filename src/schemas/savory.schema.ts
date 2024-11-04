import { z } from 'zod';

export const savorySchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  price: z.coerce.number().positive(),
  ingredients: z.array(z.string()).nonempty(),
  categoryName: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const savoryCreateSchema = savorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const savoryUpdateSchema = savoryCreateSchema.partial({
  name: true,
  description: true,
  price: true,
  ingredients: true,
  categoryName: true,
});

export type TSavoryCreate = z.infer<typeof savoryCreateSchema>;
export type TSavoryUpdate = z.infer<typeof savoryUpdateSchema>;

export const savoryReturnSchema = savorySchema.omit({
  createdAt: true,
  updatedAt: true,
});

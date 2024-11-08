import { z } from 'zod';

export const hamburguerSchema = z.object({
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

export const hamburguerCreateSchema = hamburguerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const hamburguerUpdateSchema = hamburguerCreateSchema.partial({
  name: true,
  description: true,
  price: true,
  ingredients: true,
  size: true,
  categoryName: true,
});

export type THamburguerCreate = z.infer<typeof hamburguerCreateSchema>;
export type THamburguerUpdate = z.infer<typeof hamburguerUpdateSchema>;

export const hamburguerReturnSchema = hamburguerSchema.omit({
  createdAt: true,
  updatedAt: true,
});

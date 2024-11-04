import { z } from 'zod';

export const cakeSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  price: z.coerce.number().positive(),
  ingredients: z.string().array().nonempty(),
  categoryName: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const cakeCreateSchema = cakeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const cakeUpdateSchema = cakeCreateSchema.partial({
  name: true,
  description: true,
  price: true,
  ingredients: true,
  categoryName: true,
});

export type TCakeCreate = z.infer<typeof cakeCreateSchema>;
export type TCakeUpdate = z.infer<typeof cakeUpdateSchema>;

export const cakeReturnSchema = cakeSchema.omit({
  createdAt: true,
  updatedAt: true,
});

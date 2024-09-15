import { z } from 'zod';
import { orderSchema } from './order.schema';

export const userSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  orders: z.array(orderSchema).optional(),
});

export const userCreateSchema = userSchema.omit({
  id: true,
  orders: true,
});

export type TUserCreate = z.infer<typeof userCreateSchema>;

export const userReturnSchema = userSchema.omit({
  password: true,
  orders: true,
});
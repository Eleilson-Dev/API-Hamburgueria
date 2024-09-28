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

export const userCreateBodySchema = userCreateSchema.extend({
  code: z.string().min(6),
});

export type TUserCreate = z.infer<typeof userCreateBodySchema>;

export const userCodeSchema = z.object({
  userId: z.string().min(1),
  code: z.string().min(6),
});

export const userReturnSchema = userSchema.omit({
  password: true,
  orders: true,
});

export const userLoginSchema = userSchema.pick({ email: true, password: true });

export const userLoginResult = userSchema.omit({
  password: true,
  orders: true,
});

export type TUserLoginResult = z.infer<typeof userLoginResult>;

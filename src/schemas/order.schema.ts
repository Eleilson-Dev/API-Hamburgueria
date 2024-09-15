import { z } from 'zod';

export const orderSchema = z.object({
  id: z.number().positive(),
  userId: z.number().positive(),
  status: z.string().min(1),
  selectedPayment: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const orderCreateSchema = orderSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    hamburgers: z.array(
      z.object({
        id: z.number().positive().int(),
        quantity: z.number().positive().int(),
      })
    ),
  });

export type TOrderCreate = z.infer<typeof orderCreateSchema>;

import { z } from 'zod';

export const orderSchema = z.object({
  id: z.number().positive(),
  userId: z.number().positive(),
  status: z.string().min(1),
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
    items: z.array(
      z.object({
        id: z.number().positive().int(),
        quantity: z.number().positive().int(),
        type: z.enum([
          'hamburguers',
          'salgados',
          'pizzas',
          'refrigerantes',
          'sucos',
          'bolos',
        ]),
      })
    ),
    priceOrder: z.number().positive(),
  });

export type TOrderCreate = z.infer<typeof orderCreateSchema>;

export const updateOrderSchema = orderSchema.pick({ id: true, status: true });
export type TUpdateOrder = z.infer<typeof updateOrderSchema>;

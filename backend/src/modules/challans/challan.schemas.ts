import { z } from 'zod';

const challanItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const createChallanSchema = z.object({
  body: z.object({
    customerId: z.number().int().positive(),
    items: z.array(challanItemSchema).min(1),
  }),
});

export const updateChallanSchema = createChallanSchema;

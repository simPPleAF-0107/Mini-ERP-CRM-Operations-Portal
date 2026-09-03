import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    sku: z.string().min(1),
    category: z.string().min(1),
    unitPrice: z.number().positive(),
    minStockAlert: z.number().min(0).default(0),
    location: z.string().min(1),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    sku: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    unitPrice: z.number().positive().optional(),
    minStockAlert: z.number().min(0).optional(),
    location: z.string().min(1).optional(),
    isActive: z.boolean().optional(),
  }),
});

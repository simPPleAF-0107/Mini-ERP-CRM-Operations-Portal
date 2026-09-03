import { z } from 'zod';
import { MovementType } from '@prisma/client';

export const createMovementSchema = z.object({
  body: z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive(),
    movementType: z.nativeEnum(MovementType),
    reason: z.string().min(1),
  }),
});

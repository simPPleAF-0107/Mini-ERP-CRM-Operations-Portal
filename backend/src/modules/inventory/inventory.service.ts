import { prisma } from '../../config/database';
import { Prisma, MovementType } from '@prisma/client';

export class InventoryService {
  static async getMovements(filters: any, pagination: { skip: number; take: number; page: number; limit: number }) {
    const where: Prisma.StockMovementWhereInput = {};

    if (filters.productId) where.productId = parseInt(filters.productId);
    if (filters.movementType) where.movementType = filters.movementType;

    const [total, movements] = await Promise.all([
      prisma.stockMovement.count({ where }),
      prisma.stockMovement.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { name: true, sku: true } },
          createdBy: { select: { name: true } },
        },
      }),
    ]);

    return { data: movements, total };
  }

  static async createMovement(data: { productId: number; quantity: number; movementType: MovementType; reason: string }, userId: number) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: data.productId },
      });

      if (!product) throw new Error('Product not found');

      if (data.movementType === MovementType.OUT) {
        if (product.currentStock < data.quantity) {
          const error: any = new Error('Insufficient stock for product ' + product.name + '. Current stock: ' + product.currentStock);
          error.statusCode = 400;
          throw error;
        }
      }

      const stockUpdate = data.movementType === MovementType.IN
        ? { increment: data.quantity }
        : { decrement: data.quantity };

      await tx.product.update({
        where: { id: data.productId },
        data: { currentStock: stockUpdate },
      });

      return tx.stockMovement.create({
        data: {
          productId: data.productId,
          quantity: data.quantity,
          movementType: data.movementType,
          reason: data.reason,
          createdById: userId,
        },
      });
    });
  }
}

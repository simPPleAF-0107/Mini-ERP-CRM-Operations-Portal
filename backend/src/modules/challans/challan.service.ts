import { prisma } from '../../config/database';
import { Prisma, ChallanStatus, MovementType } from '@prisma/client';

export class ChallanService {
  static async getAll(filters: any, pagination: { skip: number; take: number; page: number; limit: number }) {
    const where: Prisma.ChallanWhereInput = {};

    if (filters.status) where.status = filters.status;

    const [total, challans] = await Promise.all([
      prisma.challan.count({ where }),
      prisma.challan.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { name: true, businessName: true } },
          createdBy: { select: { name: true } },
        },
      }),
    ]);

    return { data: challans, total };
  }

  static async getById(id: number) {
    return prisma.challan.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
        createdBy: { select: { name: true } },
      },
    });
  }

  static async create(data: { customerId: number; items: { productId: number; quantity: number }[] }, userId: number) {
    return prisma.$transaction(async (tx) => {
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

      const countToday = await tx.challan.count({
        where: {
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
      });

      const seq = String(countToday + 1).padStart(4, '0');
      const challanNumber = 'CH-' + dateStr + '-' + seq;

      let totalQuantity = 0;
      const challanItemsData = [];

      for (const item of data.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error('Product with id ' + item.productId + ' not found');

        totalQuantity += item.quantity;
        challanItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          productName: product.name,
          productSku: product.sku,
          productCategory: product.category,
          unitPrice: product.unitPrice,
        });
      }

      return tx.challan.create({
        data: {
          challanNumber,
          customerId: data.customerId,
          totalQuantity,
          status: ChallanStatus.DRAFT,
          createdById: userId,
          items: {
            create: challanItemsData,
          },
        },
        include: { items: true },
      });
    });
  }

  static async update(id: number, data: { customerId: number; items: { productId: number; quantity: number }[] }, userId: number) {
    return prisma.$transaction(async (tx) => {
      const existingChallan = await tx.challan.findUnique({ where: { id } });
      if (!existingChallan) throw new Error('Challan not found');
      if (existingChallan.status !== ChallanStatus.DRAFT) throw new Error('Only DRAFT challans can be updated');

      await tx.challanItem.deleteMany({ where: { challanId: id } });

      let totalQuantity = 0;
      const challanItemsData = [];

      for (const item of data.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error('Product with id ' + item.productId + ' not found');

        totalQuantity += item.quantity;
        challanItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          productName: product.name,
          productSku: product.sku,
          productCategory: product.category,
          unitPrice: product.unitPrice,
        });
      }

      return tx.challan.update({
        where: { id },
        data: {
          customerId: data.customerId,
          totalQuantity,
          items: {
            create: challanItemsData,
          },
        },
        include: { items: true },
      });
    });
  }

  static async confirm(id: number, userId: number) {
    return prisma.$transaction(async (tx) => {
      const challan = await tx.challan.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!challan) throw new Error('Challan not found');
      if (challan.status !== ChallanStatus.DRAFT) throw new Error('Only DRAFT challans can be confirmed');

      const insufficientStockProducts: string[] = [];
      for (const item of challan.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error('Product ' + item.productName + ' not found');

        if (product.currentStock < item.quantity) {
          insufficientStockProducts.push(product.name + ' (Need: ' + item.quantity + ', Have: ' + product.currentStock + ')');
        }
      }

      if (insufficientStockProducts.length > 0) {
        const error: any = new Error('Insufficient stock for: ' + insufficientStockProducts.join(', '));
        error.statusCode = 400;
        throw error;
      }

      for (const item of challan.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { currentStock: { decrement: item.quantity } },
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            movementType: MovementType.OUT,
            reason: 'Challan ' + challan.challanNumber + ' confirmed',
            createdById: userId,
          },
        });
      }

      return tx.challan.update({
        where: { id },
        data: { status: ChallanStatus.CONFIRMED },
      });
    });
  }

  static async cancel(id: number, userId: number) {
    const challan = await prisma.challan.findUnique({ where: { id } });
    if (!challan) throw new Error('Challan not found');
    if (challan.status !== ChallanStatus.DRAFT) throw new Error('Only DRAFT challans can be cancelled');

    return prisma.challan.update({
      where: { id },
      data: { status: ChallanStatus.CANCELLED },
    });
  }
}
